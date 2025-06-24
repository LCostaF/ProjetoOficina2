from fastapi import status
from unittest.mock import MagicMock

def test_cadastrar_participante_sucesso(api_client, mock_database_functions, sample_participante_payload):
    """
    Caso de Teste 3.1: Cadastrar um novo participante com sucesso.
    """
    # Arrange
    mock_database_functions["get_participante_by_cpf"].return_value = None
    mock_doc_ref = MagicMock()
    mock_doc_ref.id = "new_participant_id_456"
    mock_database_functions["participantes_ref"].add.return_value = (None, mock_doc_ref)

    # Act
    response = api_client.post("/api/participantes/", json=sample_participante_payload)

    # Assert
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["message"] == "Participant registered successfully"
    assert data["id"] == "new_participant_id_456"

def test_cadastrar_participante_cpf_duplicado(api_client, mock_database_functions, sample_participante_payload):
    """
    Caso de Teste 3.2: Tentar cadastrar participante com CPF já existente.
    """
    # Arrange
    mock_database_functions["get_participante_by_cpf"].return_value = {"id": "existing_id"}

    # Act
    response = api_client.post("/api/participantes/", json=sample_participante_payload)

    # Assert
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "CPF already exists" in response.json()["detail"]

def test_obter_participante_com_calculo_idade(api_client, mock_database_functions):
    """
    Caso de Teste 3.4: Obter um participante e verificar cálculo da idade.
    """
    # Arrange
    mock_get_result = MagicMock()
    mock_get_result.exists = True
    mock_get_result.to_dict.return_value = {
        "nome": "Fulano de Tal",
        "data_nascimento": "2000-01-01" # A idade dependerá da data atual
    }
    mock_get_result.id = "participant_id_1"
    mock_database_functions["participantes_ref"].document.return_value.get.return_value = mock_get_result

    # Act
    response = api_client.get("/api/participantes/participant_id_1")

    # Assert
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "idade" in data
    assert isinstance(data["idade"], int)
    assert data["idade"] > 20 # Um check simples