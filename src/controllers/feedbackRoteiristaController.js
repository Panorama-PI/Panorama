
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

function horarioValido(horario) {
    return (
        typeof horario === "string" &&
        /^([01]\d|2[0-3]):[0-5]\d$/.test(horario)
    );
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
        var idAvaliacao = req.params.id;

        if (!idValido(idAvaliacao)) {
            throw new BadRequestError(
                "O ID da avaliação é inválido."
            );
        }

        feedbackRoteiristaModel.buscarFeedback(
            Number(idAvaliacao),
            idRoteirista
        )
            .then((resultado) => {
                if (resultado.length === 0) {
                    throw new NotFoundError(
                        "Avaliação não encontrada."
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

                var dados = resultado[0];

                return res.status(200).json({
                    sucesso: true,
                    notificacao: Number(dados.notificacao) === 1,
                    preferencias: {
                        horario_inicio: dados.horario_inicio,
                        horario_fim: dados.horario_fim
                    }
                });
            })
            .catch(next);

    } catch (erro) {
        next(erro);
    }
}

function atualizarNotificacao(req, res, next) {
    try {
        var idRoteirista = obterIdRoteirista(req);
        var corpo = req.body || {};

        var possuiAtivo = Object.prototype.hasOwnProperty.call(
            corpo,
            "ativo"
        );

        var camposPreferencia = [
            "horario_inicio",
            "horario_fim"
        ];

        var recebeuPreferencias = camposPreferencia.some(
            (campo) => Object.prototype.hasOwnProperty.call(
                corpo,
                campo
            )
        );

        if (possuiAtivo && recebeuPreferencias) {
            throw new BadRequestError(
                "Atualize a notificação e as preferências separadamente."
            );
        }

        if (!possuiAtivo && !recebeuPreferencias) {
            throw new BadRequestError(
                "Informe a notificação ou as preferências que deseja atualizar."
            );
        }

        var ativo = corpo.ativo;
        var horarioInicio = corpo.horario_inicio;
        var horarioFim = corpo.horario_fim;

        if (possuiAtivo && typeof ativo !== "boolean") {
            throw new BadRequestError(
                "O campo 'ativo' deve ser verdadeiro ou falso."
            );
        }

        if (recebeuPreferencias) {
            if (
                !horarioValido(horarioInicio) ||
                !horarioValido(horarioFim)
            ) {
                throw new BadRequestError(
                    "Informe horários válidos no formato HH:MM."
                );
            }

            if (horarioInicio >= horarioFim) {
                throw new BadRequestError(
                    "O horário final precisa ser maior que o horário inicial."
                );
            }
        }

        feedbackRoteiristaModel.buscarNotificacao(idRoteirista)
            .then((resultado) => {
                if (resultado.length === 0) {
                    throw new NotFoundError(
                        "Roteirista não encontrado."
                    );
                }

                if (possuiAtivo) {
                    return feedbackRoteiristaModel.atualizarNotificacao(
                        idRoteirista,
                        ativo
                    );
                }

                return feedbackRoteiristaModel.atualizarPreferencias(
                    idRoteirista,
                    horarioInicio,
                    horarioFim
                );
            })
            .then(() => {
                return feedbackRoteiristaModel.buscarNotificacao(
                    idRoteirista
                );
            })
            .then((resultado) => {
                if (resultado.length === 0) {
                    throw new NotFoundError(
                        "Roteirista não encontrado."
                    );
                }

                var dados = resultado[0];

                return res.status(200).json({
                    sucesso: true,
                    mensagem: possuiAtivo
                        ? "Preferência de notificação atualizada com sucesso."
                        : "Preferências salvas com sucesso.",
                    notificacao: Number(dados.notificacao) === 1,
                    preferencias: {
                        horario_inicio: dados.horario_inicio,
                        horario_fim: dados.horario_fim
                    }
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
