var filmesModel = require("../models/filmesModel");

// Importe a classe de erro (ajuste o caminho e o nome conforme o código do seu colega)
const { BadRequestError } = require("../errors");

function pesquisar(req, res, next) { // <-- Adicionado 'next'
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
        // Substituído o res.status(400) pela classe de erro
        return next(new BadRequestError("Informe um valor de lucro válido."));
    }

    if (
        filtros.valorAvaliacao !== "" &&
        filtros.valorAvaliacao !== undefined &&
        !Number.isFinite(Number(filtros.valorAvaliacao))
    ) {
        // Substituído o res.status(400) pela classe de erro
        return next(new BadRequestError("Informe uma avaliação válida."));
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

            console.log("Filmes enviados para o navegador:", filmes);
            res.json(filmes);
        })
        .catch(function (erro) {
            console.log("Erro ao pesquisar filmes:", erro);
            // Repassa o erro não tratado para o middleware
            next(erro);
        });
}

function top10(req, res, next) { // <-- Adicionado 'next'
    var tipoVisao = req.body.tipoVisao;

    if (tipoVisao != "produtor" && tipoVisao != "roteirista") {
        // Substituído o res.status(400) pela classe de erro
        return next(new BadRequestError("Tipo de pesquisa inválido."));
    }

    filmesModel.top10(tipoVisao)
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
            console.log("Erro ao buscar o top 10:", erro);
            // Repassa o erro não tratado para o middleware
            next(erro);
        });
}

module.exports = {
    pesquisar,
    top10
};