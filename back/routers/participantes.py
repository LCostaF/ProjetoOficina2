from fastapi import APIRouter, HTTPException, Depends, status, Query, Header
from typing import List, Optional
from datetime import date

from firebase_admin import auth
from database import (
    participantes_ref, 
    get_participante_by_cpf, 
    to_dict, 
    add_timestamp
)
from models import ParticipanteCreate

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
async def cadastrar_participante(
    participante: ParticipanteCreate, 
    user: dict = Depends(verify_firebase_token)
):
    """Register new participant"""
    if participante.cpf:
        participante_existente = await get_participante_by_cpf(participante.cpf)
        if participante_existente:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Participant with this CPF already exists"
            )
    
    participante_dict = participante.dict()
    participante_dict["data_nascimento"] = participante.data_nascimento.isoformat()
    participante_dict = add_timestamp(participante_dict)
    participante_dict["cadastrado_por"] = user['uid']
    
    doc_ref = participantes_ref.add(participante_dict)
    return {"message": "Participant registered successfully", "id": doc_ref[1].id}

@router.get("/", response_model=List[dict])
async def listar_participantes(
    user: dict = Depends(verify_firebase_token),
    nome: Optional[str] = Query(None),
    instituicao: Optional[str] = Query(None)
):
    """List participants with optional filters"""
    participantes_stream = participantes_ref.stream()
    participantes = [to_dict(doc) for doc in participantes_stream]
    
    if nome or instituicao:
        filtered = []
        for p in participantes:
            if nome and nome.lower() not in p["nome"].lower():
                continue
            if instituicao and instituicao.lower() not in p["instituicao"].lower():
                continue
            filtered.append(p)
        participantes = filtered
    
    return participantes

@router.get("/{participante_id}", response_model=dict)
async def obter_participante(
    participante_id: str, 
    user: dict = Depends(verify_firebase_token)
):
    """Get participant details"""
    doc = participantes_ref.document(participante_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Participant not found")
    
    participante = to_dict(doc)
    birth_date = date.fromisoformat(participante["data_nascimento"])
    today = date.today()
    age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
    participante["idade"] = age
    
    return participante

@router.put("/{participante_id}", response_model=dict)
async def atualizar_participante(
    participante_id: str,
    participante: ParticipanteCreate,
    user: dict = Depends(verify_firebase_token)
):
    """Update participant"""
    participante_ref = participantes_ref.document(participante_id)
    doc = participante_ref.get()
    
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Participant not found")
    
    current_data = to_dict(doc)
    if participante.cpf and participante.cpf != current_data.get("cpf"):
        existing = await get_participante_by_cpf(participante.cpf)
        if existing and existing["id"] != participante_id:
            raise HTTPException(status_code=400, detail="CPF already in use")
    
    update_data = participante.dict()
    update_data["data_nascimento"] = participante.data_nascimento.isoformat()
    update_data = add_timestamp(update_data, update=True)
    update_data["atualizado_por"] = user['uid']
    
    participante_ref.update(update_data)
    return {"message": "Participant updated successfully"}

@router.delete("/{participante_id}", response_model=dict)
async def excluir_participante(
    participante_id: str, 
    user: dict = Depends(verify_firebase_token)
):
    """Delete participant"""
    participante_ref = participantes_ref.document(participante_id)
    if not participante_ref.get().exists:
        raise HTTPException(status_code=404, detail="Participant not found")
    participante_ref.delete()
    return {"message": "Participant deleted successfully"}