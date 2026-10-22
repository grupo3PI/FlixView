var path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

var express = require("express");
var cors = require("cors");
var PORTA_APP = process.env.APP_PORT;
var HOST_APP = process.env.APP_HOST;

var app = express();

var indexRouter = require("./src/routes/index");
var usuarioRouter = require("./src/routes/usuarios");
var tituloRouter = require("./src/routes/titulos");


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

app.use("/", indexRouter);
app.use("/usuarios", usuarioRouter);
app.use("/titulos", tituloRouter);


app.listen(PORTA_APP, function () {
    console.log(`
  ███████╗██╗     ██╗██╗  ██╗    ██╗   ██╗██╗███████╗██╗    ██╗    ██╗
  ██╔════╝██║     ██║╚██╗██╔╝    ██║   ██║██║██╔════╝██║    ██║    ██║
  █████╗  ██║     ██║ ╚███╔╝     ██║   ██║██║█████╗  ██║    ██║    ██║
  ██╔══╝  ██║     ██║ ██╔██╗     ╚██╗ ██╔╝██║██╔══╝  ██║    ██║    ██║
  ██║     ███████╗██║██╔╝ ██╗     ╚████╔╝ ██║███████╗╚██████╔╝██████╔╝
  ╚═╝     ╚══════╝╚═╝╚═╝  ╚═╝      ╚═══╝  ╚═╝╚══════╝ ╚═════╝ ╚═════╝ 


                                                                                                 
    Servidor do seu site já está rodando! Acesse o caminho a seguir para visualizar .: http://${HOST_APP}:${PORTA_APP} :. 

    Você está rodando sua aplicação em ambiente de .:${process.env.AMBIENTE_PROCESSO}:. 

    \tSe .:desenvolvimento:. você está se conectando ao banco local. 
    \tSe .:producao:. você está se conectando ao banco remoto. 

    \t\tPara alterar o ambiente, comente ou descomente as linhas 1 ou 2 no arquivo 'app.js'

`);
});
