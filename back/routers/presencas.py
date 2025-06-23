# back/routers/presencas.py
from typing import List, Optional # Adicione Optional
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
async def registrar_ou_atualizar_presenca( # Nome da função atualizado para clareza
    presenca: PresencaCreate,
    user: dict = Depends(verify_firebase_token)
):
    """
    Registra ou atualiza presenças para uma oficina em uma data específica.
    Se já existir um registro para o dia, ele é atualizado.
    Caso contrário, um novo é criado.
    """
    try:
        data_iso = datetime.fromisoformat(presenca.data).date().isoformat()
        
        # Procura por um registro de presença existente para esta oficina e data
        query = presencas_ref.where('oficina_id', '==', presenca.oficina_id) \
                            .where('data', '==', data_iso) \
                            .limit(1)
        
        docs = list(query.stream())
        
        presenca_dict = presenca.dict()
        presenca_dict['data'] = data_iso
        presenca_dict['registrado_por'] = user['uid']
        
        if docs:
            # Atualiza o documento existente
            doc_ref = docs[0].reference
            update_data = add_timestamp(presenca_dict, update=True)
            doc_ref.update(update_data)
            return {
                "message": "Presenças atualizadas com sucesso",
                "id": doc_ref.id
            }
        else:
            # Cria um novo documento
            insert_data = add_timestamp(presenca_dict)
            _, doc_ref = presencas_ref.add(insert_data)
            return {
                "message": "Presenças registradas com sucesso",
                "id": doc_ref.id
            }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Erro ao processar presenças: {str(e)}"
        )

# NOVO ENDPOINT para buscar presença por data
@router.get("/oficina/{oficina_id}/data/{data_iso}", response_model=Optional[dict])
async def obter_presenca_por_data(
    oficina_id: str,
    data_iso: str, # Formato YYYY-MM-DD
    user: dict = Depends(verify_firebase_token)
):
    """Obtém um registro de presença de uma oficina em uma data específica."""
    try:
        query = presencas_ref.where('oficina_id', '==', oficina_id) \
                            .where('data', '==', data_iso) \
                            .limit(1)
        docs = list(query.stream())
        if docs:
            return to_dict(docs[0])
        return None # Retorna null se não encontrar
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Erro ao buscar presença: {str(e)}"
        )


@router.get("/oficina/{oficina_id}", response_model=List[dict])
async def listar_presencas_por_oficina(
    oficina_id: str,
    user: dict = Depends(verify_firebase_token)
):
    """Lista TODOS os registros de presença por oficina"""
    try:
        query = presencas_ref.where('oficina_id', '==', oficina_id).stream()
        return [to_dict(doc) for doc in query]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Erro ao listar presenças: {str(e)}"
        )