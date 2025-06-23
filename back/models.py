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

class InscricaoBase(BaseModel):
    participante_id: str
    oficina_id: str

class InscricaoCreate(InscricaoBase):
    pass

class Inscricao(InscricaoBase):
    id: str
    data_inscricao: datetime
    inscrito_por: str
    
    class Config:
        orm_mode = True

class PresencaBase(BaseModel):
    oficina_id: str
    data: str  # formato ISO (YYYY-MM-DD)
    participantes_presentes: List[str]

class PresencaCreate(PresencaBase):
    pass

class Presenca(PresencaBase):
    id: str
    registrado_por: str
    data_registro: datetime
    
    class Config:
        orm_mode = True