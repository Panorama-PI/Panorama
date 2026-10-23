
var database = require("../database/config");

function pesquisar(filtros) {
    var instrucaoSql = `
        SELECT
            f.id,
            f.nome AS titulo,
            MIN(fe.ator) AS atorPrincipal,
            MIN(fg.genero) AS genero,
            f.pais AS pais,
            f.score AS avaliacao,
            (f.receita - f.orcamento) AS lucro
        FROM filme f
        LEFT JOIN filme_elenco fe ON fe.filme_id = f.id
        LEFT JOIN filme_genero fg ON fg.filme_id = f.id
        WHERE f.nome LIKE ?
    `;

    var parametros = ["%" + (filtros.filme || "") + "%"];

    if (filtros.genero) {
        instrucaoSql += `
            AND EXISTS (
                SELECT 1
                FROM filme_genero fg2
                WHERE fg2.filme_id = f.id
                AND fg2.genero = ?
            )
        `;

        parametros.push(filtros.genero);
    }

    if (filtros.pais) {
        instrucaoSql += " AND f.pais = ?";
        parametros.push(filtros.pais);
    }

    if (filtros.tipoVisao == "produtor" && filtros.operadorLucro && filtros.valorLucro !== "") {
        if (filtros.operadorLucro == "maior") {
            instrucaoSql += " AND (f.receita - f.orcamento) >= ?";
            parametros.push(Number(filtros.valorLucro));
        } else if (filtros.operadorLucro == "menor") {
            instrucaoSql += " AND (f.receita - f.orcamento) <= ?";
            parametros.push(Number(filtros.valorLucro));
        }
    }

    if (filtros.tipoVisao == "roteirista" && filtros.operadorAvaliacao && filtros.valorAvaliacao !== "") {
        if (filtros.operadorAvaliacao == "maior") {
            instrucaoSql += " AND f.score >= ?";
            parametros.push(Number(filtros.valorAvaliacao));
        } else if (filtros.operadorAvaliacao == "menor") {
            instrucaoSql += " AND f.score <= ?";
            parametros.push(Number(filtros.valorAvaliacao));
        }
    }

    instrucaoSql += `
        GROUP BY
            f.id, f.nome, f.pais, f.score, f.receita, f.orcamento
        ORDER BY f.nome
    `;

    return database.executar(instrucaoSql, parametros);
}

module.exports = {
    pesquisar
};

