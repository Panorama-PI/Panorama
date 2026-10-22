var database = require("../database/config");

// lembrar que tem que ver essa logica dos projetos, publico e nao de um usuario?
function listarProjetos(idUsuario) {
    var instrucaoSql = `
        SELECT id, nome
        FROM projeto
        WHERE usuario_id = ${idUsuario}
        ORDER BY nome;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function criarProjeto(idUsuario, nome) {
    var instrucaoSql = `
        INSERT INTO projeto (nome, usuario_id)
        VALUES ('${nome}', ${idUsuario});
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// as anotações continuam sendo de cada usuario
function listarAnotacoes(idUsuario) {
    var instrucaoSql = `
        SELECT o.id, o.projeto_id, o.titulo, o.conteudo, o.criado_em
        FROM observacao o
        JOIN projeto p ON o.projeto_id = p.id
        WHERE p.usuario_id = ${idUsuario}
        ORDER BY o.criado_em DESC;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// só devolve linha se o projeto existir
function criarAnotacao(idUsuario, idProjeto, titulo, conteudo) {
    var instrucaoSql = `
        INSERT INTO observacao (projeto_id, titulo, conteudo, criado_em)
        SELECT id, '${titulo}', '${conteudo}', NOW()
        FROM projeto
        WHERE id = ${idProjeto}
          AND usuario_id = ${idUsuario};
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// join p garantir que o projeto existe
function editarAnotacao(idAnotacao, idUsuario, idProjeto, titulo, conteudo) {
    var instrucaoSql = `
        UPDATE observacao o
        JOIN projeto projeto_atual
            ON o.projeto_id = projeto_atual.id
        JOIN projeto novo_projeto
            ON novo_projeto.id = ${idProjeto}
        SET o.projeto_id = novo_projeto.id,
            o.titulo = '${titulo}',
            o.conteudo = '${conteudo}'
        WHERE o.id = ${idAnotacao}
          AND projeto_atual.usuario_id = ${idUsuario}
          AND novo_projeto.usuario_id = ${idUsuario};
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function excluirAnotacao(idAnotacao, idUsuario) {
    var instrucaoSql = `
        DELETE o
        FROM observacao o
        JOIN projeto p ON o.projeto_id = p.id
        WHERE o.id = ${idAnotacao}
          AND p.usuario_id = ${idUsuario};
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function editarProjeto(idProjeto, idUsuario, nome) {
    var instrucaoSql = `
        UPDATE projeto
        SET nome = '${nome}'
        WHERE id = ${idProjeto}
          AND usuario_id = ${idUsuario};
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function excluirProjeto(idProjeto, idUsuario) {
    var instrucaoSql = `
        DELETE FROM projeto
        WHERE id = ${idProjeto}
          AND usuario_id = ${idUsuario}
          AND NOT EXISTS (
              SELECT 1
              FROM observacao
              WHERE projeto_id = projeto.id
          );
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
    excluirAnotacao,
    editarProjeto,
    excluirProjeto
};