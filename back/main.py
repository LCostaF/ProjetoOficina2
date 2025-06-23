from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from routers import oficinas, participantes, inscricoes, presencas

app = FastAPI(
    title="API de Registro de Presença - ELLP",
    description="API para gestão de presenças nas oficinas do projeto ELLP da UTFPR",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusão dos routers
app.include_router(oficinas.router, prefix="/api/oficinas", tags=["Oficinas"])
app.include_router(participantes.router, prefix="/api/participantes", tags=["Participantes"])
app.include_router(inscricoes.router, prefix="/api/inscricoes", tags=["Inscrições"])
app.include_router(presencas.router, prefix="/api/presencas", tags=["Presenças"])

@app.get("/", tags=["Raiz"])
async def root():
    return {
        "mensagem": "API do Sistema de Registro de Presença - ELLP",
        "documentacao": "/docs",
        "versao": "1.0.0"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)