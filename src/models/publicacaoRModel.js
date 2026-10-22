var database = require("../database/config");
var mysql = require("mysql2"); // usado apenas para escapar textos (mysql.escape)

// Garante que a lista de ids seja formada apenas por números inteiros positivos.
function sanitizarIds(ids) {
    return (ids || [])
        .map(Number)
        .filter(function (n) {
            return Number.isInteger(n) && n > 0;
        });
}

// Vincula as anotações selecionadas à publicação.
// Só vincula anotações que realmente pertencem ao projeto informado.
function inserirAnotacoes(idPublicacao, idProjeto, anotacoesIds) {
    var ids = sanitizarIds(anotacoesIds);

    if (ids.length === 0) {
        return Promise.resolve();
    }

    var instrucaoSql = `
        INSERT INTO publicacao_observacao (id_publicacao, id_observacao)
        SELECT ${Number(idPublicacao)}, id
        FROM observacao
        WHERE projeto_id = ${Number(idProjeto)}
        AND id IN (${ids.join(",")});
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listarPublicacoes(idUsuario) {
    var instrucaoSql = `
        SELECT p.id, p.projeto_id, p.usuario_id, p.titulo, p.descricao,
               p.criado_em, p.atualizado_em, pr.nome AS nome_projeto
        FROM publicacao p
        LEFT JOIN projeto pr ON pr.id = p.projeto_id
        WHERE p.usuario_id = ${Number(idUsuario)}
        ORDER BY p.criado_em DESC;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarPublicacao(idPublicacao) {
    var instrucaoSql = `
        SELECT p.id, p.projeto_id, p.usuario_id, p.titulo, p.descricao,
               p.criado_em, p.atualizado_em, pr.nome AS nome_projeto
        FROM publicacao p
        LEFT JOIN projeto pr ON pr.id = p.projeto_id
        WHERE p.id = ${Number(idPublicacao)};
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// Lista apenas os projetos do usuário conectado.
function listarProjetos(idUsuario) {
    var instrucaoSql = `
        SELECT id, nome
        FROM projeto
        WHERE usuario_id = ${Number(idUsuario)}
        ORDER BY nome;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listarAnotacoes(idProjeto) {
    var instrucaoSql = `
        SELECT id, projeto_id, titulo, conteudo, criado_em
        FROM observacao
        WHERE projeto_id = ${Number(idProjeto)}
        ORDER BY criado_em DESC;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listarAnotacoesPublicacao(idPublicacao) {
    var instrucaoSql = `
        SELECT o.id, o.projeto_id, o.titulo, o.conteudo, o.criado_em
        FROM observacao o
        JOIN publicacao_observacao po ON po.id_observacao = o.id
        WHERE po.id_publicacao = ${Number(idPublicacao)}
        ORDER BY o.criado_em DESC;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// Retorna { id } em caso de sucesso ou { projetoNaoEncontrado: true }.
function criarPublicacao(idUsuario, idProjeto, titulo, descricao, anotacoesIds) {
    // O SELECT garante que o projeto existe e pertence ao usuário.
    var instrucaoSql = `
        INSERT INTO publicacao (projeto_id, usuario_id, titulo, descricao)
        SELECT id, ${Number(idUsuario)}, ${mysql.escape(titulo)}, ${mysql.escape(descricao)}
        FROM projeto
        WHERE id = ${Number(idProjeto)}
        AND usuario_id = ${Number(idUsuario)};
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);

    return database.executar(instrucaoSql)
        .then(function (resultado) {
            if (resultado.affectedRows === 0) {
                return { projetoNaoEncontrado: true };
            }

            var idPublicacao = resultado.insertId;

            return inserirAnotacoes(idPublicacao, idProjeto, anotacoesIds)
                .then(function () {
                    return { id: idPublicacao };
                });
        });
}

// Retorna { id } em caso de sucesso ou { naoEncontrada: true }.
function editarPublicacao(idPublicacao, idProjeto, titulo, descricao, anotacoesIds) {
    var instrucaoSql = `
        UPDATE publicacao
        SET
            projeto_id = ${Number(idProjeto)},
            titulo = ${mysql.escape(titulo)},
            descricao = ${mysql.escape(descricao)},
            atualizado_em = NOW()
        WHERE id = ${Number(idPublicacao)};
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);

    return database.executar(instrucaoSql)
        .then(function (resultado) {
            if (resultado.affectedRows === 0) {
                return { naoEncontrada: true };
            }

            var instrucaoSqlExcluir = `
                DELETE FROM publicacao_observacao
                WHERE id_publicacao = ${Number(idPublicacao)};
            `;

            console.log("Executando a instrução SQL: \n" + instrucaoSqlExcluir);

            return database.executar(instrucaoSqlExcluir)
                .then(function () {
                    return inserirAnotacoes(idPublicacao, idProjeto, anotacoesIds);
                })
                .then(function () {
                    return { id: Number(idPublicacao) };
                });
        });
}

function excluirPublicacao(idPublicacao) {
    var instrucaoSqlAnotacoes = `
        DELETE FROM publicacao_observacao
        WHERE id_publicacao = ${Number(idPublicacao)};
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSqlAnotacoes);

    return database.executar(instrucaoSqlAnotacoes)
        .then(function () {
            var instrucaoSql = `
                DELETE FROM publicacao
                WHERE id = ${Number(idPublicacao)};
            `;

            console.log("Executando a instrução SQL: \n" + instrucaoSql);
            return database.executar(instrucaoSql);
        });
}

module.exports = {
    listarPublicacoes,
    buscarPublicacao,
    listarProjetos,
    listarAnotacoes,
    listarAnotacoesPublicacao,
    criarPublicacao,
    editarPublicacao,
    excluirPublicacao
};