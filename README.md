# Sistema de Registro de Presença - ELLP

## Visão Geral
O Sistema de Registro de Presença ELLP é uma plataforma web desenvolvida para gerenciar oficinas, participantes, inscrições e registros de presença do projeto de extensão ELLP (Ensino Lúdico de Lógica e Programação) da UTFPR.

## Tecnologias Utilizadas
### Frontend

- React.js com Vite
- React Router para navegação
- Firebase Authentication para autenticação de usuários
- Firebase Storage para upload de imagens
- React Icons para ícones
- SweetAlert2 para modais e alertas

### Backend

- FastAPI (Python)
- Firebase Firestore como banco de dados

## Funcionalidades Principais

### Autenticação e Usuários
- Login com Firebase Auth
- Cadastro de novos usuários (com validação de email institucional)
- Proteção de rotas privadas

### Gerenciamento de Oficinas
- Cadastro de novas oficinas (com upload de imagem)
- Listagem de todas as oficinas
- Edição e exclusão de oficinas
- Visualização de cada oficina

### Gerenciamento de Participantes
- Cadastro de participantes (com validação de CPF)
- Listagem de todos os participantes
- Edição e exclusão de participantes
- Visualização de cada participante

### Inscrições
- Inscrição de participantes em oficinas
- Listagem de participantes inscritos por oficina
- Listagem de oficinas inscritas por participante
- Remoção de inscrições

### Registro de Presença
- Marcação de presença/ausência por participante
- Registro por data específica
- Visualização de histórico de presenças
- Atualização de registros existentes

## Estrutura do Projeto
### Frontend (app/frontend/src)
- /hooks: Custom hooks (autenticação, upload de imagens)
- /pages: Componentes de página
- /router: Configuração de rotas
- /services: Integração com Firebase e API
- /styles: Estilos CSS
- /utils: Utilitários (logger)

### Backend (back)
- /routers: Endpoints da API (oficinas, participantes, inscrições, presenças)
- /models: Modelos Pydantic para validação de dados
- /database.py: Conexão com Firestore e operações comuns
- /config.py: Configurações da aplicação
- /main.py: Configuração do FastAPI e inicialização

## Como Executar o Projet
### Pré-requisitos
- Node.js
- Python
- Conta Firebase

### Frontend
1. Navegue até app/frontend
2. Instale as dependências: npm install
3. Configure as variáveis de ambiente no arquivo .env
4. Execute: npm run dev

### Backend
1. Navegue até back
2. Crie um ambiente virtual: python -m venv venv
3. Ative o ambiente virtual
4. Instale as dependências: pip install -r requirements.txt
5. Coloque o arquivo de credenciais do Firebase na pasta back
6. Execute: python main.py

## Variáveis de Ambiente
### Frontend
``` env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### Backend
``` env
ENVIRONMENT=
SECRET_KEY=
ACCESS_TOKEN_EXPIRE_MINUTES=
FIREBASE_CREDENTIALS_PATH=
```