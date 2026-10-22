
var database = require("../database/config");

function pesquisar(filme) {
    var instrucaoSql = `
       SELECT
    f.nome AS titulo,
    MIN(fe.ator) AS atorPrincipal,
    MIN(fg.genero) AS genero,
    f.pais AS pais,
    -- Converte o valor cheio para milhões e corta os decimais
    CONCAT(TRUNCATE((f.receita - f.orcamento) / 1000000, 0), "M") AS lucro
FROM filme f
LEFT JOIN filme_elenco fe ON fe.filme_id = f.id
LEFT JOIN filme_genero fg ON fg.filme_id = f.id
WHERE f.nome LIKE '%${filme}%'
GROUP BY f.id, f.nome, f.pais, f.receita, f.orcamento;
`;

    return database.executar(instrucaoSql, [filme]);
}

module.exports = {
    pesquisar
};
