var database = require("../database/config");

// lembrar que tem que ver essa logica dos projetos, publico e nao de um usuario?
function listarProjetos() {
    var instrucaoSql = `
        SELECT id, nome
        FROM projeto
        ORDER BY nome;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function criarProjeto(nome) {
    var instrucaoSql = `
        INSERT INTO projeto (nome)
        VALUES ('${nome}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// as anotações continuam sendo de cada usuario
function listarAnotacoes(idUsuario) {
    var instrucaoSql = `
        SELECT id, projeto_id, titulo, conteudo, criado_em
        FROM observacao
        WHERE usuario_id = ${idUsuario}
        ORDER BY criado_em DESC;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// só devolve linha se o projeto existir
function criarAnotacao(idUsuario, idProjeto, titulo, conteudo) {
    var instrucaoSql = `
        INSERT INTO observacao (usuario_id, projeto_id, titulo, conteudo, criado_em)
        SELECT ${idUsuario}, id, '${titulo}', '${conteudo}', NOW()
        FROM projeto
        WHERE id = ${idProjeto};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// join p garantir que o projeto existe
function editarAnotacao(idAnotacao, idUsuario, idProjeto, titulo, conteudo) {
    var instrucaoSql = `
        UPDATE observacao o
        JOIN projeto p ON p.id = ${idProjeto}
        SET o.projeto_id = p.id,
            o.titulo = '${titulo}',
            o.conteudo = '${conteudo}'
        WHERE o.id = ${idAnotacao} AND o.usuario_id = ${idUsuario};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function excluirAnotacao(idAnotacao, idUsuario) {
    var instrucaoSql = `
        DELETE FROM observacao
        WHERE id = ${idAnotacao} AND usuario_id = ${idUsuario};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    listarProjetos,
    criarProjeto,
    listarAnotacoes,
    criarAnotacao,
    editarAnotacao,
    excluirAnotacao
};