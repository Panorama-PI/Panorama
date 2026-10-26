
var database = require("../database/config");

function pesquisar(filtros) {
    var instrucaoSql = `
        SELECT
            f.id,
            f.nome AS titulo,
            f.pais,
            f.score AS avaliacao,
            (f.receita - f.orcamento) AS lucro,
            (
        SELECT fg.genero
        FROM filme_genero fg
         WHERE fg.filme_id = f.id
        LIMIT 1
        ) AS genero,
            (
      SELECT fe.ator
      FROM filme_elenco fe
      WHERE fe.filme_id = f.id
      LIMIT 1
      ) AS atorPrincipal
        FROM filme f
        WHERE f.nome LIKE ?
    `;

    var parametros = ["%" + (filtros.filme || "") + "%"];

    if (filtros.genero) {
        instrucaoSql += `
            AND EXISTS (
                SELECT 1
                FROM filme_genero fg
                WHERE fg.filme_id = f.id
                AND fg.genero = ?
            )
        `;

        parametros.push(filtros.genero);
    }

    if (filtros.pais) {
        instrucaoSql += " AND f.pais = ?";
        parametros.push(filtros.pais);
    }

    if (
        filtros.tipoVisao == "produtor" &&
        filtros.operadorLucro &&
        filtros.valorLucro !== "" &&
        filtros.valorLucro !== undefined
    ) {
        if (filtros.operadorLucro == "maior") {
            instrucaoSql += " AND (f.receita - f.orcamento) >= ?";
            parametros.push(Number(filtros.valorLucro));
        } else if (filtros.operadorLucro == "menor") {
            instrucaoSql += " AND (f.receita - f.orcamento) <= ?";
            parametros.push(Number(filtros.valorLucro));
        }
    }

    if (
        filtros.tipoVisao == "roteirista" &&
        filtros.operadorAvaliacao &&
        filtros.valorAvaliacao !== "" &&
        filtros.valorAvaliacao !== undefined
    ) {
        if (filtros.operadorAvaliacao == "maior") {
            instrucaoSql += " AND f.score >= ?";
            parametros.push(Number(filtros.valorAvaliacao));
        } else if (filtros.operadorAvaliacao == "menor") {
            instrucaoSql += " AND f.score <= ?";
            parametros.push(Number(filtros.valorAvaliacao));
        }
    }

    instrucaoSql += " ORDER BY f.nome";

    return database.executar(instrucaoSql, parametros);
}


function top10(tipoVisao) {
    var instrucaoSql = `
        SELECT
            f.id,
            f.nome AS titulo,
            f.pais,
            f.score AS avaliacao,
            (f.receita - f.orcamento) AS lucro,
            (
                SELECT fg.genero
                FROM filme_genero fg
                WHERE fg.filme_id = f.id
                LIMIT 1
            ) AS genero,
            (
                SELECT fe.ator
                FROM filme_elenco fe
                WHERE fe.filme_id = f.id
                LIMIT 1
            ) AS atorPrincipal
        FROM filme f
        WHERE
    `;

    if (tipoVisao == "produtor") {
        instrucaoSql += `
            f.receita IS NOT NULL
            AND f.orcamento IS NOT NULL
            ORDER BY (f.receita - f.orcamento) DESC
        `;
    } else {
        instrucaoSql += `
            f.score IS NOT NULL
            ORDER BY f.score DESC
        `;
    }

    instrucaoSql += ", f.nome ASC LIMIT 10";

    return database.executar(instrucaoSql);
}


module.exports = {
    pesquisar,
    top10
};
