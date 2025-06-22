from fastapi import APIRouter, HTTPException, Depends, status, Query, Header
from firebase_admin import firestore, auth
from typing import List, Optional
from datetime import date, datetime

from database import (
    oficinas_ref, 
    get_oficina_by_titulo_data, 
    to_dict, 
    add_timestamp,
    get_oficinas_by_instrutor,
    get_presencas_by_oficina
)

from models import OficinaCreate, OficinaBase

router = APIRouter()

async def verify_firebase_token(authorization: str = Header(...)):
    """Verify Firebase ID token from Authorization header"""
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication scheme"
        )
    
    token = authorization.split("Bearer ")[1]
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}"
        )

@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
async def criar_oficina(
    oficina: OficinaCreate,
    user: dict = Depends(verify_firebase_token)
):
    """Create a new workshop"""
    data_str = oficina.data.isoformat()

    oficina_existente = await get_oficina_by_titulo_data(oficina.titulo, data_str)
    if oficina_existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Workshop with this title and date already exists"
        )

    oficina_dict = oficina.dict()
    oficina_dict["data"] = data_str
    oficina_dict["instrutores"] = [user['uid']]

    oficina_dict = add_timestamp(oficina_dict)

    doc_ref = oficinas_ref.add(oficina_dict)

    return {"message": "Workshop created successfully", "id": doc_ref[1].id}

@router.get("/", response_model=List[dict])
async def listar_oficinas(
    user: dict = Depends(verify_firebase_token),
    data_inicio: Optional[date] = None,
    data_fim: Optional[date] = None,
    apenas_minhas: bool = Query(False)
):
    """List workshops with optional filters"""
    if apenas_minhas:
        oficinas = await get_oficinas_by_instrutor(user['uid'])
    else:
        oficinas_stream = oficinas_ref.order_by('data').stream()
        oficinas = [to_dict(doc) for doc in oficinas_stream]

    if data_inicio or data_fim:
        filtered = []
        for oficina in oficinas:
            workshop_date = date.fromisoformat(oficina["data"])
            if data_inicio and workshop_date < data_inicio:
                continue
            if data_fim and workshop_date > data_fim:
                continue
            filtered.append(oficina)
        oficinas = filtered

    return oficinas

@router.get("/{oficina_id}", response_model=dict)
async def obter_oficina(
    oficina_id: str,
    user: dict = Depends(verify_firebase_token)
):
    """Get workshop details"""
    doc = oficinas_ref.document(oficina_id).get()
    if not doc.exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workshop not found"
        )
    return to_dict(doc)

@router.put("/{oficina_id}", response_model=dict)
async def atualizar_oficina(
    oficina_id: str,
    oficina: OficinaCreate,
    user: dict = Depends(verify_firebase_token)
):
    """Update workshop details"""
    oficina_doc_ref = oficinas_ref.document(oficina_id)
    existing_oficina = oficina_doc_ref.get()

    if not existing_oficina.exists:
        raise HTTPException(status_code=404, detail="Workshop not found")

    data_str = oficina.data.isoformat()
    current_data = to_dict(existing_oficina)

    if (oficina.titulo != current_data.get('titulo') or data_str != current_data.get('data')):
        oficina_existente = await get_oficina_by_titulo_data(oficina.titulo, data_str)
        if oficina_existente and oficina_existente['id'] != oficina_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Workshop with this title and date already exists"
            )

    update_data = oficina.dict(exclude_unset=True)
    update_data["data"] = data_str
    update_data = add_timestamp(update_data, update=True)

    if 'instrutores' not in update_data:
        update_data['instrutores'] = current_data.get('instrutores', [])

    oficina_doc_ref.update(update_data)
    return {"message": "Workshop updated successfully"}


@router.put("/{oficina_id}/instrutores", response_model=dict)
async def adicionar_instrutor(
    oficina_id: str,
    instrutor_id: str,
    user: dict = Depends(verify_firebase_token)
):
    """Add instructor to workshop"""
    oficina_ref = oficinas_ref.document(oficina_id)
    oficina = oficina_ref.get()

    if not oficina.exists:
        raise HTTPException(status_code=404, detail="Workshop not found")

    oficina_dict = to_dict(oficina)
    if instrutor_id in oficina_dict.get("instrutores", []):
        raise HTTPException(status_code=400, detail="Instructor already added")

    oficina_ref.update({"instrutores": firestore.ArrayUnion([instrutor_id])})
    return {"message": "Instructor added successfully"}

@router.delete("/{oficina_id}/instrutores/{instrutor_id}", response_model=dict)
async def remover_instrutor(
    oficina_id: str,
    instrutor_id: str,
    user: dict = Depends(verify_firebase_token)
):
    """Remove instructor from workshop"""
    oficina_ref = oficinas_ref.document(oficina_id)
    oficina = oficina_ref.get()

    if not oficina.exists:
        raise HTTPException(status_code=404, detail="Workshop not found")

    oficina_dict = to_dict(oficina)
    if instrutor_id not in oficina_dict.get("instrutores", []):
        raise HTTPException(status_code=400, detail="Instructor not found")

    oficina_ref.update({"instrutores": firestore.ArrayRemove([instrutor_id])})
    return {"message": "Instructor removed successfully"}

@router.delete("/{oficina_id}", response_model=dict)
async def excluir_oficina(
    oficina_id: str,
    user: dict = Depends(verify_firebase_token)
):
    """Delete workshop"""
    oficina_ref = oficinas_ref.document(oficina_id)
    if not oficina_ref.get().exists:
        raise HTTPException(status_code=404, detail="Workshop not found")

    presencas_associadas = await get_presencas_by_oficina(oficina_id)
    if presencas_associadas:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Não é possível excluir esta oficina: existem registros de presença associados."
        )

    oficina_ref.delete()
    return {"message": "Workshop deleted successfully"}