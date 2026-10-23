
var filmesModel = require("../models/filmesModel");

function pesquisar(req, res) {
    var filtros = {
        filme: req.body.filmeServer || "",
        tipoVisao: req.body.tipoVisao,
        genero: req.body.genero || "",
        pais: req.body.pais || "",
        operadorLucro: req.body.operadorLucro || "",
        valorLucro: req.body.valorLucro,
        operadorAvaliacao: req.body.operadorAvaliacao || "",
        valorAvaliacao: req.body.valorAvaliacao
    };

    if (
        filtros.valorLucro !== "" &&
        filtros.valorLucro !== undefined &&
        !Number.isFinite(Number(filtros.valorLucro))
    ) {
        return res.status(400).json({
            mensagem: "Informe um valor de lucro válido."
        });
    }

    if (
        filtros.valorAvaliacao !== "" &&
        filtros.valorAvaliacao !== undefined &&
        !Number.isFinite(Number(filtros.valorAvaliacao))
    ) {
        return res.status(400).json({
            mensagem: "Informe uma avaliação válida."
        });
    }

    filmesModel.pesquisar(filtros)
        .then(function (resultado) {
            var filmes = [];

            for (var i = 0; i < resultado.length; i++) {
                filmes.push({
                    id: resultado[i].id,
                    titulo: resultado[i].titulo,
                    atorPrincipal: resultado[i].atorPrincipal,
                    genero: resultado[i].genero,
                    pais: resultado[i].pais,
                    lucro: resultado[i].lucro,
                    avaliacao: resultado[i].avaliacao
                });
            }

            res.json(filmes);
        })
        .catch(function (erro) {
            console.log("Erro ao pesquisar filmes:", erro);

            res.status(500).json({
                mensagem: "Erro ao pesquisar filmes."
            });
        });
}

module.exports = {
    pesquisar
};
