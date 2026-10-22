
var filmesModel = require("../models/filmesModel");
var tokenModel = require("../models/tokenModel");

function pesquisar(req, res) {
    var filme = req.body.filmeServer;

    if (filme == undefined || filme.trim() == "") {
        return res.status(400).send("Informe o nome do filme!");
    }

    filmesModel.pesquisar(filme)
        .then(function (resultadoPesquisar) {

            console.log("Quantidade de filmes:", resultadoPesquisar.length);
            console.log("Filmes encontrados:", resultadoPesquisar);

            if (resultadoPesquisar.length == 0) {
                return res.json([]);
            }

            var filmes = [];

            for (var i = 0; i < resultadoPesquisar.length; i++) {
                filmes.push({
                    titulo: resultadoPesquisar[i].titulo,
                    atorPrincipal: resultadoPesquisar[i].atorPrincipal,
                    genero: resultadoPesquisar[i].genero,
                    pais: resultadoPesquisar[i].pais,
                    lucro: resultadoPesquisar[i].lucro
                });
            }

            return res.json(filmes);
        })
        .catch(function (erro) {
            console.log("Erro ao pesquisar filmes:", erro);
            console.log("Erro SQL:", erro.sqlMessage);

            return res.status(500).json({
                mensagem: "Erro ao pesquisar filmes."
            });
        });
}

module.exports = {
    pesquisar
};
