var anotacaoModel = require("../models/anotacaoModel");

function listarProjetos(req, res) {
    anotacaoModel.listarProjetos()
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro);
        });
}

function criarProjeto(req, res) {
    var nome = req.body.nome;

    anotacaoModel.criarProjeto(nome)
        .then(function (resultado) {
            res.status(201).json({ id: resultado.insertId });
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro);
        });
}

function listarAnotacoes(req, res) {
    var idUsuario = req.params.idUsuario;

    anotacaoModel.listarAnotacoes(idUsuario)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro);
        });
}

function criarAnotacao(req, res) {
    var idUsuario = req.body.idUsuario;
    var idProjeto = req.body.idProjeto;
    var titulo = req.body.titulo;
    var conteudo = req.body.conteudo;

    anotacaoModel.criarAnotacao(idUsuario, idProjeto, titulo, conteudo)
        .then(function (resultado) {
            // 0 linhas inseridas = o projeto não existe
            if (resultado.affectedRows == 0) {
                res.status(404).send("Projeto não encontrado!");
                return;
            }
            res.status(201).json({ id: resultado.insertId });
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro);
        });
}

function editarAnotacao(req, res) {
    var idAnotacao = req.body.id;
    var idUsuario = req.body.idUsuario;
    var idProjeto = req.body.idProjeto;
    var titulo = req.body.titulo;
    var conteudo = req.body.conteudo;

    anotacaoModel.editarAnotacao(idAnotacao, idUsuario, idProjeto, titulo, conteudo)
        .then(function (resultado) {
            // 0 linhas alteradas entao anotação não eh desse usuário ou projeto não existe
            if (resultado.affectedRows == 0) {
                res.status(404).send("Anotação ou projeto não encontrado!");
                return;
            }
            res.status(200).send("Anotação atualizada!");
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro);
        });
}

function excluirAnotacao(req, res) {
    var idAnotacao = req.body.id;
    var idUsuario = req.body.idUsuario;

    anotacaoModel.excluirAnotacao(idAnotacao, idUsuario)
        .then(function (resultado) {
            if (resultado.affectedRows == 0) {
                res.status(404).send("Anotação não encontrada para este usuário!");
                return;
            }
            res.status(200).send("Anotação excluída!");
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro);
        });
}

module.exports = {
    listarProjetos,
    criarProjeto,
    listarAnotacoes,
    criarAnotacao,
    editarAnotacao,
    excluirAnotacao
};