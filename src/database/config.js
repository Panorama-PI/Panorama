var mysql = require("mysql2");

// Configura os dados necessários para conectar a aplicação ao banco de dados.
// As informações são obtidas das variáveis definidas no arquivo de ambiente.
var mySqlConfig = {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
};


// Executa uma instrução SQL no banco de dados.
// Recebe a consulta enviada pelos models e retorna o resultado da operação.
function executar(instrucao) {

    // Verifica se o ambiente da aplicação foi configurado corretamente.
    if (
        process.env.AMBIENTE_PROCESSO !== "producao" && 
        process.env.AMBIENTE_PROCESSO !== "desenvolvimento"
    ) {
        console.log(
            "\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM .env OU dev.env OU app.js\n"
        );

        return Promise.reject("AMBIENTE NÃO CONFIGURADO EM .env");
    }

    // Cria uma conexão com o banco e executa a instrução SQL recebida.
    return new Promise(function (resolve, reject) {
        var conexao = mysql.createConnection(mySqlConfig);

        conexao.connect();

        conexao.query(instrucao, function (erro, resultados) {
            conexao.end();

            // Retorna o erro caso a consulta não seja executada corretamente.
            if (erro) {
                reject(erro);
            }

            console.log(resultados);
            resolve(resultados);
        });

        // Trata possíveis erros ocorridos na conexão com o banco.
        conexao.on('error', function (erro) {
            return ("ERRO NO MySQL SERVER: ", erro.sqlMessage);
        });
    });
}


module.exports = {
    executar
};