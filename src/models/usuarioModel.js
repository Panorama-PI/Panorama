var database = require("../database/config")

// Cadastra um novo usuário no banco de dados.
// Recebe os dados do usuário e executa a instrução SQL de inserção.
function cadastrar(nome, email, senha, cargo, fkEmpresa) {
    console.log(
        "ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n" + 
        " \t\t >> verifique suas credenciais de acesso ao banco\n" + 
        " \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n" +
        " function cadastrar():", 
        nome, 
        email, 
        senha, 
        cargo, 
        fkEmpresa
    );

    var instrucaoSql = `
        INSERT INTO usuario (nome, email, senha, cargo, fkEmpresa) 
        VALUES ('${nome}', '${email}', '${senha}','${cargo}', '${fkEmpresa}');
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);

    return database.executar(instrucaoSql);
}


// Autentica um usuário utilizando email e senha.
// Retorna os dados do usuário quando as informações correspondem
// a um cadastro existente no banco.
function autenticar(email, senha) {
    console.log(
        "ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n" +
        " \t\t >> verifique suas credenciais de acesso ao banco\n" +
        " \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n" +
        " function entrar(): ", 
        email, 
        senha
    );

    var instrucaoSql = `
        SELECT idUsuario, nome, email, fkEmpresa as empresaId 
        FROM usuario 
        WHERE email = '${email}' AND senha = '${senha}';
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    
    return database.executar(instrucaoSql);
}


// Busca os usuários vinculados a uma determinada empresa.
// Recebe o ID da empresa e retorna os usuários associados a ela.
function buscarUsuariosPorEmpresa(empresaId) {
    var instrucaoSql = `
        SELECT * 
        FROM usuario a 
        WHERE fkEmpresa = ${empresaId}
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);

    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrar,
    autenticar,
    buscarUsuariosPorEmpresa
};