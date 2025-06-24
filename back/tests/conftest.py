import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock, AsyncMock
from datetime import datetime, date
from main import app
from routers import oficinas, participantes, inscricoes, presencas


@pytest.fixture(scope="module")
def api_client():
    with TestClient(app) as client:
        yield client

@pytest.fixture
def mock_user_token():
    return {"uid": "test_user_uid_123", "name": "Usuário de Teste"}

@pytest.fixture(autouse=True)
def override_auth_dependency(mock_user_token):
    async def mock_verify():
        return mock_user_token

    app.dependency_overrides[oficinas.verify_firebase_token] = mock_verify
    app.dependency_overrides[participantes.verify_firebase_token] = mock_verify
    app.dependency_overrides[inscricoes.verify_firebase_token] = mock_verify
    app.dependency_overrides[presencas.verify_firebase_token] = mock_verify

    yield

    app.dependency_overrides = {}

@pytest.fixture
def mock_database_functions():
    with patch('routers.oficinas.oficinas_ref', new_callable=MagicMock) as mock_oficinas_ref, \
            patch('routers.oficinas.get_oficina_by_titulo_data', new_callable=AsyncMock) as mock_get_oficina_titulo, \
            patch('routers.oficinas.get_oficinas_by_instrutor', new_callable=AsyncMock) as mock_get_oficinas_instrutor, \
            patch('routers.oficinas.firestore', new_callable=MagicMock) as mock_firestore_oficinas, \
    \
            patch('routers.participantes.participantes_ref', new_callable=MagicMock) as mock_participantes_ref, \
            patch('routers.participantes.get_participante_by_cpf', new_callable=AsyncMock) as mock_get_participante_cpf, \
    \
            patch('routers.inscricoes.inscricoes_ref', new_callable=MagicMock) as mock_inscricoes_ref, \
            patch('routers.inscricoes.participantes_ref', new_callable=MagicMock) as mock_insc_participantes_ref, \
            patch('routers.inscricoes.oficinas_ref', new_callable=MagicMock) as mock_insc_oficinas_ref, \
            patch('routers.inscricoes.get_inscricao', new_callable=AsyncMock) as mock_get_inscricao, \
            patch('routers.inscricoes.get_participantes_by_oficina', new_callable=AsyncMock) as mock_get_participantes_oficina, \
            patch('routers.inscricoes.get_oficinas_by_participante', new_callable=AsyncMock) as mock_get_oficinas_participante, \
    \
            patch('routers.presencas.presencas_ref', new_callable=MagicMock) as mock_presencas_ref:

        mocks = {
            "oficinas_ref": mock_oficinas_ref,
            "get_oficina_by_titulo_data": mock_get_oficina_titulo,
            "get_oficinas_by_instrutor": mock_get_oficinas_instrutor,
            "firestore_oficinas": mock_firestore_oficinas,

            "participantes_ref": mock_participantes_ref,
            "get_participante_by_cpf": mock_get_participante_cpf,

            "inscricoes_ref": mock_inscricoes_ref,
            "insc_participantes_ref": mock_insc_participantes_ref,
            "insc_oficinas_ref": mock_insc_oficinas_ref,
            "get_inscricao": mock_get_inscricao,
            "get_participantes_by_oficina": mock_get_participantes_oficina,
            "get_oficinas_by_participante": mock_get_oficinas_participante,

            "presencas_ref": mock_presencas_ref,
        }

        mocks["insc_participantes_ref"].document.return_value.get.return_value.exists = True
        mocks["insc_oficinas_ref"].document.return_value.get.return_value.exists = True

        yield mocks


@pytest.fixture
def sample_oficina_payload():
    return {
        "titulo": "Oficina de Pytest",
        "descricao": "Uma oficina incrível para aprender a testar APIs com Pytest e FastAPI.",
        "data": "2024-10-26",
        "hora_inicio": "14:00",
        "hora_fim": "18:00",
        "local": "Laboratório de Inovação",
        "imagem_url": "http://example.com/image.png"
    }

@pytest.fixture
def sample_participante_payload():
    return {
        "nome": "João da Silva Teste",
        "cpf": "12345678901",
        "data_nascimento": "1995-05-15",
        "instituicao": "UTFPR"
    }