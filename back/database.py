import firebase_admin
from firebase_admin import credentials, firestore
import os
from datetime import datetime

# Initialize Firebase
try:
    firebase_admin.get_app()
except ValueError:
    if os.path.exists('firebase-credentials.json'):
        cred = credentials.Certificate('firebase-credentials.json')
        firebase_admin.initialize_app(cred)
    else:
        firebase_admin.initialize_app()

# Firestore reference
db = firestore.client()

# Collection references
oficinas_ref = db.collection('oficinas')
participantes_ref = db.collection('participantes')
presencas_ref = db.collection('presencas')

def to_dict(doc):
    """Converts Firestore document to dict with ID"""
    if doc.exists:
        data = doc.to_dict()
        data['id'] = doc.id
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

async def get_presenca(participante_id, oficina_id):
    """Gets attendance record"""
    query = presencas_ref.where('participante_id', '==', participante_id) \
                         .where('oficina_id', '==', oficina_id).limit(1)
    results = query.stream()
    for doc in results:
        return to_dict(doc)
    return None

async def get_presencas_by_oficina(oficina_id):
    """Gets all attendance records for a workshop"""
    query = presencas_ref.where('oficina_id', '==', oficina_id)
    results = query.stream()
    return [to_dict(doc) for doc in results]

async def get_oficinas_by_instrutor(instrutor_id):
    """Gets workshops by instructor"""
    query = oficinas_ref.where('instrutores', 'array_contains', instrutor_id)
    results = query.stream()
    return [to_dict(doc) for doc in results]