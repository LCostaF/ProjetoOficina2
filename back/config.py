import os
from pydantic import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    """
    Configurações da aplicação carregadas de variáveis de ambiente.
    """
    # Configurações da API
    API_TITLE: str = "API de Registro de Presença - ELLP"
    API_DESCRIPTION: str = "API para gestão de presenças nas oficinas do projeto ELLP da UTFPR"
    API_VERSION: str = "1.0.0"
    
    # Configurações de segurança
    SECRET_KEY: str = os.getenv("SECRET_KEY", "seusecretkeysupersecreto")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Configurações do ambiente
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Configurações do Firebase (para desenvolvimento local)
    FIREBASE_CREDENTIALS_PATH: str = os.getenv(
        "FIREBASE_CREDENTIALS_PATH", 
        "firebase-credentials.json"
    )
    
    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache()
def get_settings():
    return Settings()