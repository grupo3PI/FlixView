# FlixView — Inteligência para Catálogos de Streaming

**Aplicação Web | Projeto — Grupo 3 | São Paulo Tech School (SPTech)**

O FlixView é um protótipo acadêmico de uma plataforma web desenvolvida para explorar informações sobre filmes e séries e apoiar análises de catálogo. A aplicação reúne dados como popularidade, avaliações e gêneros em uma interface de consulta e visualização, facilitando a identificação de tendências e a análise do desempenho dos títulos.

O projeto parte de um desafio comum aos serviços de streaming: a grande quantidade de conteúdos e dados pode dificultar tanto a escolha do que assistir quanto a análise do catálogo. O FlixView explora como ferramentas de busca, indicadores e dashboards podem ajudar a organizar essas informações e apoiar decisões relacionadas a conteúdo e engajamento.

## 🛠️ Tecnologias e Arquitetura

A aplicação utiliza uma arquitetura organizada em componentes de interface, rotas, controllers e models, seguindo uma separação de responsabilidades inspirada no padrão MVC.

| Categoria | Tecnologias e ferramentas |
| --- | --- |
| Front-end | HTML5, CSS3 e JavaScript |
| Back-end | Node.js e Express |
| Banco de dados | MySQL |
| Visualização de dados | Chart.js |
| Integração de catálogo | TMDB API |
| Desenvolvimento | Git, Scrum e TDD |

## ✨ Funcionalidades

- **Página inicial:** apresentação do projeto e direcionamento para as áreas de cliente e empresa.
- **Autenticação:** cadastro e login de usuários.
- **Catálogo:** consulta e exploração de filmes e séries.
- **Detalhes dos títulos:** visualização de informações relacionadas aos conteúdos.
- **Dashboards:** apresentação de indicadores e visualizações de dados do catálogo.
- **Integração com a TMDB:** consulta à API externa para obtenção de informações de filmes, séries e gêneros.
- **Banco de dados:** estrutura para armazenamento de usuários, títulos, gêneros, reviews e associações.

> **Observação:** o projeto é um protótipo acadêmico. Algumas telas, indicadores e fluxos são demonstrativos e podem não estar totalmente integrados ao banco de dados ou às APIs.

## 🚀 Como executar a aplicação

### Pré-requisitos

- Node.js e npm instalados.
- MySQL em execução e acessível.
- Um banco de dados chamado `flixview`.
- Um token de leitura da TMDB para utilizar a sincronização de títulos.

### 1. Clone o repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd web-data-viz
```

### 2. Prepare o banco de dados

Execute o script `src/database/script-tabelas.sql` no MySQL para criar a estrutura inicial do banco.

Certifique-se de que o banco de dados `flixview` esteja criado antes de executar a aplicação.

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto (`web-data-viz/`) com as configurações do seu ambiente:

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

Substitua os valores pelas credenciais correspondentes ao seu ambiente.

**Importante:** não compartilhe o arquivo `.env` nem publique tokens ou credenciais no repositório.

### 4. Instale as dependências

```bash
npm install
```

### 5. Inicie o servidor

Para iniciar a aplicação:

```bash
npm start
```

Para iniciar em modo de desenvolvimento, com reinicialização automática:

```bash
npm run dev
```

Com o servidor em execução, acesse:

```text
http://localhost:8080
```

Caso tenha alterado a variável `APP_PORT`, utilize a porta configurada.

## 🔌 Rotas da API

A aplicação disponibiliza endpoints para operações relacionadas aos usuários e ao catálogo.

| Método | Endpoint | Descrição |
| --- | --- | --- |
| `POST` | `/usuarios/cadastrar` | Realiza o cadastro de um usuário. |
| `POST` | `/usuarios/autenticar` | Realiza a autenticação de um usuário. |
| `POST` | `/titulos/sincronizar` | Consulta a TMDB e sincroniza títulos populares com o banco de dados. |

### Exemplo de sincronização de títulos

Para solicitar a sincronização da primeira página de resultados:

```bash
curl -X POST http://localhost:8080/titulos/sincronizar \
  -H "Content-Type: application/json" \
  -d '{"page":1}'
```

O campo `page` é opcional e, quando omitido, utiliza o valor `1`.

A sincronização depende de:
- Token de acesso válido da TMDB.
- Conexão com a internet.
- Banco de dados MySQL disponível e configurado.

## 🗄️ Banco de dados

O projeto utiliza o MySQL para armazenar informações relacionadas aos usuários e ao catálogo de conteúdos.

A estrutura inicial está definida no arquivo:

```text
src/database/script-tabelas.sql
```

Entre as entidades previstas estão:
- Usuários;
- Títulos;
- Gêneros;
- Reviews;
- Relacionamentos entre títulos, gêneros e usuários.

**Atenção:** o script SQL representa uma estrutura inicial e pode apresentar diferenças em relação aos campos utilizados atualmente pelos models da API. Antes de executar todos os fluxos em conjunto, verifique a compatibilidade entre o banco e a aplicação.

## 📁 Estrutura do projeto

```text
web-data-viz/
├── public/                 # Arquivos públicos da aplicação
│   ├── assets/             # Imagens e recursos visuais
│   ├── css/                # Folhas de estilo
│   ├── js/                 # Scripts do front-end
│   └── html/                 # Páginas HTML
│
├── src/
│   ├── controllers/         # Controle das requisições
│   ├── database/            # Scripts e configurações do banco
│   ├── models/              # Consultas e regras de acesso aos dados
│   ├── routes/              # Definição das rotas da API
│   └── ...                  # Outros módulos da aplicação
│
├── .env                    # Variáveis de ambiente (não versionar)
├── package.json            # Dependências e scripts
└── README.md               # Documentação do projeto
```

*Observação: a estrutura acima apresenta uma visão geral da organização da aplicação. Consulte os diretórios do repositório para verificar a disposição completa dos arquivos.*

## ⚠️ Observações importantes

- O FlixView é um protótipo acadêmico, não uma plataforma comercial de streaming.
- As funcionalidades de cadastro e autenticação possuem finalidade demonstrativa. Não utilize dados pessoais ou senhas reais.
- Algumas telas e dashboards podem apresentar informações estáticas ou demonstrativas.
- A sincronização do catálogo depende da disponibilidade da API da TMDB e das configurações de acesso.
- O projeto não é endossado nem certificado pela TMDB.

## 👥 Equipe

**Projeto — Grupo 3 | São Paulo Tech School (SPTech)**

| Integrante | RA |
| --- | --- |
| Beatriz Reis | 01261094 |
| Gustavo de Souza | 01261071 |
| Jefferson Watabe | 01261036 |
| Miguel Carvalho | 01261101 |
| Nicolas Augusto | 01261014 |
| Sabrina Toledo | 01261004 |

## 📄 Licença

Consulte o arquivo `LICENSE` presente neste repositório para conhecer os termos de utilização e distribuição do projeto.
