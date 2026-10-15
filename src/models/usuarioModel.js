var database = require("../database/config")

// Cadastra um novo usuário no banco de dados.
// Recebe os dados do usuário e executa a instrução SQL de inserção.
function cadastrar(nome, email, senha, perfil_id, id_empresa) {
    console.log(
        "ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n" + 
        " \t\t >> verifique suas credenciais de acesso ao banco\n" + 
        " \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n" +
        " function cadastrar():", 
        nome, 
        email, 
        senha, 
        perfil_id, 
        id_empresa
    );

    var instrucaoSql = `
        INSERT INTO usuario (nome, email, senha_hash, perfil_id, id_empresa) 
        VALUES ('${nome}', '${email}', '${senha}','${perfil_id}', '${id_empresa}');
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
        SELECT id, nome, email, id_empresa as empresaId 
        FROM usuario 
        WHERE email = '${email}' AND senha_hash = '${senha}';
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    
    return database.executar(instrucaoSql);
}


// Busca os usuários vinculados a uma determinada empresa.
// Recebe o ID da empresa e retorna os usuários associados a ela.
function buscarUsuariosPorEmpresa(id) {
    var instrucaoSql = `
        SELECT * 
        FROM usuario a 
        WHERE id_empresa = ${id}
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);

    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrar,
    autenticar,
    buscarUsuariosPorEmpresa
};