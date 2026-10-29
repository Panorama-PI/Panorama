// Define o ambiente em que a aplicação será executada.
// O ambiente escolhido determina qual arquivo .env será utilizado.
var ambiente_processo = 'producao';
//var ambiente_processo = 'desenvolvimento';

// Seleciona o arquivo de configurações de acordo com o ambiente.
var caminho_env = ambiente_processo === 'producao' ? '.env' : '.env.dev';

require("dotenv").config({ path: caminho_env });

var express = require("express");
var cors = require("cors");
var path = require("path");

var PORTA_APP = process.env.APP_PORT;
var HOST_APP = process.env.APP_HOST;

var app = express();
// Importa as rotas que serão utilizadas pela aplicação.
var indexRouter = require("./src/routes/index");
var usuarioRouter = require("./src/routes/usuarios");
var empresasRouter = require("./src/routes/empresas");
var anotacoesRouter = require("./src/routes/anotacoes");
var tokensRouter = require("./src/routes/tokens");
var filmesRouter = require("./src/routes/filmes");
var publicacaoRRouter = require("./src/routes/publicacaoR");
var relatoriosRouter = require("./src/routes/relatorios");
// Importa o interceptor global de erros no server
const errorHandler = require("./src/middleware/ErrorHandler");
const NotFoundError = require("./src/errors/NotFoundError");
const AppError = require("./src/errors/AppError");
// Permite que a aplicação receba dados enviados no formato JSON
// e também dados enviados por formulários.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Define a pasta "public" como responsável pelos arquivos
// que podem ser acessados diretamente pelo navegador.
app.use(express.static(path.join(__dirname, "public")));

// Permite requisições vindas de outras origens.
app.use(cors());

// Define as rotas principais da aplicação e os arquivos responsáveis
// por tratar cada tipo de requisição.
app.use("/", indexRouter);
app.use("/usuarios", usuarioRouter);
app.use("/empresas", empresasRouter);
app.use("/anotacoes", anotacoesRouter);
app.use("/tokens", tokensRouter);  
app.use("/filmes", filmesRouter);  
app.use("/publicacoes", publicacaoRRouter);
app.use("/relatorios", relatoriosRouter);

app.all("*", (req, res, next) => {
  next(new NotFoundError(`Rota ${req.originalUrl} não encontrada.`));
})

// ATENÇÃO O ERRORHANDLER DEVE SER O ÚLTIMO app.use()
// Adiciona o errorHandler no server.js
app.use(errorHandler);

// Inicia o servidor utilizando a porta definida nas configurações
// do ambiente.
app.listen(PORTA_APP, function () {
    console.log(`
    ##   ##  ######   #####             ####       ##     ######     ##              ##  ##    ####    ######  
    ##   ##  ##       ##  ##            ## ##     ####      ##      ####             ##  ##     ##         ##  
    ##   ##  ##       ##  ##            ##  ##   ##  ##     ##     ##  ##            ##  ##     ##        ##   
    ## # ##  ####     #####    ######   ##  ##   ######     ##     ######   ######   ##  ##     ##       ##    
    #######  ##       ##  ##            ##  ##   ##  ##     ##     ##  ##            ##  ##     ##      ##     
    ### ###  ##       ##  ##            ## ##    ##  ##     ##     ##  ##             ####      ##     ##      
    ##   ##  ######   #####             ####     ##  ##     ##     ##  ##              ##      ####    ######  
    \n\n\n                                                                                                 
    Servidor do seu site já está rodando! Acesse o caminho a seguir para visualizar .: http://${HOST_APP}:${PORTA_APP} :. \n\n
    Você está rodando sua aplicação em ambiente de .:${process.env.AMBIENTE_PROCESSO}:. \n\n
    \tSe .:desenvolvimento:. você está se conectando ao banco local. \n
    \tSe .:producao:. você está se conectando ao banco remoto. \n\n
    \t\tPara alterar o ambiente, comente ou descomente as linhas 1 ou 2 no arquivo 'app.js'\n\n`);
});
