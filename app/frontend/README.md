# ELLP - Sistema de Registro de Presença (Frontend)
# Sistema de Registro de Presença - ELLP

Frontend do sistema de registro de presença para o projeto ELLP da UTFPR.



### Requisitos

- Node.js (versão 18 ou superior)
- npm (versão 8 ou superior)

## Tecnologias Utilizadas

- React 19.1.0
- React Router DOM 7.6.0
- Firebase Authentication
- Vite 6.3.5

## Configuração do Ambiente

### Pré-requisitos

- Node.js (versão recomendada: 18.x ou superior)
- npm (gerenciador de pacotes do Node.js)

### Instalação

1. Clone o repositório
2. Navegue até a pasta do frontend:
   ```bash
   cd app/frontend
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```

### Configuração do Firebase

Crie um arquivo `.env.local` na raiz da pasta `app/frontend` com as seguintes variáveis:

```
VITE_FIREBASE_API_KEY=sua-api-key
VITE_FIREBASE_AUTH_DOMAIN=seu-auth-domain
VITE_FIREBASE_PROJECT_ID=seu-project-id
VITE_FIREBASE_APP_ID=seu-app-id
```

## Executando o Projeto

Para iniciar o servidor de desenvolvimento:

```bash
cd app/frontend
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`.

## Estrutura do Projeto

- `src/`
  - `hooks/` - Hooks personalizados do React
  - `pages/` - Componentes de páginas
  - `router/` - Configuração de rotas
  - `services/` - Serviços (Firebase, API, etc.)
  - `styles/` - Arquivos CSS

## Construindo para Produção

Para criar uma build de produção:

```bash
npm run build
```

Os arquivos de build serão gerados na pasta `dist/`.
