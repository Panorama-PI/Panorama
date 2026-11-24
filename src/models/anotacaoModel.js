var database = require("../database/config");

// lista os projetos do usuario ja com os generos de cada um
function listarProjetos(idUsuario) {
    var sqlProjetos = `
        SELECT id, nome
        FROM projeto
        WHERE usuario_id = ?
        ORDER BY nome;
    `;

    return database.executar(sqlProjetos, [idUsuario]).then(function (projetos) {
        if (projetos.length === 0) {
            return projetos;
        }

        var ids = [];

        for (var i = 0; i < projetos.length; i++) {
            ids.push(projetos[i].id);
        }

        var sqlGeneros = `
            SELECT pg.projeto_id, g.id, g.nome
            FROM projeto_genero pg
            JOIN genero g ON g.id = pg.genero_id
            WHERE pg.projeto_id IN (?)
            ORDER BY g.nome;
        `;

        return database.executar(sqlGeneros, [ids]).then(function (generos) {
            for (var i = 0; i < projetos.length; i++) {
                projetos[i].generos = [];

                for (var j = 0; j < generos.length; j++) {
                    if (generos[j].projeto_id == projetos[i].id) {
                        projetos[i].generos.push({ id: generos[j].id, nome: generos[j].nome });
                    }
                }
            }

            return projetos;
        });
    });
}

// todos os generos disponiveis pro formulario
function listarGeneros() {
    var instrucaoSql = `
        SELECT id, nome
        FROM genero
        ORDER BY nome;
    `;

    return database.executar(instrucaoSql);
}

// cria o projeto e os vinculos de genero na mesma transacao
function criarProjeto(idUsuario, nome, generos) {
    return database.executarTransacao(async function ({ query }) {
        var resultado = await query(
            "INSERT INTO projeto (nome, usuario_id) VALUES (?, ?);",
            [nome, idUsuario]
        );

        if (generos.length > 0) {
            // o SELECT garante que so entram ids que existem em genero
            await query(
                "INSERT INTO projeto_genero (projeto_id, genero_id) SELECT ?, id FROM genero WHERE id IN (?);",
                [resultado.insertId, generos]
            );
        }

        return resultado;
    });
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

// atualiza o nome e troca o conjunto de generos (apaga os antigos e grava os novos)
function editarProjeto(idProjeto, idUsuario, nome, generos) {
    return database.executarTransacao(async function ({ query }) {
        var resultado = await query(
            "UPDATE projeto SET nome = ? WHERE id = ? AND usuario_id = ?;",
            [nome, idProjeto, idUsuario]
        );

        // projeto nao existe ou nao e desse usuario: nao mexe nos generos
        if (resultado.affectedRows === 0) {
            return resultado;
        }

        await query("DELETE FROM projeto_genero WHERE projeto_id = ?;", [idProjeto]);

        if (generos.length > 0) {
            await query(
                "INSERT INTO projeto_genero (projeto_id, genero_id) SELECT ?, id FROM genero WHERE id IN (?);",
                [idProjeto, generos]
            );
        }

        return resultado;
    });
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
    listarGeneros,
    criarProjeto,
    listarAnotacoes,
    criarAnotacao,
    editarAnotacao,
    excluirAnotacao,
    editarProjeto,
    excluirProjeto
};