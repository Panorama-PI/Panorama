var publicacaoRModel = require("../models/publicacaoRModel");

// Importe as classes de erro criadas pelo seu colega
const { BadRequestError, NotFoundError } = require("../errors");

function listarPublicacoes(req, res, next) { // <-- Adicionado 'next'
    var idUsuario = req.query.idUsuario;

    if (!idUsuario) {
        return next(new BadRequestError("Usuário não informado!"));
    }

    publicacaoRModel.listarPublicacoes(idUsuario)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            next(erro); // Repassa o erro 500
        });
}

function buscarPublicacao(req, res, next) { // <-- Adicionado 'next'
    var idPublicacao = req.params.id;

    publicacaoRModel.buscarPublicacao(idPublicacao)
        .then(function (resultado) {
            if (resultado.length == 0) {
                return next(new NotFoundError("Publicação não encontrada!"));
            }

            res.json(resultado[0]);
        })
        .catch(function (erro) {
            console.log(erro);
            next(erro); // Repassa o erro 500
        });
}

function listarProjetos(req, res, next) { // <-- Adicionado 'next'
    var idUsuario = req.query.idUsuario;

    if (!idUsuario) {
        return next(new BadRequestError("Usuário não informado!"));
    }

    publicacaoRModel.listarProjetos(idUsuario)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            next(erro); // Repassa o erro 500
        });
}

function listarAnotacoes(req, res, next) { // <-- Adicionado 'next'
    var idProjeto = req.params.idProjeto;

    publicacaoRModel.listarAnotacoes(idProjeto)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            next(erro); // Repassa o erro 500
        });
}

function listarAnotacoesPublicacao(req, res, next) { // <-- Adicionado 'next'
    var idPublicacao = req.params.id;

    publicacaoRModel.listarAnotacoesPublicacao(idPublicacao)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            next(erro); // Repassa o erro 500
        });
}

function criarPublicacao(req, res, next) { // <-- Adicionado 'next'
    var idUsuario = req.body.idUsuario;
    var idProjeto = req.body.idProjeto;
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    var anotacoesIds = req.body.anotacoesIds || [];

    if (!idUsuario || !idProjeto || !titulo || !descricao) {
        return next(new BadRequestError("Preencha os campos obrigatórios!"));
    }

    if (titulo.length > 50) {
        return next(new BadRequestError("O título deve ter até 50 caracteres!"));
    }

    if (!Array.isArray(anotacoesIds)) {
        return next(new BadRequestError("Anotações inválidas!"));
    }

    publicacaoRModel.criarPublicacao(idUsuario, idProjeto, titulo, descricao, anotacoesIds)
        .then(function (resultado) {
            if (resultado.projetoNaoEncontrado) {
                return next(new NotFoundError("Projeto não encontrado!"));
            }

            res.status(201).json({
                id: resultado.id,
                mensagem: "Publicação criada com sucesso!"
            });
        })
        .catch(function (erro) {
            console.log(erro);
            next(erro); // Repassa o erro 500
        });
}

function editarPublicacao(req, res, next) { // <-- Adicionado 'next'
    var idPublicacao = req.params.id;
    var idProjeto = req.body.idProjeto;
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    var anotacoesIds = req.body.anotacoesIds || [];

    if (!idProjeto || !titulo || !descricao) {
        return next(new BadRequestError("Preencha os campos obrigatórios!"));
    }

    if (titulo.length > 50) {
        return next(new BadRequestError("O título deve ter até 50 caracteres!"));
    }

    if (!Array.isArray(anotacoesIds)) {
        return next(new BadRequestError("Anotações inválidas!"));
    }

    publicacaoRModel.editarPublicacao(idPublicacao, idProjeto, titulo, descricao, anotacoesIds)
        .then(function (resultado) {
            if (resultado.naoEncontrada) {
                return next(new NotFoundError("Publicação não encontrada!"));
            }

            res.status(200).json({
                id: resultado.id,
                mensagem: "Publicação atualizada com sucesso!"
            });
        })
        .catch(function (erro) {
            console.log(erro);
            next(erro); // Repassa o erro 500
        });
}

function excluirPublicacao(req, res, next) { // <-- Adicionado 'next'
    var idPublicacao = req.params.id;

    publicacaoRModel.excluirPublicacao(idPublicacao)
        .then(function (resultado) {
            if (resultado.affectedRows == 0) {
                return next(new NotFoundError("Publicação não encontrada!"));
            }

            res.status(200).json({ mensagem: "Publicação excluída com sucesso!" });
        })
        .catch(function (erro) {
            console.log(erro);
            next(erro); // Repassa o erro 500
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