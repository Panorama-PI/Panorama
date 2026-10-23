
var relatorioModel = require("../models/relatorioModel");

function cadastrar(req, res) {
    var usuarioId = req.body.usuarioId;
    var titulo = req.body.titulo;
    var criterios = req.body.criterios;

    if (!usuarioId || !titulo || !criterios) {
        return res.status(400).json({
            mensagem: "Informe o usuário, o título e os critérios."
        });
    }

    relatorioModel.cadastrar(usuarioId, titulo, criterios)
        .then(function (resultado) {
            res.status(201).json({
                mensagem: "Filtro salvo com sucesso!",
                id: resultado.insertId
            });
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json({
                mensagem: "Erro ao salvar o filtro."
            });
        });
}

function listar(req, res) {
    relatorioModel.listar(req.params.usuarioId)
        .then(function (resultado) {
            var filtros = [];

            for (var i = 0; i < resultado.length; i++) {
                filtros.push({
                    id: resultado[i].id,
                    titulo: resultado[i].titulo,
                    criterios_pesquisa: {
                        tipoVisao: resultado[i].tipo_visao,
                        filme: resultado[i].criterios_pesquisa,
                        genero: resultado[i].genero,
                        pais: resultado[i].pais,
                        operadorLucro: resultado[i].operador_lucro,
                        valorLucro: resultado[i].valor_lucro,
                        operadorAvaliacao: resultado[i].operador_avaliacao,
                        valorAvaliacao: resultado[i].valor_avaliacao
                    }
                });
            }

            res.json(filtros);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json({
                mensagem: "Erro ao listar os filtros."
            });
        });
}

function buscarPorId(req, res) {
    relatorioModel.buscarPorId(req.params.id, req.params.usuarioId)
        .then(function (resultado) {
            if (resultado.length == 0) {
                return res.status(404).json({
                    mensagem: "Filtro não encontrado."
                });
            }

            res.json(resultado[0]);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json({
                mensagem: "Erro ao buscar o filtro."
            });
        });
}

function atualizar(req, res) {
    var usuarioId = req.body.usuarioId;
    var titulo = req.body.titulo;
    var criterios = req.body.criterios;

    if (!usuarioId || !titulo || !criterios) {
        return res.status(400).json({
            mensagem: "Informe o usuário, o título e os critérios."
        });
    }

    relatorioModel.atualizar(
        req.params.id,
        usuarioId,
        titulo,
        criterios
    )
        .then(function (resultado) {
            if (resultado.affectedRows == 0) {
                return res.status(404).json({
                    mensagem: "Filtro não encontrado."
                });
            }

            res.json({
                mensagem: "Filtro atualizado com sucesso!"
            });
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json({
                mensagem: "Erro ao atualizar o filtro."
            });
        });
}

function excluir(req, res) {
    relatorioModel.excluir(req.params.id, req.params.usuarioId)
        .then(function (resultado) {
            if (resultado.affectedRows == 0) {
                return res.status(404).json({
                    mensagem: "Filtro não encontrado."
                });
            }

            res.json({
                mensagem: "Filtro excluído com sucesso!"
            });
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json({
                mensagem: "Erro ao excluir o filtro."
            });
        });
}

module.exports = {
    cadastrar,
    listar,
    buscarPorId,
    atualizar,
    excluir
};
