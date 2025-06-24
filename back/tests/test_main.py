from fastapi import status

def test_read_root(api_client):
    """
    Testa o endpoint raiz (GET /).
    Verifica se a API responde corretamente com a mensagem de boas-vindas.
    """
    # Ação
    response = api_client.get("/")

    # Assertivas
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["mensagem"] == "API do Sistema de Registro de Presença - ELLP"
    assert data["versao"] == "1.0.0"