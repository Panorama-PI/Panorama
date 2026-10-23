
var database = require("../database/config");

function cadastrar(usuarioId, titulo, criterios) {
    var instrucaoSql = `
        INSERT INTO relatorio (
            usuario_id,
            titulo,
            tipo_visao,
            criterios_pesquisa,
            genero,
            pais,
            operador_lucro,
            valor_lucro,
            operador_avaliacao,
            valor_avaliacao,
            criado_em,
            atualizado_em
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    return database.executar(instrucaoSql, [
        usuarioId,
        titulo,
        criterios.tipoVisao,
        criterios.filme || "",
        criterios.genero || null,
        criterios.pais || null,
        criterios.operadorLucro || null,
        criterios.valorLucro === "" ? null : criterios.valorLucro,
        criterios.operadorAvaliacao || null,
        criterios.valorAvaliacao === "" ? null : criterios.valorAvaliacao
    ]);
}

function listar(usuarioId) {
    var instrucaoSql = `
        SELECT *
        FROM relatorio
        WHERE usuario_id = ?
        ORDER BY criado_em DESC
    `;

    return database.executar(instrucaoSql, [usuarioId]);
}

function buscarPorId(id, usuarioId) {
    var instrucaoSql = `
        SELECT *
        FROM relatorio
        WHERE id = ? AND usuario_id = ?
    `;

    return database.executar(instrucaoSql, [id, usuarioId]);
}

function atualizar(id, usuarioId, titulo, criterios) {
    var instrucaoSql = `
        UPDATE relatorio
        SET titulo = ?,
            tipo_visao = ?,
            criterios_pesquisa = ?,
            genero = ?,
            pais = ?,
            operador_lucro = ?,
            valor_lucro = ?,
            operador_avaliacao = ?,
            valor_avaliacao = ?,
            atualizado_em = NOW()
        WHERE id = ? AND usuario_id = ?
    `;

    return database.executar(instrucaoSql, [
        titulo,
        criterios.tipoVisao,
        criterios.filme || "",
        criterios.genero || null,
        criterios.pais || null,
        criterios.operadorLucro || null,
        criterios.valorLucro === "" ? null : criterios.valorLucro,
        criterios.operadorAvaliacao || null,
        criterios.valorAvaliacao === "" ? null : criterios.valorAvaliacao,
        id,
        usuarioId
    ]);
}

function excluir(id, usuarioId) {
    var instrucaoSql = `
        DELETE FROM relatorio
        WHERE id = ? AND usuario_id = ?
    `;

    return database.executar(instrucaoSql, [id, usuarioId]);
}

module.exports = {
    cadastrar,
    listar,
    buscarPorId,
    atualizar,
    excluir
};
