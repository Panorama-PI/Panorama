
var database = require("../database/config");

function montarFiltros(filtros) {
    var where = " WHERE f.nome LIKE ?";
    var parametros = ["%" + (filtros.filme || "") + "%"];

    if (filtros.genero) {
        where += `
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
        where += " AND f.pais = ?";
        parametros.push(filtros.pais);
    }

    if (
        filtros.tipoVisao == "produtor" &&
        filtros.operadorLucro &&
        filtros.valorLucro !== "" &&
        filtros.valorLucro !== undefined
    ) {
        if (filtros.operadorLucro == "maior") {
            where += " AND (f.receita - f.orcamento) >= ?";
            parametros.push(Number(filtros.valorLucro));
        } else if (filtros.operadorLucro == "menor") {
            where += " AND (f.receita - f.orcamento) <= ?";
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
            where += " AND f.score >= ?";
            parametros.push(Number(filtros.valorAvaliacao));
        } else if (filtros.operadorAvaliacao == "menor") {
            where += " AND f.score <= ?";
            parametros.push(Number(filtros.valorAvaliacao));
        }
    }

    return {
        where: where,
        parametros: parametros
    };
}


function pesquisar(filtros, limite, offset) {
    var filtrosSql = montarFiltros(filtros);

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
    `;

    instrucaoSql += filtrosSql.where;
    instrucaoSql += " ORDER BY f.nome, f.id";
    instrucaoSql += " LIMIT " + Number(limite) + " OFFSET " + Number(offset);

    return database.executar(instrucaoSql, filtrosSql.parametros);
}


function contar(filtros) {
    var filtrosSql = montarFiltros(filtros);

    var instrucaoSql = "SELECT COUNT(*) AS total FROM filme f" + filtrosSql.where;

    return database.executar(instrucaoSql, filtrosSql.parametros);
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
    contar,
    top10
};
