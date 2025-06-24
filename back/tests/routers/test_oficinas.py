from fastapi import status
from unittest.mock import MagicMock

def test_criar_oficina_sucesso(api_client, mock_database_functions, sample_oficina_payload, mock_user_token):
    """
    Caso de Teste 2.4: Criar uma nova oficina com sucesso.
    """
    # Arrange
    mock_database_functions["get_oficina_by_titulo_data"].return_value = None
    mock_doc_ref = MagicMock()
    mock_doc_ref.id = "new_oficina_id_123"
    mock_database_functions["oficinas_ref"].add.return_value = (None, mock_doc_ref)

    # Act
    response = api_client.post("/api/oficinas/", json=sample_oficina_payload)

    # Assert
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["message"] == "Workshop created successfully"
    assert data["id"] == "new_oficina_id_123"

    call_args = mock_database_functions["oficinas_ref"].add.call_args[0][0]
    assert call_args["instrutores"] == [mock_user_token["uid"]]
    assert call_args["titulo"] == sample_oficina_payload["titulo"]

def test_criar_oficina_duplicada(api_client, mock_database_functions, sample_oficina_payload):
    """
    Caso de Teste 2.5: Tentar criar oficina com título e data duplicados.
    """
    # Arrange
    mock_database_functions["get_oficina_by_titulo_data"].return_value = {"id": "existing_id"}

    # Act
    response = api_client.post("/api/oficinas/", json=sample_oficina_payload)

    # Assert
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "already exists" in response.json()["detail"]

def test_obter_oficina_nao_encontrada(api_client, mock_database_functions):
    """
    Caso de Teste 2.12: Tentar obter uma oficina inexistente.
    """
    # Arrange
    mock_get_result = MagicMock()
    mock_get_result.exists = False
    mock_database_functions["oficinas_ref"].document.return_value.get.return_value = mock_get_result

    # Act
    response = api_client.get("/api/oficinas/id_inexistente")

    # Assert
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert "Workshop not found" in response.json()["detail"]

def test_excluir_oficina_sucesso(api_client, mock_database_functions):
    """
    Caso de Teste 2.20: Excluir uma oficina existente.
    """
    # Arrange
    mock_doc_ref = mock_database_functions["oficinas_ref"].document.return_value
    mock_doc_ref.get.return_value.exists = True

    # Act
    response = api_client.delete("/api/oficinas/id_existente")

    # Assert
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["message"] == "Workshop deleted successfully"
    mock_doc_ref.delete.assert_called_once()