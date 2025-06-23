# back/routers/presencas.py
from typing import List
from fastapi import APIRouter, HTTPException, Depends, status, Header
from datetime import datetime
from firebase_admin import firestore, auth

from database import db, add_timestamp, to_dict
from models import PresencaCreate

router = APIRouter()

# Coleção Firestore
presencas_ref = db.collection('presencas')

async def verify_firebase_token(authorization: str = Header(...)):
    """Verifica o token Firebase"""
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Esquema de autenticação inválido"
        )
    
    token = authorization.split("Bearer ")[1]
    try:
        return auth.verify_id_token(token)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token inválido: {str(e)}"
        )

@router.post("/", status_code=status.HTTP_201_CREATED)
async def registrar_presenca(
    presenca: PresencaCreate,
    user: dict = Depends(verify_firebase_token)
):
    """Registra presenças para uma oficina"""
    try:
        presenca_dict = presenca.dict()
        presenca_dict = add_timestamp(presenca_dict)
        presenca_dict['registrado_por'] = user['uid']
        
        # Converte a string de data para timestamp
        presenca_dict['data'] = datetime.fromisoformat(presenca.data).date().isoformat()
        
        _, doc_ref = presencas_ref.add(presenca_dict)
        
        return {
            "message": "Presenças registradas com sucesso",
            "id": doc_ref.id
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Erro ao registrar presenças: {str(e)}"
        )

@router.get("/oficina/{oficina_id}", response_model=List[dict])
async def listar_presencas_por_oficina(
    oficina_id: str,
    user: dict = Depends(verify_firebase_token)
):
    """Lista registros de presença por oficina"""
    try:
        query = presencas_ref.where('oficina_id', '==', oficina_id).stream()
        return [to_dict(doc) for doc in query]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Erro ao listar presenças: {str(e)}"
        )