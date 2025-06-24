from fastapi import status
from unittest.mock import MagicMock
from datetime import datetime

def test_registrar_presenca_primeira_vez(api_client, mock_database_functions):
    """
    Caso de Teste 5.1: Registrar presença pela primeira vez (criação).
    """
    # Arrange
    data_hoje = datetime.now().date().isoformat()
    presenca_payload = {
        "oficina_id": "oficina_presenca_1",
        "data": data_hoje,
        "participantes_presentes": ["p1", "p2"]
    }

    mock_query_stream = mock_database_functions["presencas_ref"].where.return_value.where.return_value.limit.return_value
    mock_query_stream.stream.return_value = []

    mock_doc_ref = MagicMock()
    mock_doc_ref.id = "new_presenca_id_abc"
    mock_database_functions["presencas_ref"].add.return_value = (None, mock_doc_ref)

    # Act
    response = api_client.post("/api/presencas/", json=presenca_payload)

    # Assert
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["message"] == "Presenças registradas com sucesso"
    assert data["id"] == "new_presenca_id_abc"
    mock_database_functions["presencas_ref"].add.assert_called_once()

def test_atualizar_presenca_existente(api_client, mock_database_functions):
    """
    Caso de Teste 5.2: Atualizar uma lista de presença existente.
    """
    # Arrange
    data_hoje = datetime.now().date().isoformat()
    presenca_payload = {
        "oficina_id": "oficina_presenca_1",
        "data": data_hoje,
        "participantes_presentes": ["p1", "p2", "p3"]
    }

    mock_doc_existente = MagicMock()
    mock_doc_existente.reference.id = "existing_presenca_id_xyz"
    mock_query_stream = mock_database_functions["presencas_ref"].where.return_value.where.return_value.limit.return_value
    mock_query_stream.stream.return_value = [mock_doc_existente]

    # Act
    response = api_client.post("/api/presencas/", json=presenca_payload)

    # Assert
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["message"] == "Presenças atualizadas com sucesso"
    assert data["id"] == "existing_presenca_id_xyz"
    mock_doc_existente.reference.update.assert_called_once()