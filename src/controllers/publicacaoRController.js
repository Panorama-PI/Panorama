var publicacaoRModel = require("../models/publicacaoRModel");

function listarPublicacoes(req, res) {
    var idUsuario = req.query.idUsuario;

    if (!idUsuario) {
        res.status(400).json({ mensagem: "Usuário não informado!" });
        return;
    }

    publicacaoRModel.listarPublicacoes(idUsuario)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro);
        });
}

function buscarPublicacao(req, res) {
    var idPublicacao = req.params.id;

    publicacaoRModel.buscarPublicacao(idPublicacao)
        .then(function (resultado) {
            if (resultado.length == 0) {
                res.status(404).json({ mensagem: "Publicação não encontrada!" });
                return;
            }

            res.json(resultado[0]);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro);
        });
}

function listarProjetos(req, res) {
    var idUsuario = req.query.idUsuario;

    if (!idUsuario) {
        res.status(400).json({ mensagem: "Usuário não informado!" });
        return;
    }

    publicacaoRModel.listarProjetos(idUsuario)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro);
        });
}

function listarAnotacoes(req, res) {
    var idProjeto = req.params.idProjeto;

    publicacaoRModel.listarAnotacoes(idProjeto)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro);
        });
}

function listarAnotacoesPublicacao(req, res) {
    var idPublicacao = req.params.id;

    publicacaoRModel.listarAnotacoesPublicacao(idPublicacao)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro);
        });
}

function criarPublicacao(req, res) {
    var idUsuario = req.body.idUsuario;
    var idProjeto = req.body.idProjeto;
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    var anotacoesIds = req.body.anotacoesIds || [];

    if (!idUsuario || !idProjeto || !titulo || !descricao) {
        res.status(400).json({ mensagem: "Preencha os campos obrigatórios!" });
        return;
    }

    if (titulo.length > 50) {
        res.status(400).json({ mensagem: "O título deve ter até 50 caracteres!" });
        return;
    }

    if (!Array.isArray(anotacoesIds)) {
        res.status(400).json({ mensagem: "Anotações inválidas!" });
        return;
    }

    publicacaoRModel.criarPublicacao(idUsuario, idProjeto, titulo, descricao, anotacoesIds)
        .then(function (resultado) {
            if (resultado.projetoNaoEncontrado) {
                res.status(404).json({ mensagem: "Projeto não encontrado!" });
                return;
            }

            res.status(201).json({
                id: resultado.id,
                mensagem: "Publicação criada com sucesso!"
            });
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro);
        });
}

function editarPublicacao(req, res) {
    var idPublicacao = req.params.id;
    var idProjeto = req.body.idProjeto;
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    var anotacoesIds = req.body.anotacoesIds || [];

    if (!idProjeto || !titulo || !descricao) {
        res.status(400).json({ mensagem: "Preencha os campos obrigatórios!" });
        return;
    }

    if (titulo.length > 50) {
        res.status(400).json({ mensagem: "O título deve ter até 50 caracteres!" });
        return;
    }

    if (!Array.isArray(anotacoesIds)) {
        res.status(400).json({ mensagem: "Anotações inválidas!" });
        return;
    }

    publicacaoRModel.editarPublicacao(idPublicacao, idProjeto, titulo, descricao, anotacoesIds)
        .then(function (resultado) {
            if (resultado.naoEncontrada) {
                res.status(404).json({ mensagem: "Publicação não encontrada!" });
                return;
            }

            res.status(200).json({
                id: resultado.id,
                mensagem: "Publicação atualizada com sucesso!"
            });
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro);
        });
}

function excluirPublicacao(req, res) {
    var idPublicacao = req.params.id;

    publicacaoRModel.excluirPublicacao(idPublicacao)
        .then(function (resultado) {
            if (resultado.affectedRows == 0) {
                res.status(404).json({ mensagem: "Publicação não encontrada!" });
                return;
            }

            res.status(200).json({ mensagem: "Publicação excluída com sucesso!" });
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro);
        });
}

module.exports = {
    listarPublicacoes,
    buscarPublicacao,
    listarProjetos,
    listarAnotacoes,
    listarAnotacoesPublicacao,
    criarPublicacao,
    editarPublicacao,
    excluirPublicacao
};