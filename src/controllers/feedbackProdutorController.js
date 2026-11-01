
var feedbackProdutorModel = require("../models/feedbackProdutorModel");

var BadRequestError = require("../errors/BadRequestError");
var NotFoundError = require("../errors/NotFoundError");
var ConflictError = require("../errors/ConflictError");
var ValidationError = require("../errors/ValidationError");

function idValido(id) {
    return (
        id !== null &&
        id !== undefined &&
        id !== "" &&
        Number.isSafeInteger(Number(id)) &&
        Number(id) > 0
    );
}

function validarTexto(texto) {
    if (typeof texto !== "string") {
        throw new BadRequestError(
            "O conteúdo do feedback deve ser um texto."
        );
    }

    if (texto.trim().length === 0) {
        throw new ValidationError(
            "O conteúdo do feedback é obrigatório."
        );
    }

    if (texto.trim().length > 2000) {
        throw new ValidationError(
            "O feedback não pode ultrapassar 2000 caracteres."
        );
    }

    return texto.trim();
}

function obterIdProdutor(req) {
    var idProdutor = req.params.idProdutor;

    if (!idValido(idProdutor)) {
        throw new BadRequestError(
            "O ID do produtor é inválido."
        );
    }

    return Number(idProdutor);
}

function listarFeedbacks(req, res, next) {
    try {
        var idProdutor = obterIdProdutor(req);

        feedbackProdutorModel.listarFeedbacks(idProdutor)
            .then((resultado) => {
                return res.status(200).json({
                    sucesso: true,
                    feedbacks: resultado
                });
            })
            .catch(next);

    } catch (erro) {
        next(erro);
    }
}

function buscarFeedback(req, res, next) {
    try {
        var idProdutor = obterIdProdutor(req);
        var idFeedback = req.params.id;

        if (!idValido(idFeedback)) {
            throw new BadRequestError(
                "O ID do feedback é inválido."
            );
        }

        feedbackProdutorModel.buscarFeedback(
            idFeedback,
            idProdutor
        )
            .then((resultado) => {
                if (resultado.length === 0) {
                    throw new NotFoundError(
                        "Feedback não encontrado."
                    );
                }

                return res.status(200).json({
                    sucesso: true,
                    feedback: resultado[0]
                });
            })
            .catch(next);

    } catch (erro) {
        next(erro);
    }
}

function listarPublicacoesDisponiveis(req, res, next) {
    try {
        var idProdutor = obterIdProdutor(req);

        feedbackProdutorModel.listarPublicacoesDisponiveis(
            idProdutor
        )
            .then((resultado) => {
                return res.status(200).json({
                    sucesso: true,
                    publicacoes: resultado
                });
            })
            .catch(next);

    } catch (erro) {
        next(erro);
    }
}

function cadastrarFeedback(req, res, next) {
    try {
        var idProdutor = obterIdProdutor(req);
        var idPublicacao = req.body.idPublicacao;
        var texto = validarTexto(req.body.texto);

        if (!idValido(idPublicacao)) {
            throw new BadRequestError(
                "O ID da publicação é inválido."
            );
        }

        feedbackProdutorModel.cadastrarFeedback(
            idProdutor,
            idPublicacao,
            texto
        )
            .then((resultado) => {
                if (resultado.affectedRows === 0) {
                    throw new ConflictError(
                        "Não foi possível cadastrar o feedback. A publicação pode estar indisponível ou já ter sido avaliada."
                    );
                }

                return res.status(201).json({
                    sucesso: true,
                    mensagem: "Feedback cadastrado com sucesso!",
                    id: resultado.insertId
                });
            })
            .catch(next);

    } catch (erro) {
        next(erro);
    }
}

function editarFeedback(req, res, next) {
    try {
        var idProdutor = obterIdProdutor(req);
        var idFeedback = req.params.id;
        var texto = validarTexto(req.body.texto);

        if (!idValido(idFeedback)) {
            throw new BadRequestError(
                "O ID do feedback é inválido."
            );
        }

        feedbackProdutorModel.editarFeedback(
            idFeedback,
            idProdutor,
            texto
        )
            .then((resultado) => {
                if (resultado.affectedRows === 0) {
                    throw new NotFoundError(
                        "Feedback não encontrado ou indisponível para edição."
                    );
                }

                return res.status(200).json({
                    sucesso: true,
                    mensagem: "Feedback atualizado com sucesso!"
                });
            })
            .catch(next);

    } catch (erro) {
        next(erro);
    }
}

function excluirFeedback(req, res, next) {
    try {
        var idProdutor = obterIdProdutor(req);
        var idFeedback = req.params.id;

        if (!idValido(idFeedback)) {
            throw new BadRequestError(
                "O ID do feedback é inválido."
            );
        }

        feedbackProdutorModel.excluirFeedback(
            idFeedback,
            idProdutor
        )
            .then((resultado) => {
                if (resultado.affectedRows === 0) {
                    throw new NotFoundError(
                        "Feedback não encontrado ou indisponível para exclusão."
                    );
                }

                return res.status(200).json({
                    sucesso: true,
                    mensagem: "Feedback excluído com sucesso!"
                });
            })
            .catch(next);

    } catch (erro) {
        next(erro);
    }
}

module.exports = {
    listarFeedbacks,
    buscarFeedback,
    listarPublicacoesDisponiveis,
    cadastrarFeedback,
    editarFeedback,
    excluirFeedback
};
