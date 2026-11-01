var anotacaoModel = require("../models/anotacaoModel");
// Importe as classes de erro fornecidas pelo seu colega
const { NotFoundError, ConflictError } = require("../errors"); // Ajuste o caminho

function listarProjetos(req, res, next) { // <-- Adicione 'next'
    var idUsuario = req.params.idUsuario;

    anotacaoModel.listarProjetos(idUsuario)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            // Em erros de banco de dados, passe o erro original ou lance um erro interno
            next(erro); 
        });
}

function criarProjeto(req, res, next) {
    var idUsuario = req.body.idUsuario;
    var nome = req.body.nome;

    anotacaoModel.criarProjeto(idUsuario, nome)
        .then(function (resultado) {
            res.status(201).json({ id: resultado.insertId });
        })
        .catch(function (erro) {
            console.log(erro);
            next(erro);
        });
}

function listarAnotacoes(req, res, next) {
    var idUsuario = req.params.idUsuario;

    anotacaoModel.listarAnotacoes(idUsuario)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            next(erro);
        });
}

function criarAnotacao(req, res, next) {
    var idUsuario = req.body.idUsuario;
    var idProjeto = req.body.idProjeto;
    var titulo = req.body.titulo;
    var conteudo = req.body.conteudo;

    anotacaoModel.criarAnotacao(idUsuario, idProjeto, titulo, conteudo)
        .then(function (resultado) {
            if (resultado.affectedRows == 0) {
                // Use a classe de erro aqui, passando pelo 'next'
                return next(new NotFoundError("Projeto não encontrado ou não pertence ao usuário!"));
            }
            res.status(201).json({ id: resultado.insertId });
        })
        .catch(function (erro) {
            console.log(erro);
            next(erro);
        });
}

function editarAnotacao(req, res, next) {
    var idAnotacao = req.body.id;
    var idUsuario = req.body.idUsuario;
    var idProjeto = req.body.idProjeto;
    var titulo = req.body.titulo;
    var conteudo = req.body.conteudo;

    anotacaoModel.editarAnotacao(idAnotacao, idUsuario, idProjeto, titulo, conteudo)
        .then(function (resultado) {
            if (resultado.affectedRows == 0) {
                return next(new NotFoundError("Anotação ou projeto não encontrado!"));
            }
            res.status(200).send("Anotação atualizada!");
        })
        .catch(function (erro) {
            console.log(erro);
            next(erro);
        });
}

function excluirAnotacao(req, res, next) {
    var idAnotacao = req.body.id;
    var idUsuario = req.body.idUsuario;

    anotacaoModel.excluirAnotacao(idAnotacao, idUsuario)
        .then(function (resultado) {
            if (resultado.affectedRows == 0) {
                return next(new NotFoundError("Anotação não encontrada para este usuário!"));
            }
            res.status(200).send("Anotação excluída!");
        })
        .catch(function (erro) {
            console.log(erro);
            next(erro);
        });
}

function editarProjeto(req, res, next) {
    var idProjeto = req.body.id;
    var idUsuario = req.body.idUsuario;
    var nome = req.body.nome;

    anotacaoModel.editarProjeto(idProjeto, idUsuario, nome)
        .then(function (resultado) {
            if (resultado.affectedRows === 0) {
                return next(new NotFoundError("Projeto não encontrado para este usuário!"));
            }
            res.status(200).send("Projeto atualizado!");
        })
        .catch(function (erro) {
            console.log(erro);
            next(erro);
        });
}

function excluirProjeto(req, res, next) {
    var idProjeto = req.body.id;
    var idUsuario = req.body.idUsuario;

    anotacaoModel.excluirProjeto(idProjeto, idUsuario)
        .then(function (resultado) {
            if (resultado.affectedRows === 0) {
                return next(new ConflictError("Não foi possível excluir. O projeto pode não existir, não pertencer a você ou possuir anotações."));
            }
            res.status(200).send("Projeto excluído!");
        })
        .catch(function (erro) {
            console.log(erro);
            next(erro);
        });
}

module.exports = {
    listarProjetos,
    criarProjeto,
    listarAnotacoes,
    criarAnotacao,
    editarAnotacao,
    excluirAnotacao,
    editarProjeto,
    excluirProjeto
};