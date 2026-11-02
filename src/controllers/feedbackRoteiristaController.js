var feedbackRoteiristaModel = require("../models/feedbackRoteiristaModel");

var BadRequestError = require("../errors/BadRequestError");
var NotFoundError = require("../errors/NotFoundError");

function idValido(id) {
    return (
        id !== null &&
        id !== undefined &&
        id !== "" &&
        Number.isSafeInteger(Number(id)) &&
        Number(id) > 0
    );
}

function obterIdRoteirista(req) {
    var idRoteirista = req.params.idRoteirista;

    if (!idValido(idRoteirista)) {
        throw new BadRequestError(
            "O ID do roteirista é inválido."
        );
    }

    return Number(idRoteirista);
}

function listarFeedbacks(req, res, next) {
    try {
        var idRoteirista = obterIdRoteirista(req);

        feedbackRoteiristaModel.listarFeedbacks(idRoteirista)
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
        var idRoteirista = obterIdRoteirista(req);
        var idFeedback = req.params.id;

        if (!idValido(idFeedback)) {
            throw new BadRequestError(
                "O ID do feedback é inválido."
            );
        }

        feedbackRoteiristaModel.buscarFeedback(
            idFeedback,
            idRoteirista
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

// Sininho: devolve se o roteirista quer receber e-mails
function buscarNotificacao(req, res, next) {
    try {
        var idRoteirista = obterIdRoteirista(req);

        feedbackRoteiristaModel.buscarNotificacao(idRoteirista)
            .then((resultado) => {
                if (resultado.length === 0) {
                    throw new NotFoundError(
                        "Roteirista não encontrado."
                    );
                }

                // notificacao nula = nunca mexeu no sininho = ativado (padrão da tela)
                var valor = resultado[0].notificacao;
                var ativo = valor === null || Number(valor) === 1;

                return res.status(200).json({
                    sucesso: true,
                    notificacao: ativo
                });
            })
            .catch(next);

    } catch (erro) {
        next(erro);
    }
}

// Sininho: liga ou desliga os e-mails
function atualizarNotificacao(req, res, next) {
    try {
        var idRoteirista = obterIdRoteirista(req);
        var ativo = req.body.ativo;

        if (typeof ativo !== "boolean") {
            throw new BadRequestError(
                "O campo 'ativo' deve ser verdadeiro ou falso."
            );
        }

        feedbackRoteiristaModel.buscarNotificacao(idRoteirista)
            .then((resultado) => {
                if (resultado.length === 0) {
                    throw new NotFoundError(
                        "Roteirista não encontrado."
                    );
                }

                return feedbackRoteiristaModel.atualizarNotificacao(
                    idRoteirista,
                    ativo
                );
            })
            .then(() => {
                return res.status(200).json({
                    sucesso: true,
                    mensagem: ativo
                        ? "Notificações por e-mail ativadas."
                        : "Notificações por e-mail desativadas.",
                    notificacao: ativo
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
    buscarNotificacao,
    atualizarNotificacao
};