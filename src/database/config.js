
var mysql = require("mysql2");

// Configura os dados necessários para conectar ao banco.
var mySqlConfig = {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
};

// Verifica se o ambiente foi configurado corretamente.
function validarAmbiente() {
    return (
        process.env.AMBIENTE_PROCESSO === "producao" ||
        process.env.AMBIENTE_PROCESSO === "desenvolvimento"
    );
}

// Executa uma consulta SQL fora de uma transação.
function executar(instrucaoSql, valores = []) {
    if (!validarAmbiente()) {
        return Promise.reject(
            new Error("AMBIENTE NÃO CONFIGURADO EM .env")
        );
    }

    return new Promise(function (resolve, reject) {
        var conexao = mysql.createConnection(mySqlConfig);

        conexao.connect(function (erroConexao) {
            if (erroConexao) {
                return conexao.end(function () {
                    reject(erroConexao);
                });
            }

            conexao.query(
                instrucaoSql,
                valores,
                function (erro, resultados) {
                    if (erro) {
                        return conexao.end(function () {
                            reject(erro);
                        });
                    }

                    conexao.end(function (erroFechamento) {
                        if (erroFechamento) {
                            return reject(erroFechamento);
                        }

                        resolve(resultados);
                    });
                }
            );
        });
    });
}

// Executa várias consultas dentro da mesma transação.
function executarTransacao(callback) {
    if (!validarAmbiente()) {
        return Promise.reject(
            new Error("AMBIENTE NÃO CONFIGURADO EM .env")
        );
    }

    return new Promise(function (resolve, reject) {
        var conexao = mysql.createConnection(mySqlConfig);

        console.log("[DB 1] Tentando conectar ao MySQL");

        conexao.connect(function (erroConexao) {
            if (erroConexao) {
                console.error("[DB ERRO] Falha na conexão:", erroConexao);

                return conexao.end(function () {
                    reject(erroConexao);
                });
            }

            console.log("[DB 2] Conexão estabelecida");

            console.log("[DB 2.1] Solicitando início da transação");

            conexao.beginTransaction(function (erroTransacao) {
                if (erroTransacao) {
                    console.error(
                        "[DB ERRO] Falha ao iniciar transação:",
                        erroTransacao
                    );

                    return conexao.end(function () {
                        reject(erroTransacao);
                    });
                }

                console.log("[DB 3] Transação iniciada");

                // Executa uma consulta com parâmetros.
                function query(sql, valores = []) {
                    return new Promise(function (resolveQuery, rejectQuery) {
                        console.log("[DB 4] Executando consulta SQL");

                        conexao.query(
                            sql,
                            valores,
                            function (erro, resultado) {
                                if (erro) {
                                    console.error(
                                        "[DB ERRO] Falha na consulta:",
                                        erro
                                    );

                                    return rejectQuery(erro);
                                }

                                console.log("[DB 4.1] Consulta concluída");

                                resolveQuery(resultado);
                            }
                        );
                    });
                }

                // Executa as operações solicitadas pelo model.
                Promise.resolve()
                    .then(function () {
                        return callback({ query });
                    })
                    .then(function (resultado) {
                        console.log(
                            "[DB 5] Consultas concluídas; confirmando transação"
                        );

                        conexao.commit(function (erroCommit) {
                            if (erroCommit) {
                                console.error(
                                    "[DB ERRO] Falha no commit:",
                                    erroCommit
                                );

                                return conexao.rollback(function () {
                                    conexao.end(function () {
                                        reject(erroCommit);
                                    });
                                });
                            }

                            console.log("[DB 6] Transação confirmada");

                            conexao.end(function (erroFechamento) {
                                if (erroFechamento) {
                                    return reject(erroFechamento);
                                }

                                resolve(resultado);
                            });
                        });
                    })
                    .catch(function (erro) {
                        console.error(
                            "[DB ERRO] Erro durante a transação:",
                            erro
                        );

                        conexao.rollback(function (erroRollback) {
                            if (erroRollback) {
                                console.error(
                                    "[DB ERRO] Falha no rollback:",
                                    erroRollback
                                );
                            }

                            conexao.end(function () {
                                reject(erro);
                            });
                        });
                    });
            });
        });
    });
}

module.exports = {
    executar,
    executarTransacao
};
