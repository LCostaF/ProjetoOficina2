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


---

## Arquitetura


---

## Automação de testes

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

- GitHub Actions (CI/CD).
