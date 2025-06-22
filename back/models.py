from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, date

class OficinaBase(BaseModel):
    titulo: str = Field(..., min_length=3, max_length=100)
    descricao: str = Field(..., min_length=10, max_length=500)
    data: date
    hora_inicio: str
    hora_fim: str
    local: str = Field(..., min_length=3, max_length=100)
    imagem_url: Optional[str] = Field(None, description="URL da imagem da oficina") # NOVO CAMPO

class OficinaCreate(OficinaBase):
    pass

class Oficina(OficinaBase):
    id: str
    instrutores: List[str] = []
    data_criacao: datetime
    # data_atualizacao: Optional[datetime] # Adicione se quiser um campo de atualização

    class Config:
        orm_mode = True

class ParticipanteBase(BaseModel):
    nome: str = Field(..., min_length=3, max_length=100)
    cpf: Optional[str] = Field(None, min_length=11, max_length=14)
    data_nascimento: date
    instituicao: str = Field(..., min_length=3, max_length=100)

class ParticipanteCreate(ParticipanteBase):
    pass

class Participante(ParticipanteBase):
    id: str
    data_cadastro: datetime
    
    class Config:
        orm_mode = True

class PresencaBase(BaseModel):
    participante_id: str
    oficina_id: str
    presente: bool = False

class PresencaCreate(PresencaBase):
    pass

class Presenca(PresencaBase):
    id: str
    data_registro: datetime
    registrado_por: str
    
    class Config:
        orm_mode = True

class RelatorioOficina(BaseModel):
    oficina: Oficina
    total_participantes: int
    presentes: int
    ausentes: int
    taxa_presenca: float