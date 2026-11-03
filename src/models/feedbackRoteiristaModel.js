var database = require("../database/config");

// Os ids chegam validados pelo controller; Number() garante que só número entra no SQL.

// Feedbacks das publicações do roteirista
function listarFeedbacks(idRoteirista) {
    var instrucao = `
        SELECT
            f.id,
            f.texto,
            f.criado_em,
            p.id AS publicacao_id,
            p.titulo AS titulo_publicacao,
            u.nome AS nome_produtor
        FROM feedback f
        JOIN publicacao p ON p.id = f.publicacao_id
        JOIN usuario u ON u.id = f.autor_id
        WHERE p.usuario_id = ${idRoteirista}
        ORDER BY f.criado_em DESC, f.id DESC;
    `;
    return database.executar(instrucao);
}

// Só devolve se o feedback for de uma publicação do roteirista
function buscarFeedback(idFeedback, idRoteirista) {
    var instrucao = `
        SELECT
            f.id,
            f.texto,
            f.criado_em,
            p.id AS publicacao_id,
            p.titulo AS titulo_publicacao,
            u.nome AS nome_produtor
        FROM feedback f
        JOIN publicacao p ON p.id = f.publicacao_id
        JOIN usuario u ON u.id = f.autor_id
        WHERE f.id = ${idFeedback}
          AND p.usuario_id = ${idRoteirista};
    `;
    return database.executar(instrucao);
}

function buscarNotificacao(idRoteirista) {
    var instrucao = `
        SELECT id, notificacao
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

module.exports = {
    listarFeedbacks,
    buscarFeedback,
    buscarNotificacao,
    atualizarNotificacao
};