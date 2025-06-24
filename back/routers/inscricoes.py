from fastapi import APIRouter, HTTPException, Depends, status, Header
from typing import List
from datetime import datetime

from firebase_admin import auth
from database import (
    inscricoes_ref,
    participantes_ref,
    oficinas_ref,
    get_inscricao,
    get_participantes_by_oficina,
    get_oficinas_by_participante,
    add_timestamp
)
from models import InscricaoCreate

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
async def inscrever_participante(
    inscricao: InscricaoCreate,
    user: dict = Depends(verify_firebase_token)
):
    """Inscribe a participant in a workshop"""
    participante_doc = participantes_ref.document(inscricao.participante_id).get()
    if not participante_doc.exists:
        raise HTTPException(status_code=404, detail="Participant not found")
    
    oficina_doc = oficinas_ref.document(inscricao.oficina_id).get()
    if not oficina_doc.exists:
        raise HTTPException(status_code=404, detail="Workshop not found")

    existing_inscricao = await get_inscricao(inscricao.participante_id, inscricao.oficina_id)
    if existing_inscricao:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Participant already inscribed in this workshop"
        )
    
    inscricao_dict = inscricao.dict()
    inscricao_dict = add_timestamp(inscricao_dict)
    inscricao_dict["data_inscricao"] = datetime.now().isoformat()
    inscricao_dict["inscrito_por"] = user['uid']
    
    doc_ref = inscricoes_ref.add(inscricao_dict)
    return {"message": "Participant inscribed successfully", "id": doc_ref[1].id}

@router.get("/oficina/{oficina_id}/participantes", response_model=List[dict])
async def listar_participantes_inscritos_por_oficina(
    oficina_id: str,
    user: dict = Depends(verify_firebase_token)
):
    """List participants inscribed in a specific workshop"""
    if not oficinas_ref.document(oficina_id).get().exists:
        raise HTTPException(status_code=404, detail="Workshop not found")
    
    participantes_inscritos = await get_participantes_by_oficina(oficina_id)
    
    return participantes_inscritos

@router.get("/participante/{participante_id}/oficinas", response_model=List[dict])
async def listar_oficinas_inscritas_por_participante(
    participante_id: str,
    user: dict = Depends(verify_firebase_token)
):
    """List workshops a participant is inscribed in"""
    if not participantes_ref.document(participante_id).get().exists:
        raise HTTPException(status_code=404, detail="Participant not found")

    oficinas_inscritas = await get_oficinas_by_participante(participante_id)

    return oficinas_inscritas

@router.delete("/{inscricao_id}", response_model=dict)
async def remover_inscricao(
    inscricao_id: str,
    user: dict = Depends(verify_firebase_token)
):
    """Remove a participant's inscription from a workshop"""
    inscricao_doc_ref = inscricoes_ref.document(inscricao_id)
    if not inscricao_doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="Inscription not found")
    
    inscricao_doc_ref.delete()
    return {"message": "Inscription removed successfully"}