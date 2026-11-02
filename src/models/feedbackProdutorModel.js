
var database = require("../database/config");

function listarFeedbacks(idProdutor) {
    console.log("ACESSEI O FEEDBACK PRODUTOR MODEL - listarFeedbacks()");

    let sql = `
        SELECT
            f.id,
            f.texto,
            f.publicacao_id AS idPublicacao,
            p.titulo,
            u.nome AS roteirista
        FROM feedback AS f
        INNER JOIN publicacao AS p
            ON f.publicacao_id = p.id
        INNER JOIN usuario AS u
            ON p.usuario_id = u.id
        INNER JOIN usuario AS produtor
            ON f.autor_id = produtor.id
        WHERE f.autor_id = ${idProdutor}
          AND u.id_empresa = produtor.id_empresa
        ORDER BY f.id DESC;
    `;

    return database.executar(sql);
}

function buscarFeedback(idFeedback, idProdutor) {
    console.log("ACESSEI O FEEDBACK PRODUTOR MODEL - buscarFeedback()");

    let sql = `
        SELECT
            f.id,
            f.texto,
            f.publicacao_id AS idPublicacao,
            p.titulo,
            u.nome AS roteirista
        FROM feedback AS f
        INNER JOIN publicacao AS p
            ON f.publicacao_id = p.id
        INNER JOIN usuario AS u
            ON p.usuario_id = u.id
        INNER JOIN usuario AS produtor
            ON f.autor_id = produtor.id
        WHERE f.id = ${idFeedback}
          AND f.autor_id = ${idProdutor}
          AND u.id_empresa = produtor.id_empresa;
    `;

    return database.executar(sql);
}

function listarPublicacoesDisponiveis(idProdutor) {
    console.log("ACESSEI O FEEDBACK PRODUTOR MODEL - listarPublicacoesDisponiveis()");

    let sql = `
        SELECT
            p.id,
            p.titulo,
            u.nome AS roteirista
        FROM publicacao AS p
        INNER JOIN usuario AS u
            ON p.usuario_id = u.id
        INNER JOIN usuario AS produtor
            ON produtor.id = ${idProdutor}
        WHERE u.id_empresa = produtor.id_empresa
          AND u.perfil_id = 2
          AND NOT EXISTS (
              SELECT 1
              FROM feedback AS f
              WHERE f.publicacao_id = p.id
                AND f.autor_id = produtor.id
          )
        ORDER BY p.titulo;
    `;

    return database.executar(sql);
}

function cadastrarFeedback(idProdutor, idPublicacao, texto) {
    console.log("ACESSEI O FEEDBACK PRODUTOR MODEL - cadastrarFeedback()");

    let sql = `
        INSERT INTO feedback (
            texto,
            status_enviado,
            publicacao_id,
            autor_id
        )
        SELECT
            '${texto}',
            CASE
                WHEN roteirista.notificacao = 1 THEN 0
                ELSE 1
            END,
            p.id,
            produtor.id
        FROM publicacao AS p
        INNER JOIN usuario AS roteirista
            ON p.usuario_id = roteirista.id
        INNER JOIN usuario AS produtor
            ON produtor.id = ${idProdutor}
        WHERE p.id = ${idPublicacao}
          AND produtor.perfil_id = 1
          AND roteirista.perfil_id = 2
          AND roteirista.id_empresa = produtor.id_empresa
          AND NOT EXISTS (
              SELECT 1
              FROM feedback AS f
              WHERE f.publicacao_id = p.id
                AND f.autor_id = produtor.id
          );
    `;

    return database.executar(sql);
}

function editarFeedback(idFeedback, idProdutor, texto) {
    console.log("ACESSEI O FEEDBACK PRODUTOR MODEL - editarFeedback()");

    let sql = `
        UPDATE feedback AS f
        INNER JOIN publicacao AS p
            ON f.publicacao_id = p.id
        INNER JOIN usuario AS roteirista
            ON p.usuario_id = roteirista.id
        INNER JOIN usuario AS produtor
            ON f.autor_id = produtor.id
        SET
            f.texto = '${texto}',
            f.status_enviado = CASE
                WHEN roteirista.notificacao = 1 THEN 0
                ELSE 1
            END
        WHERE f.id = ${idFeedback}
          AND f.autor_id = ${idProdutor}
          AND produtor.perfil_id = 1
          AND roteirista.id_empresa = produtor.id_empresa;
    `;

    return database.executar(sql);
}

function excluirFeedback(idFeedback, idProdutor) {
    console.log("ACESSEI O FEEDBACK PRODUTOR MODEL - excluirFeedback()");

    let sql = `
        DELETE f
        FROM feedback AS f
        INNER JOIN publicacao AS p
            ON f.publicacao_id = p.id
        INNER JOIN usuario AS roteirista
            ON p.usuario_id = roteirista.id
        INNER JOIN usuario AS produtor
            ON f.autor_id = produtor.id
        WHERE f.id = ${idFeedback}
          AND f.autor_id = ${idProdutor}
          AND produtor.perfil_id = 1
          AND roteirista.id_empresa = produtor.id_empresa;
    `;

    return database.executar(sql);
}

module.exports = {
    listarFeedbacks,
    buscarFeedback,
    listarPublicacoesDisponiveis,
    cadastrarFeedback,
    editarFeedback,
    excluirFeedback
};