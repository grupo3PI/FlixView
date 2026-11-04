# FlixView — Inteligência para Catálogos de Streaming

**Projeto — Grupo 3 | São Paulo Tech School (SPTech)**

O FlixView é um protótipo acadêmico de uma plataforma web para explorar informações sobre filmes e séries e apoiar análises de catálogo. A proposta é reunir dados como popularidade, avaliações e gêneros em uma interface de consulta e visualização, facilitando a identificação de tendências e a análise do desempenho dos títulos.

O projeto parte de um desafio comum aos serviços de streaming: a grande quantidade de conteúdos e dados pode dificultar tanto a escolha do que assistir quanto a análise do catálogo. O FlixView explora como ferramentas de busca, indicadores e dashboards podem ajudar a organizar essas informações e apoiar decisões relacionadas a conteúdo e engajamento.

> **Projeto acadêmico:** o FlixView não é um produto oficial da Netflix, não tem acesso a dados internos da empresa e não reproduz filmes ou séries. Os dados dependem das fontes e bases utilizadas no projeto e não representam necessariamente a operação real de qualquer plataforma.

## 🛠️ Tecnologias e Arquitetura

A aplicação web é organizada em componentes de interface, rotas, controllers e models, seguindo uma separação de responsabilidades inspirada no padrão MVC. O repositório também inclui ferramentas auxiliares para obtenção e importação de dados.

| Categoria | Tecnologias e ferramentas |
| --- | --- |
| Front-end | HTML5, CSS3 e JavaScript |
| Back-end | Node.js e Express |
| Banco de dados | MySQL |
| Visualização de dados | Chart.js |
| Integração de catálogo | TMDB API |
| Importação de planilhas | Java, Maven, Apache POI e JDBC |
| Extração e exportação de dados | Python, `requests`, `pandas` e `openpyxl` |
| Gestão e desenvolvimento | Scrum, TDD e Git |

## ✨ O que o projeto contempla

- Páginas de apresentação, login e cadastro, catálogo, detalhes de títulos e dashboards.
- API para cadastro e autenticação de usuários.
- Consulta à TMDB para sincronizar títulos populares e gêneros com o banco de dados.
- Estrutura inicial de banco de dados para usuários, títulos, gêneros, reviews e suas associações.
- Ferramentas para importar dados de planilhas e exportar informações de catálogo.

Algumas telas e dados do front-end são demonstrativos. A presença de uma página ou requisito no projeto não significa que todo o fluxo esteja integrado ao banco de dados ou à API.

## 🚀 Como executar a aplicação web

### Pré-requisitos

- Node.js e npm.
- MySQL em execução e acessível.
- Um banco de dados chamado `flixview`.
- Um token de leitura da TMDB para utilizar a sincronização de títulos.

### 1. Prepare o banco de dados

Execute o script `web-data-viz/src/database/script-tabelas.sql` no MySQL para criar a estrutura inicial do banco.

### 2. Configure as variáveis de ambiente

Crie o arquivo `web-data-viz/.env` com as configurações do seu ambiente:

```dotenv
AMBIENTE_PROCESSO=desenvolvimento
APP_HOST=localhost
APP_PORT=8080

DB_HOST=localhost
DB_PORT=3306
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_DATABASE=flixview

TMDB_API_READ_ACCESS_TOKEN=seu_token_de_leitura
```

Use suas próprias credenciais e não publique o arquivo `.env` nem tokens de acesso.

### 3. Instale as dependências e inicie o servidor

```bash
cd web-data-viz
npm install
npm start
```

Para iniciar em modo de desenvolvimento, com reinicialização automática:

```bash
npm run dev
```

Com o servidor em execução, acesse `http://localhost:8080` (ou a porta configurada em `APP_PORT`).

## 🔌 Rotas da API

| Método | Caminho | Descrição |
| --- | --- | --- |
| `POST` | `/usuarios/cadastrar` | Cadastra um usuário. |
| `POST` | `/usuarios/autenticar` | Autentica um usuário. |
| `POST` | `/titulos/sincronizar` | Consulta a TMDB e sincroniza títulos populares da página informada. |

Exemplo de sincronização da primeira página:

```bash
curl -X POST http://localhost:8080/titulos/sincronizar \
  -H "Content-Type: application/json" \
  -d '{"page":1}'
```

O campo `page` é opcional e, quando omitido, usa o valor `1`. A sincronização requer um token válido da TMDB, acesso à internet e conexão com o MySQL.

## 📊 Ferramentas de dados

### Importação com Java

O módulo `LeitorJava/` contém leitores de planilhas Excel e integração JDBC para inserir informações no banco. Para compilar, use Maven e um JDK compatível com a versão declarada em `LeitorJava/pom.xml`.

Antes de executar a importação, revise `LeitorJava/src/main/java/school/sptech/DBConnectionProvider.java` e configure a conexão para o seu ambiente. No estado atual, os parâmetros de conexão estão definidos diretamente no código; utilize credenciais locais e não publique credenciais no repositório. Os leitores também possuem um limite de linhas para teste, então valide e ajuste esse comportamento antes de importar uma planilha completa.

### Extração com Python

O script `python/conversor/tmdb_excel.py` consulta a TMDB API para obter informações de filmes e séries disponíveis na Netflix no Brasil e gera uma planilha Excel no diretório `python/conversor/`.

Instale as dependências necessárias:

```bash
python -m pip install requests pandas openpyxl
```

Configure a variável de ambiente `TMDB_TOKEN` com seu token da TMDB e execute:

```bash
python python/conversor/tmdb_excel.py
```

O uso da TMDB está sujeito aos termos da API. O projeto não é endossado nem certificado pela TMDB.

## 🗂️ Estrutura do repositório

```text
.
├── web-data-viz/       # Aplicação web, API e scripts do banco
├── LeitorJava/         # Leitura de planilhas e importação para MySQL
├── python/conversor/   # Consulta à TMDB e exportação para Excel
└── ConsoleLog/         # Módulo Java auxiliar para registros no console
```

## 📌 Observações sobre o protótipo

- O script SQL representa uma estrutura inicial. Algumas colunas utilizadas pelos models da API, como `tipoUsuario` e `idTMDB`, não estão definidas atualmente no script. Alinhe o banco e os models antes de utilizar esses fluxos em conjunto.
- Cadastro e autenticação são funcionalidades de protótipo; não utilize dados pessoais ou senhas reais.
- Dashboards, reviews e outras telas podem apresentar conteúdo estático ou demonstrativo, sem refletir dados reais de operação de qualquer serviço.
- As informações exibidas são limitadas às bases disponíveis e às integrações configuradas no ambiente.

## 👥 Equipe

Projeto — Grupo 3, São Paulo Tech School:

| Integrante | RA |
| --- | --- |
| Beatriz Reis | 01261094 |
| Gustavo de Souza | 01261071 |
| Jefferson Watabe | 01261036 |
| Miguel Carvalho | 01261101 |
| Nicolas Augusto | 01261014 |
| Sabrina Toledo | 01261004 |

## 📄 Licença

Consulte `web-data-viz/LICENSE` para os termos de licença presentes no repositório.
