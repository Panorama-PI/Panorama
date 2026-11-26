
var database = require("../database/config");

function listarFeedbacks(idRoteirista) {
    var instrucao = `
        SELECT
            a.id AS id,
            f.id AS id_feedback,
            f.texto,
            a.criado_em,
            p.id AS publicacao_id,
            p.titulo AS titulo_publicacao,
            u.nome AS nome_produtor,
            a.texto AS avaliacao
        FROM avaliacao a
        JOIN publicacao p
            ON p.id = a.publicacao_id
        JOIN usuario u
            ON u.id = a.autor_id
        LEFT JOIN feedback f
            ON f.publicacao_id = a.publicacao_id
            AND f.autor_id = a.autor_id
        WHERE p.usuario_id = ${idRoteirista}
        ORDER BY a.criado_em DESC, a.id DESC;
    `;

    return database.executar(instrucao);
}

function buscarFeedback(idAvaliacao, idRoteirista) {
    var instrucao = `
        SELECT
            a.id AS id,
            f.id AS id_feedback,
            f.texto,
            a.criado_em,
            p.id AS publicacao_id,
            p.titulo AS titulo_publicacao,
            u.nome AS nome_produtor,
            a.texto AS avaliacao
        FROM avaliacao a
        JOIN publicacao p
            ON p.id = a.publicacao_id
        JOIN usuario u
            ON u.id = a.autor_id
        LEFT JOIN feedback f
            ON f.publicacao_id = a.publicacao_id
            AND f.autor_id = a.autor_id
        WHERE a.id = ${idAvaliacao}
          AND p.usuario_id = ${idRoteirista};
    `;

    return database.executar(instrucao);
}

function buscarNotificacao(idRoteirista) {
    var instrucao = `
        SELECT
            id,
            notificacao,
            horario_inicio,
            horario_fim
        FROM usuario
        WHERE id = ${idRoteirista}
          AND perfil_id <> 1;
    `;

    return database.executar(instrucao);
}

function atualizarNotificacao(idRoteirista, ativo) {
    var instrucao = `
        UPDATE usuario
        SET notificacao = ${ativo ? 1 : 0}
        WHERE id = ${idRoteirista}
          AND perfil_id <> 1;
    `;

    return database.executar(instrucao);
}

function atualizarPreferencias(
    idRoteirista,
    horarioInicio,
    horarioFim
) {
    var instrucao = `
        UPDATE usuario
        SET
            horario_inicio = '${horarioInicio}',
            horario_fim = '${horarioFim}'
        WHERE id = ${idRoteirista}
          AND perfil_id <> 1;
    `;

    return database.executar(instrucao);
}

module.exports = {
    listarFeedbacks,
    buscarFeedback,
    buscarNotificacao,
    atualizarNotificacao,
    atualizarPreferencias
};
