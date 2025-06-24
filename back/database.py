import firebase_admin
from firebase_admin import credentials, firestore
import os
from datetime import datetime, date

try:
    firebase_admin.get_app()
except ValueError:
    if os.path.exists('firebase-credentials.json'):
        cred = credentials.Certificate('firebase-credentials.json')
        firebase_admin.initialize_app(cred)
    else:
        firebase_admin.initialize_app()

db = firestore.client()

oficinas_ref = db.collection('oficinas')
participantes_ref = db.collection('participantes')
inscricoes_ref = db.collection('inscricoes')

def to_dict(doc):
    """Converts Firestore document to dict with ID"""
    if doc.exists:
        data = doc.to_dict()
        data['id'] = doc.id
        for key, value in data.items():
            if isinstance(value, datetime):
                data[key] = value.isoformat()
            elif isinstance(value, date):
                data[key] = value.isoformat()
        return data
    return None

def add_timestamp(data, update=False):
    """Adds timestamp to data before saving"""
    now = datetime.now()
    if update:
        data['data_atualizacao'] = now
    else:
        data['data_criacao'] = now
    return data

async def get_oficina_by_titulo_data(titulo, data):
    """Checks for existing workshop with same title and date"""
    query = oficinas_ref.where('titulo', '==', titulo).where('data', '==', data).limit(1)
    results = query.stream()
    for doc in results:
        return to_dict(doc)
    return None

async def get_participante_by_cpf(cpf):
    """Finds participant by CPF"""
    if not cpf:
        return None
    query = participantes_ref.where('cpf', '==', cpf).limit(1)
    results = query.stream()
    for doc in results:
        return to_dict(doc)
    return None

async def get_oficinas_by_instrutor(instrutor_id):
    """Gets workshops by instructor"""
    query = oficinas_ref.where('instrutores', 'array_contains', instrutor_id)
    results = query.stream()
    return [to_dict(doc) for doc in results]

# NOVAS FUNÇÕES PARA INSCRIÇÕES (Mantenha estas)
async def get_inscricao(participante_id: str, oficina_id: str):
    """Checks if a participant is already subscribed to a workshop"""
    query = inscricoes_ref.where('participante_id', '==', participante_id) \
                            .where('oficina_id', '==', oficina_id).limit(1)
    results = query.stream()
    for doc in results:
        return to_dict(doc)
    return None

async def get_participantes_by_oficina(oficina_id: str):
    """Gets all participants subscribed to a specific workshop"""
    query = inscricoes_ref.where('oficina_id', '==', oficina_id)
    inscricoes_docs = query.stream()
    
    result_data = []
    participante_ids = []
    inscricao_map = {}

    for doc in inscricoes_docs:
        insc_data = to_dict(doc)
        participante_id = insc_data.get('participante_id')
        if participante_id:
            participante_ids.append(participante_id)
            inscricao_map[participante_id] = insc_data['id']

    if not participante_ids:
        return []

    for i in range(0, len(participante_ids), 10):
        chunk = participante_ids[i:i + 10]
        doc_refs = [participantes_ref.document(pid) for pid in chunk]
        snapshots = db.get_all(doc_refs)
        for snapshot in snapshots:
            if snapshot.exists:
                participant_data = to_dict(snapshot)
                participant_data['inscricao_id'] = inscricao_map.get(participant_data['id'])
                result_data.append(participant_data)
    return result_data

async def get_oficinas_by_participante(participante_id: str):
    """Gets all workshops a participant is subscribed to"""
    query = inscricoes_ref.where('participante_id', '==', participante_id)
    inscricoes = [to_dict(doc) for doc in query.stream()]
    
    oficina_ids = [insc.get('oficina_id') for insc in inscricoes if insc.get('oficina_id')]
    if not oficina_ids:
        return []

    if len(oficina_ids) > 10:
        all_oficinas_data = []
        for i in range(0, len(oficina_ids), 10):
            chunk = oficina_ids[i:i + 10]
            chunk_query = oficinas_ref.where(firestore.FieldPath.document_id(), 'in', chunk)
            chunk_results = [to_dict(doc) for doc in chunk_query.stream()]
            all_oficinas_data.extend(chunk_results)
        return all_oficinas_data
    else:
        query_oficinas = oficinas_ref.where(firestore.FieldPath.document_id(), 'in', oficina_ids)
        return [to_dict(doc) for doc in query_oficinas.stream()]