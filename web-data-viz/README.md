<img src="https://user-images.githubusercontent.com/46379117/192358781-9ca879e4-e55e-4d0d-b876-f9a4a2ed9ae8.png" width="600px">

_Web Data Visualization = Visualização de Dados na Web_

_Implementação de Referência para o seu Projeto de Primeiro Semestre_

<hr>

# Como usar

1. Clone este repositório em sua máquina.


2. Em uma instalação nova, crie o banco e as tabelas conforme **/src/database/script-tabelas.sql**. Se o banco `flixview` e as tabelas já existirem, não execute o script novamente.


3. Configure `AMBIENTE_PROCESSO` no arquivo **.env** como `desenvolvimento` ou `producao`.

4. Configure as credenciais do MySQL no arquivo **.env**, com `DB_DATABASE=flixview`.

5. Acesse este repositório no seu terminal (GitBash ou VSCode) e execute os comandos abaixo:

```
npm i
``` 
_O comando acima irá instalar as bibliotecas necessárias para o funcionamento do projeto. As bibliotecas a serem instaladas estão listadas no arquivo **package.json** então é muito importante que este não seja alterado. Será criada uma nova pasta/diretório chamado **node_modules** quando o comando for finalizado, que é onde as bibliotecas estão localizadas. Não altere a pasta/diretório._

```
npm start
``` 

_O comando acima irá iniciar seu projeto e efetuar os comandos de acordo com a sua parametrização feita nos passos anteriores._

6. Para "ver" seu projeto funcionando, acesse em seu navegador o caminho **informado no terminal**.

7. Caso queira parar a execução, tecle **CTRL+C** no terminal em que o projeto está rodando.

## Adicionar novo recurso ao projeto

**"Recurso? O que é?"** Enquanto no Banco de Dados chamamos as tabelas de "entidades", quando tratamos de desenvolvimento WEB usamos a palavra "recurso" para se referir a algo que podemos criar, ler, atualizar ou deletar [1]. Estas ações são conhecidas como CRUD: Create, Read, Update e Delete. Para acessar cada ação, usamos os métodos HTTP: POST, GET, PUT e DELETE [2]. (Há outros verbos, porém com estes já conseguimos efetuar CRUDs). 

**Tabela para ajudar a fazer a associação**

<table>
  <tr>
    <th>C.R.U.D</th>
    <th>Ação</th>
    <th>Tradução</th>
    <th>Verbo HTTP *</th>
    <th>Comando BD</th>
  </tr>
  <tr>
    <td>C</td>
    <td>Create</td>
    <td>Criar</td>
    <td>POST</td>
    <td>INSERT</td>
  </tr>
  <tr>
    <td>R</td>
    <td>Read</td>
    <td>Ler</td>
    <td>GET</td>
    <td>SELECT</td>
  </tr>
  <tr>
    <td>U</td>
    <td>Update</td>
    <td>Atualizar</td>
    <td>PUT</td>
    <td>UPDATE</td>
  </tr>
  <tr>
    <td>D</td>
    <td>Delete</td>
    <td>Deletar</td>
    <td>DELETE</td>
    <td>DELETE</td>
  </tr>
</table>

_* Você verá o verbo HTTP sendo apontado nos arquivos em /routes_

**"E no meu projeto, o que seria um recurso?"** Em web-data-viz manipulamos os recursos **usuário**, **aviso** e **medida**. Podemos conferir isso vendo para quais entidades foram criados os caminhos de inserção e captura de dados, que envolve os diretórios **routes**, **controllers** e **models**.

Abaixo, uma figura que ajuda a compreender o caminho percorrido para, por exemplo, efetuar o cadastro de um usuário:


![image](https://github.com/user-attachments/assets/d576f178-0da6-437e-b5c9-658e3ebaf6ca)



**Entendi o que é um recurso e gostaria de adicionar um novo ao meu projeto! Como faz?**  
- Primeiro, crie a tabela no Banco de Dados referente a este recurso. Exemplos de recursos comuns de serem adicionados ao projeto no primeiro semestre: Silo, Aquário, Sala, Andar, Endereço, Mercado, Prateleira, Unidade, Carro, Caminhão...  
- Assim que criada a tabela, faça todo o caminho de **front-end → routes → controllers → models** replicando o que já existe!  
- Exemplo, se você quiser a funcionalidade de adicionar um novo Aquário, deve criar arquivos referentes ao aquario nos diretórios e replicar também as funções.  
- Dica: A implementação de AVISO já contém o CRUD completo! :wink:
 
### Fontes bibliográficas

[1] https://datatracker.ietf.org/doc/html/rfc2396  
[2] https://datatracker.ietf.org/doc/html/rfc7231

## Integração com a TMDB API

O servidor carrega as configurações de `web-data-viz/.env`. Configure nele `DB_HOST`, `DB_PORT`, `DB_USER` e `DB_PASSWORD` para o MySQL existente, mantenha `DB_DATABASE=flixview` e informe em `TMDB_API_READ_ACCESS_TOKEN` o Bearer token da sua conta TMDB. O `.env` não deve ser versionado.

Para importar ou atualizar os filmes populares da TMDB, inicie o servidor e envie uma requisição:

```bash
curl -X POST http://localhost:8080/titulos/sincronizar \
  -H "Content-Type: application/json" \
  -d "{\"page\":1}"
```

O exemplo usa a porta `8080` configurada atualmente em `.env`; ajuste-a se `APP_PORT` tiver outro valor. O campo `page` é opcional (padrão `1`). O backend consulta os endpoints documentados [`/3/movie/popular`](https://developer.themoviedb.org/reference/movie-popular-list) e [`/3/genre/movie/list`](https://developer.themoviedb.org/reference/genre-movie-list), autentica com o Bearer token e sincroniza `titulo`, `genero` e `titulo_genero` com consultas parametrizadas. Títulos já existentes são atualizados pelo `idTMDB` e as relações de gênero são substituídas pelas retornadas pela API. Nenhuma tabela precisa ser criada ou alterada.

O endpoint responde com a página e as quantidades processadas; erros de configuração, da API ou do banco são retornados como JSON. A API exige um Read Access Token da TMDB e o MySQL precisa estar acessível com credenciais válidas para testar a persistência.
