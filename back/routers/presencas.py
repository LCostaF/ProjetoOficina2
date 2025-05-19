from fastapi import APIRouter, HTTPException, Depends, status, Header
from typing import List
from datetime import datetime

from firebase_admin import auth, firestore
from database import (
    presencas_ref, 
    oficinas_ref,
    participantes_ref,
    get_presenca, 
    get_presencas_by_oficina,
    to_dict, 
    add_timestamp
)
from models import PresencaCreate

router = APIRouter()

async def verify_firebase_token(authorization: str = Header(...)):
    """Verify Firebase ID token"""
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication scheme"
        )
    
    token = authorization.split("Bearer ")[1]
    try:
        return auth.verify_id_token(token)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}"
        )

@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
async def registrar_presenca(
    presenca: PresencaCreate, 
    user: dict = Depends(verify_firebase_token)
):
    """Register attendance"""
    # Verify workshop exists
    oficina_doc = oficinas_ref.document(presenca.oficina_id).get()
    if not oficina_doc.exists:
        raise HTTPException(status_code=404, detail="Workshop not found")
    
    # Verify participant exists
    participante_doc = participantes_ref.document(presenca.participante_id).get()
    if not participante_doc.exists:
        raise HTTPException(status_code=404, detail="Participant not found")
    
    # Check for existing attendance record
    existing = await get_presenca(presenca.participante_id, presenca.oficina_id)
    
    if existing:
        presenca_ref = presencas_ref.document(existing["id"])
        presenca_ref.update({
            "presente": presenca.presente,
            "data_atualizacao": datetime.now(),
            "atualizado_por": user['uid']
        })
        return {"message": "Attendance updated", "id": existing["id"]}
    
    # Create new record
    presenca_dict = presenca.dict()
    presenca_dict = add_timestamp(presenca_dict)
    presenca_dict["registrado_por"] = user['uid']
    
    doc_ref = presencas_ref.add(presenca_dict)
    return {"message": "Attendance registered", "id": doc_ref[1].id}

@router.get("/oficina/{oficina_id}", response_model=List[dict])
async def listar_presencas_por_oficina(
    oficina_id: str, 
    user: dict = Depends(verify_firebase_token)
):
    """List attendance for a workshop"""
    if not oficinas_ref.document(oficina_id).get().exists:
        raise HTTPException(status_code=404, detail="Workshop not found")
    
    presencas = await get_presencas_by_oficina(oficina_id)
    
    for p in presencas:
        participante = participantes_ref.document(p["participante_id"]).get()
        if participante.exists:
            p["participante_nome"] = participante.to_dict().get("nome")
            p["participante_instituicao"] = participante.to_dict().get("instituicao")
    
    return presencas

@router.get("/relatorio/oficina/{oficina_id}", response_model=dict)
async def gerar_relatorio_oficina(
    oficina_id: str,
    user: dict = Depends(verify_firebase_token)
):
    """Generate workshop attendance report"""
    oficina_doc = oficinas_ref.document(oficina_id).get()
    if not oficina_doc.exists:
        raise HTTPException(status_code=404, detail="Workshop not found")
    
    oficina = to_dict(oficina_doc)
    presencas = await get_presencas_by_oficina(oficina_id)
    
    total = len(presencas)
    presentes = sum(1 for p in presencas if p.get("presente", False))
    ausentes = total - presentes
    taxa = (presentes / total) * 100 if total > 0 else 0
    
    return {
        "oficina": oficina,
        "total_participantes": total,
        "presentes": presentes,
        "ausentes": ausentes,
        "taxa_presenca": round(taxa, 2)
    }

@router.delete("/{presenca_id}", response_model=dict)
async def excluir_presenca(
    presenca_id: str, 
    user: dict = Depends(verify_firebase_token)
):
    """Delete attendance record"""
    presenca_ref = presencas_ref.document(presenca_id)
    if not presenca_ref.get().exists:
        raise HTTPException(status_code=404, detail="Record not found")
    presenca_ref.delete()
    return {"message": "Attendance record deleted"}