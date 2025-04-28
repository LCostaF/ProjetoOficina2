<div align="center" style="display: display_block">

# Registro de Presença para o projeto ELLP

</div>

<div align="center">
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" width="100" height="100" />
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" width="100" height="100" />
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg" width="100" height="100" />
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" width="100" height="100" />        
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" width="100" height="100" />
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg" width="100" height="100" />       
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg" width="100" height="100" />
</div>

<div align="center">
<table>
  <tr>
    <td align="center">
      <a href="https://github.com/Warier">
        <img src="https://avatars.githubusercontent.com/u/69541908?v=4" width="100px;" alt="Warier"/><br>
        <sub>
          <b>Felippe Machado Nunes de Oliveira - Warier</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Mei0-Metr0">
        <img src="https://avatars.githubusercontent.com/u/163468366?v=4" width="100px;" alt="Mei0-Metr0"/><br>
        <sub>
          <b>Joice Kelly Oliveira Mendes - Mei0-Metr0</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/LCostaF">
        <img src="https://avatars.githubusercontent.com/u/146568540?v=4" width="100px;" alt="LCostaF"/><br>
        <sub>
          <b>Lucas Costa Fuganti - LCostaF</b>
        </sub>
      </a>
    </td>
  </tr>
</table>
</div>

---

## Introdução

</div>

Este repositório tem por objetivo servir como uma plataforma para o desenvolvimento de uma ferramenta de gestão para o **registro de presença em aulas pelos alunos que frequentam as oficinas de ensino do projeto** ELLP, da Universidade Tecnológica Federal do Paraná (UTFPR), câmpus Cornélio Procópio.

Neste arquivo será descrito o projeto em si, tratando de seus requisitos, objetivos a serem alcançados, diagramas desenvolvidos, instruções para instalação e uso, e tecnologias utilizadas.

O projeto trata de uma proposta de desenvolvimento para a disciplina **Oficina de Integração 2**, e será desenvolvido pelos alunos:

<div align="center" style="display: display_block">

|  Aluno  |  RA  |
|---------|------|
| Felippe Machado Nunes de Oliveira | 2347946 |
| Joice Kelly Oliveira Mendes | 2348020 |
| Lucas Costa Fuganti | 2209675 |

</div>

---

## Descrição do projeto

O objetivo deste projeto é desenvolver uma aplicação relacionada ao projeto de extensão [ELLP (Ensino Lúdico de Lógica e Programação)](https://grupoellp.com.br/), da UTFPR câmpus Cornélio Procópio.

O desenvolvimento contará com a integração de conhecimentos desenvolvidos em diferentes disciplinas cursadas pelos integrantes do grupo, como:

- Programação Orientada a Objetos (1 e 2);
- Banco de Dados;
- Programação Web (Front-End e Back-End);
- Teste de Software;
- Gerência de Configuração e Manutenção de Software;
- Arquitetura de Software;
- Gerenciamento de Projeto de Software.

O objetivo do projeto é desenvolver um sistema para registro de presença dos alunos participantes em oficinas do ELLP, permitindo que os integrantes do projeto de extensão possam realizar o controle de frequência das crianças e adolescentes que participam das atividades.

### Projeto de extensão ELLP

O projeto [ELLP](https://www.utfpr.edu.br/campus/cornelioprocopio/extensao/atividades-extensao/projeto-de-extensao-ellp-ensino-ludico-de-logica-e-programacao) tem como principal objetivo proporcionar a crianças e adolescentes de escolas públicas, ONGs e creches o acesso a conhecimentos muitas vezes ausentes em seu cotidiano. A iniciativa busca apresentar a essas crianças o universo acadêmico, aproximando-as da realidade universitária e da UTFPR.

<div align="center" style="display: display_block">

![image](https://github.com/user-attachments/assets/8cd5c77a-d537-4999-87b5-4036666367ae)

</div>

Por meio de oficinas presenciais, realizadas desde 2014, são oferecidos conteúdos de informática básica, lógica, robótica e programação, integrando essas atividades com o reforço escolar nas áreas de matemática e ciências.

O público-alvo do projeto são crianças a partir de 10 anos e adolescentes de até 16 anos, oriundos de instituições públicas e entidades sociais de Cornélio Procópio e região. As oficinas são realizadas aos sábados, nos espaços da UTFPR, com turmas ofertadas a cada semestre.

Estudantes da UTFPR-CP atuam voluntariamente em diversas frentes do projeto, como na produção de materiais, monitoria, condução das oficinas e apoio à coordenação. Interessados em participar como voluntários podem entrar em contato diretamente com a coordenação do projeto.

### Requisitos

| REQUISITO | DESCRIÇÃO |
| ----------- | ----------- |
| RF01 | O sistema deve permitir o cadastro de alunos da UTFPR como professores no projeto ELLP. |
| RF02 | O sistema deve permitir que usuários cadastrados façam login. |
| RF03 | O sistema deve permitir a criação e agendamento de oficinas e eventos. |
| RF04 | O sistema deve permitir a inclusão de usuários voluntários como instrutores nas oficinas. |
| RF05 | O sistema deve permitir que usuários logados cadastrem alunos participantes. |
| RF06 | O sistema deve permitir o registro de presença dos alunos participantes em oficinas. |
| RF07 | O sistema deve permitir a consulta de relatórios de oficinas com instrutores e participantes. |
| RNF01 | O sistema deve garantir a segurança e proteção dos dados pessoais dos alunos participantes e voluntários. |
| RNF02 | O sistema deve estar disponível nos períodos de uso e manter a integridade dos dados mesmo em caso de falhas. |

### RF01: Cadastro de Alunos Voluntários
**Descrição:** O sistema deve permitir o cadastro de alunos da UTFPR como professores no projeto ELLP.  

**Cenário de uso:**  
Um usuário acessa a página de cadastro, preenche seus dados (nome, email, senha, matrícula) e finaliza o registro. O sistema cria a conta e exibe confirmação.  

**Critérios de aceitação:**  
- Validar todos os campos obrigatórios (nome, email válido, senha forte, matrícula UTFPR);
- Impedir cadastro duplicado (mesmo email ou matrícula);
- Exibir mensagem de sucesso ou erros específicos para campos inválidos.

### RF02: Login de Alunos Voluntários
**Descrição:** O sistema deve permitir que usuários cadastrados façam login.

**Cenário de uso:**  
Um usuário insere email e senha cadastrados na página de login para acessar o sistema.

**Critérios de aceitação:**  
- Autenticar credenciais válidas e redirecionar para o painel principal;
- Exibir mensagem clara para credenciais incorretas;
- Bloquear tentativas após 5 falhas consecutivas (10 minutos).

### RF03: Cadastro de Workshops
**Descrição:** O sistema deve permitir a criação e agendamento de oficinas e eventos.

**Cenário de uso:**
Um usuário logado acessa a seção "Novo Workshop", preenche detalhes (título, descrição, data, horário, local) e salva.

**Critérios de aceitação:**  
- Validar campos obrigatórios (título, data futura, horário válido);
- Evitar duplicidade (mesmo título + data/horário);
- Exibir confirmação e adicionar ao calendário do sistema.  

### RF04: Inclusão de Alunos Voluntários como Instrutores  
**Descrição:** O sistema deve permitir a inclusão de usuários voluntários como instrutores nas oficinas.

**Cenário de uso:**  
O usuário seleciona um workshop e adiciona um aluno cadastrado como instrutor.

**Critérios de aceitação:**  
- Validar que o aluno está cadastrado no sistema;
- Notificar se o aluno já está associado ao workshop;
- Atualizar a lista de instrutores do workshop com a inclusão.

### RF05: Cadastro de Alunos Participantes
**Descrição:** O sistema deve permitir que usuários logados cadastrem alunos participantes das oficinas.

**Cenário de uso:**  
Um usuário logado acessa a seção "Alunos Participantes", seleciona a opção "Cadastrar Aluno" e preenche os dados do participante (nome, CPF, data de nascimento, instituição).

**Critérios de aceitação:**
- Permitir busca de alunos por nome/instituição;
- Calcular idade de alunos automaticamente;
- Exibir lista atualizada de participantes.

### RF06: Registro de Presença em Workshops
**Descrição:** O sistema deve permitir o registro de presença dos alunos participantes em oficinas.

**Cenário de uso:**  
Durante o workshop, o usuário marca a presença dos alunos participantes.  

**Critérios de aceitação:**
- Permitir busca de alunos por nome/matrícula;
- Registrar data/horário da presença automaticamente;
- Exibir lista atualizada de participantes confirmados.

### RF07: Consulta de Relatórios  
**Descrição:** O sistema deve permitir a consulta de relatórios de oficinas com instrutores e participantes.  

**Cenário de uso:**  
O usuário filtra workshops por data ou título e visualiza detalhes (instrutores, lista de presença, etc.).  

**Critérios de aceitação:**  
- Exibir dados consolidados (total de participantes, frequência média);
- Permitir filtros por intervalo de datas, aluno ou workshop;
- Gerar relatório em formato PDF (opcional).

### RNF01: Segurança e Proteção de Dados
**Descrição:** O sistema deve garantir a segurança e proteção dos dados pessoais dos alunos participantes e voluntários.

**Cenário de uso:**  
O sistema armazena dados sensíveis como nomes, CPFs e outros dados pessoais que devem ser protegidos contra acesso não autorizado e vazamentos de dados.

**Critérios de aceitação:**  
- Implementar criptografia para dados sensíveis armazenados no banco de dados;
- Utilizar conexões seguras (HTTPS) para todas as comunicações;
- Implementar controle de acesso baseado em permissões de usuários.

### RNF02: Disponibilidade e Confiabilidade
**Descrição:** O sistema deve estar disponível nos períodos de uso e manter a integridade dos dados mesmo em caso de falhas.

**Cenário de uso:**  
Durante a realização das oficinas e eventos, o sistema precisa estar acessível para registro de presença e consultas, mesmo em condições de conectividade limitada ou intermitente.

**Critérios de aceitação:**
- Tempo máximo de recuperação após falhas de 15 minutos;
- Implementação de mecanismos de cache para funcionamento parcial offline.

---

## Diagramas

Para guiar o desenvolvimento do projeto, e a fim de delimitar os comportamentos esperados dos componentes, foram desenvolvidos os seguintes diagramas UML:

### Diagrama de caso de uso

Este diagrama demonstra o fluxo de interação do usuário com o sistema, destacando a centralidade da autenticação para o acesso às diferentes funcionalidades. Representa as principais interações do usuário com o sistema.

<div align="center" style="display: display_block">

![Imagem do WhatsApp de 2025-04-24 à(s) 10 24 14_c1000cdd](https://github.com/user-attachments/assets/7e4bbedd-2644-4395-96a2-51c9a5b1ba77)

</div>

- **Ator Principal**: O Aluno Voluntário representa os estudantes da UTFPR que atuam como instrutores e administradores do projeto.
  
- **Casos de Uso**: Representam as principais funcionalidades do sistema:
  - **Cadastrar Alunos Voluntários**: Registro de novos membros da UTFPR no sistema;
  - **Fazer Login**: Autenticação de usuários para acesso ao sistema;
  - **Criar Oficina**: Cadastro e agendamento de novas oficinas/eventos;
  - **Gerenciar Instrutores**: Associação de alunos voluntários como instrutores das oficinas;
  - **Cadastrar Alunos Participantes**: Registro das crianças e adolescentes que participam das oficinas;
  - **Registrar Presença**: Marcação de frequência dos participantes nas atividades;
  - **Consultar Relatórios**: Visualização de dados consolidados sobre participação e frequência.

- **Relacionamentos**:
  - Todas as funcionalidades principais requerem autenticação, representada pelas relações de inclusão com o caso de uso "Fazer Login".

### Diagrama de classes

O diagrama de classes apresenta a estrutura de dados do sistema e os relacionamentos entre as entidades principais. Tem por objetivo representar um modelo estruturado das funcionalidades requeridas pelo sistema.

<div align="center" style="display: display_block">

![Imagem do WhatsApp de 2025-04-24 à(s) 10 24 35_bd6c5c72](https://github.com/user-attachments/assets/56ca838d-e41e-4c80-a262-62f53e99d031)

</div>

- **Usuário**: Classe base que contém informações comuns a todos os usuários do sistema, como identificação, credenciais de acesso e dados pessoais básicos;

- **Instrutor**: Especialização da classe Usuário, representando os alunos da UTFPR que atuam no projeto. Adiciona informações específicas como a função desempenhada;

- **Oficina**: Representa os eventos e atividades realizados pelo projeto ELLP, contendo informações como título, descrição, data e horários;

- **OficinaInstrutor**: Classe de associação que implementa o relacionamento muitos-para-muitos entre Oficinas e Instrutores, permitindo que múltiplos instrutores sejam associados a múltiplas oficinas;

- **Participante**: Armazena os dados dos alunos participantes do projeto, incluindo informações pessoais e instituição de origem;

- **Presença**: Atua como a classe central para o registro de frequência, estabelecendo a relação entre Participantes e Oficinas. Cada registro representa tanto a inscrição de um participante em uma oficina quanto seu status de presença.

Os relacionamentos entre as classes foram projetados para permitir:
1. Um instrutor pode participar de várias oficinas
2. Uma oficina pode ter vários instrutores
3. Um participante pode frequentar várias oficinas
4. Uma oficina pode ter vários participantes
5. O registro de presença é único para cada combinação de participante e oficina

---

## Arquitetura

A arquitetura do sistema foi projetada utilizando serviços do Google Cloud Platform (GCP), seguindo um modelo de aplicação web moderna. O diagrama abaixo ilustra os principais componentes da arquitetura e suas interações:

<div align="center" style="display: display_block">

![image](https://github.com/user-attachments/assets/bcfb86d7-e9cd-409b-9c55-7603072aed73)


</div>

### Componentes principais

1. **Interface do Usuário (Cliente)**
   - Representa o dispositivo do usuário (computador, tablet ou smartphone) que acessa a aplicação web;
   - Interage com o sistema através de um navegador web.

2. **Firebase Hosting**
   - Hospeda a aplicação front-end desenvolvida em React, JavaScript, HTML e CSS;
   - Fornece entrega rápida e segura do conteúdo estático para os usuários;
   - Rotula como "Front" no diagrama, indicando a camada de apresentação da aplicação.

3. **Firebase Authentication**
   - Gerencia todo o processo de autenticação e autorização de usuários;
   - Implementa autenticação segura para os alunos voluntários da UTFPR;
   - Protege os recursos e funcionalidades do sistema de acessos não autorizados.

4. **API Gateway**
   - Atua como ponto central para gerenciamento das APIs do sistema;
   - Encaminha solicitações do cliente para os serviços apropriados no back-end;
   - Fornece uma camada de segurança adicional para as APIs do sistema.

5. **Back-end**
   - Implementado em Python, contém a lógica de negócio do sistema;
   - Processa solicitações do cliente encaminhadas pelo API Gateway;
   - Realiza operações no banco de dados e retorna respostas ao cliente.

6. **Database**
   - Utiliza o Firestore para armazenamento dos dados da aplicação;
   - Mantém informações sobre usuários, oficinas, participantes e registros de presença;
   - Provê capacidades de banco de dados NoSQL escalável e flexível.

7. **GitHub**
   - Plataforma utilizada para versionamento do código e colaboração entre desenvolvedores;
   - Não é parte direta da aplicação em execução, mas essencial no processo de desenvolvimento;

8. **Cloud Build**
   - Serviço de integração e entrega contínuas (CI/CD) do Google Cloud;
   - Automatiza o processo de build, teste e deploy do código a partir do repositório GitHub;
   - Garante que alterações sejam testadas antes de serem implantadas.

9. **Artifact Registry**
   - Armazena e gerencia os artefatos de build (containers, pacotes);
   - Fornece os artefatos necessários para o deployment da aplicação;
   - Comunica-se com o Firebase Hosting para implantação do front-end.

### Fluxo de operação

1. O usuário acessa a aplicação através de seu navegador, que carrega o front-end hospedado no Firebase Hosting;
2. Ao realizar login, a autenticação é processada pelo Firebase Authentication;
3. Após autenticação, as interações do usuário com o sistema (como cadastro de oficinas ou registro de presença) são enviadas ao API Gateway;
4. O API Gateway encaminha as solicitações para o back-end apropriado;
5. O back-end processa as solicitações, interage com o banco de dados Firestore conforme necessário, e retorna os resultados;
6. Para o processo de desenvolvimento e implantação, o código é versionado no GitHub, construído pelo Cloud Build e os artefatos são armazenados no Artifact Registry antes de serem implantados.

Esta arquitetura foi projetada para fornecer um sistema escalável, seguro e de alta disponibilidade, alinhado com os requisitos especificados para o projeto ELLP, garantindo proteção dos dados pessoais e disponibilidade nos períodos críticos de uso.

---

## Automação de testes

A automação de testes para o projeto tem por objetivo garantiar que as funcionalidades críticas do sistema funcionem conforme o esperado. Implementar uma estratégia de automação para testes repetitivos, que deveriam ser feitos a cada incremento, garantirá maior agilidade ao processo de desenvolvimento, reduzindo a necessidade de testes manuais e o risco de falhas humanas.

### Escopo dos Testes
- **Testes End-to-End**: Utilização da ferramenta Postman para simular fluxos completos do sistema, como cadastro, login, registro de presença e consulta de relatórios.
- **Validação de Rotas**: Testar o comportamento e retorno das rotas, incluindo autenticação, criação de usuários e registro de dados, verificando se respostas de erros estão sendo retornadas apropriadamente.

### Ferramentas
- **Postman**: Ferramenta para automação de testes de API, com coleções configuradas para execução automatizada.
- **GitHub Actions**: Integração dos testes com pipelines de CI/CD próprias do repositório GitHub.

### Execução dos Testes
- Os testes serão executados inicialmente no ambiente de desenvolvimento, com verificações manuais pela ferramenta Postman. Posteriormente, testes automatizados serão desenvolvidos para integrar diversos passos de testes, e os mesmos serão integrados ao fluxo de CI/CD.

### Critérios de Sucesso
- **Cobertura**: Verificação dos principais fluxos de uso;
- **Tempo de Execução**: Conclusão dos testes de CI/CD em até 10 minutos;
- **Atualização Contínua e Compatibilidade**: Manutenção dos testes com base nas mudanças do sistema.

Perfeito! Vou montar uma versão do seu `README.md` com **badges** para ficar mais bonito e profissional.

Aqui está:

---

## Testes de API com Postman, Mock Server e GitHub Actions

### 📁 Estrutura de Testes

- **Collection:** [./collections/officina.postman_collection.json](./collections/officina.postman_collection.json)
- **Environment:** [./environments/meu-environment.json](./environments/mockenv.postman_environment.json)

Esses arquivos são usados para executar os testes localmente e na pipeline do GitHub.

---

## 🚀 Executando os Testes Localmente

Instale o Newman:

```bash
npm install -g newman
```

Execute:

```bash
newman run ./collections/officina.postman_collection.json \
    --environment ./environments/mockenv.postman_environment.json \
    --global-var "baseUrl=https://SEU-MOCK-URL.mock.pstmn.io"
```

**Importante:**  
Substitua `https://SEU-MOCK-URL.mock.pstmn.io` pela URL do seu Mock Server.

---

## ⚙️ GitHub Actions

A pipeline é acionada a cada push para rodar os testes.

Configuração de exemplo:

```yaml
- name: Run Postman Tests with Newman
  run: |
    newman run ./collections/minha-collection.json \
      --environment ./environments/meu-environment.json \
      --global-var "baseUrl=${{ vars.MOCK_URL }}"
```

O valor da variável `MOCK_URL` deve ser definido nos **Secrets and Variables** do repositório no GitHub.

---

## Observações

- Os arquivos de Collection e Environment estão versionados neste repositório.

---

## Configuração do script preliminar para teste

Exemplo de script de teste inicial para o requisito RF01 - Cadastro de Alunos Voluntários:

1. Crie uma colletion no `Postman`
2. Crie uma request do tipo POST
3. No Body (JSON) adicione:
   ```json
    {
      "nome": "João Silva",
      "email": "joao.silva@example.com",
      "senha": "SenhaForte123!",
      "matricula": "2023123456"
    }
    ```
4. Na aba Scripts > Post-response:
   ```bash
    pm.test("Status code é 201", function () {
        pm.response.to.have.status(201);
    });
    
    pm.test("Retorna mensagem de sucesso", function () {
        var jsonData = pm.response.json();
        pm.expect(jsonData.mensagem).to.eql("Cadastro realizado com sucesso!");
    });
    ```
### Criar o Mock Server
1. Na Collection, clique nos ... (três pontinhos) > More > Mock
2. Escolha:
   - Environment: No Environment
   - Save the mock server URL as an new environment variable
   - Clique em Create Mock Server
3. O Postman irá gerar uma URL base automática
4. Adicione a URL gerada na sua request POST:
    ```bash
    POST https://abcd1234.mock.pstmn.io/cadastro-voluntario
    ```

### Criar um exemplo (example response) para o Mock

1. Clique na Request > clique nos três pontinhos (...) > Add Example:
   - Status Code: Escolha o status (200, 201, 404, etc.).
   - Body: Aqui você coloca o JSON, HTML ou o que for esperado como resposta.
   - Headers (opcional): Você pode adicionar headers tipo Content-Type: application/json
2. Só testar a rota no `Postman`, para testar nosso script de teste adicione a seguinte rota:
   ```bash
    POST https://abcd1234.mock.pstmn.io/cadastro-voluntario
    ```
3. Ao executar essa requisição no POSTMAN verá o seguinte retorno como resposta:
    ```bash
    Status Code: 201 Created
    
    {
      "mensagem": "Cadastro realizado com sucesso!"
    }
    ```
---

## Tecnologias

As tecnologias utilizadas para o desenvolvimento do projeto são:

### Linguagens de programação, marcação e estilização

- Python (back-end);
- JavaScript, HTML, CSS (front-end);

### Framework

- React;

### Banco de dados

- Firestore;

### Plataformas

- Google Cloud Platform (tecnologias na nuvem);
- GitHub (versionamento de código);

### Outras

- Postman (testes);
- GitHub Actions (CI/CD).
