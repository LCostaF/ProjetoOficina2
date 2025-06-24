from fastapi import status
from unittest.mock import MagicMock

def test_inscrever_participante_sucesso(api_client, mock_database_functions):
    """
    Caso de Teste 4.1: Inscrever um participante em uma oficina com sucesso.
    """
    # Arrange
    inscricao_payload = {"participante_id": "p1", "oficina_id": "o1"}

    mock_database_functions["participantes_ref"].document.return_value.get.return_value.exists = True
    mock_database_functions["oficinas_ref"].document.return_value.get.return_value.exists = True

    mock_database_functions["get_inscricao"].return_value = None
    mock_doc_ref = MagicMock()
    mock_doc_ref.id = "new_inscricao_id_789"
    mock_database_functions["inscricoes_ref"].add.return_value = (None, mock_doc_ref)

    # Act
    response = api_client.post("/api/inscricoes/", json=inscricao_payload)

    # Assert
    assert response.status_code == status.HTTP_201_CREATED
    assert response.json()["id"] == "new_inscricao_id_789"

def test_inscrever_participante_ja_inscrito(api_client, mock_database_functions):
    """
    Caso de Teste 4.2: Tentar inscrever um participante já inscrito.
    """
    # Arrange
    inscricao_payload = {"participante_id": "p1", "oficina_id": "o1"}
    mock_database_functions["participantes_ref"].document.return_value.get.return_value.exists = True
    mock_database_functions["oficinas_ref"].document.return_value.get.return_value.exists = True
    mock_database_functions["get_inscricao"].return_value = {"id": "existing_insc_id"}

    # Act
    response = api_client.post("/api/inscricoes/", json=inscricao_payload)

    # Assert
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "already inscribed" in response.json()["detail"]