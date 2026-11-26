let publicacaoModel = require("../models/publicacaoModel");
var hora = require("../../public/js/hora");

// Importe as classes de erro
const { BadRequestError, NotFoundError } = require("../errors");

function buscarPublicacoes(req, res, next) { // <-- Adicionado 'next'
    let idEmpresa = req.params.idEmpresa;
    let idProdutor = Number(req.query.idProdutor);

    if (!Number.isSafeInteger(Number(idEmpresa)) || Number(idEmpresa) <= 0) {
        // Erro 400 substituído
        return next(new BadRequestError("O parametro 'idEmpresa' é obrigatorio e não pode estar vazio"));
    } 
    
    if (!Number.isSafeInteger(idProdutor) || idProdutor <= 0) {
        return next(new BadRequestError("O ID do produtor é obrigatório e deve ser válido."));
    }

    publicacaoModel.buscarPublicacoes(idEmpresa, idProdutor)
        .then((resultado) => {
            if (resultado) {
                console.log("[" + hora.obterDataHoraFormatada() + "] SUCESSO 200: publicações foram encontradas!");
                res.status(200).json({
                    sucesso: true,
                    publicacoes: resultado
                });
            }
        })
        .catch((erro) => {
            console.log("[" + hora.obterDataHoraFormatada() + "] ERRO ao buscar publicações: " + erro);
            // Erro 500 repassado
            next(erro);
        });
}

function salvarAvaliacao(req, res, next) {
    const idPublicacao = Number(req.params.id);
    const idProdutor = Number(req.body.idProdutor);
    const nota = Number(req.body.nota);

    if (!Number.isSafeInteger(idPublicacao) || idPublicacao <= 0 ||
        !Number.isSafeInteger(idProdutor) || idProdutor <= 0) {
        return next(new BadRequestError("Informe IDs válidos para publicação e produtor."));
    }

    if (!Number.isInteger(nota) || nota < 1 || nota > 5) {
        return next(new BadRequestError("A nota deve ser um número inteiro entre 1 e 5."));
    }

    publicacaoModel.salvarAvaliacao(idPublicacao, idProdutor, nota)
        .then((publicacaoElegivel) => {
            if (!publicacaoElegivel) {
                return next(new NotFoundError("Publicação não encontrada para este produtor."));
            }

            return res.status(200).json({
                sucesso: true,
                mensagem: "Avaliação salva com sucesso.",
                nota
            });
        })
        .catch(next);
}

function buscarPublicacoesAnotacoes(req, res, next) { // <-- Adicionado 'next'
    let id = req.params.id;

    if (!id) {
        // Erro 400 substituído
        return next(new BadRequestError("O parametro 'id' é obrigatorio e não pode estar vazio"));
    } 
    
    publicacaoModel.buscarPublicacoesAnotacoes(id)
        .then((resultado) => {
            if (resultado.length > 0) {
                console.log("[" + hora.obterDataHoraFormatada() + "] SUCESSO 200: As anotações da publicação foram encontradas");
                const primeiraLinha = resultado[0];

                const response = {
                    id: primeiraLinha.id_publicacao,
                    titulo: primeiraLinha.titulo,
                    projeto: primeiraLinha.nome_projeto,
                    roteirista: primeiraLinha.roteirista,
                    data: primeiraLinha.data_publicacao,
                    descricao: primeiraLinha.descricao,
                    anotacoes: []
                };

                resultado.forEach(linha => {
                    if (linha.id_observacao) {
                        response.anotacoes.push({
                            id: linha.id_observacao,
                            titulo: linha.observacao_titulo,
                            conteudo: linha.observacao_conteudo,
                            criado_em: linha.observacao_criado_em,
                            autor: linha.observacao_autor
                        });
                    }
                });

                res.status(200).json({
                    sucesso: true,
                    publicacao: response
                });
            } else {
                // Erro 404 substituído
                return next(new NotFoundError("Publicação não encontrada"));
            }
        })
        .catch((erro) => {
            console.log("[" + hora.obterDataHoraFormatada() + "] ERRO ao buscar anotações da publicação: " + erro);
            // Erro 500 repassado
            next(erro);
        });
}

function buscarRoteiristas(req, res, next) { // <-- Adicionado 'next'
    let idEmpresa = req.query.idEmpresa || req.params.idEmpresa;

    if (!idEmpresa) {
        // Erro 400 substituído
        return next(new BadRequestError("O parametro 'idEmpresa' é obrigatorio e não pode estar vazio"));
    }

    publicacaoModel.buscarRoteiristas(idEmpresa)
        .then((resultado) => {
            console.log("[" + hora.obterDataHoraFormatada() + "] SUCESSO 200: Roteiristas encontrados!");
            res.status(200).json({
                sucesso: true,
                roteiristas: resultado
            });
        })
        .catch((erro) => {
            console.log("[" + hora.obterDataHoraFormatada() + "] ERRO ao buscar roteiristas: " + erro);
            // Erro 500 repassado
            next(erro);
        });
}

function obterIdProdutorNotificacao(req) {
    const idProdutor = Number(req.params.idProdutor);
    if (!Number.isSafeInteger(idProdutor) || idProdutor <= 0) {
        throw new BadRequestError("O ID do produtor é inválido.");
    }
    return idProdutor;
}

function buscarNotificacaoProdutor(req, res, next) {
    try {
        const idProdutor = obterIdProdutorNotificacao(req);
        publicacaoModel.buscarNotificacaoProdutor(idProdutor)
            .then((resultado) => {
                if (!resultado.length) return next(new NotFoundError("Produtor não encontrado."));
                const dados = resultado[0];
                return res.status(200).json({
                    sucesso: true,
                    notificacao: Number(dados.notificacao) === 1,
                    preferencias: { horario_inicio: dados.horario_inicio, horario_fim: dados.horario_fim }
                });
            })
            .catch(next);
    } catch (erro) { next(erro); }
}

function atualizarNotificacaoProdutor(req, res, next) {
    try {
        const idProdutor = obterIdProdutorNotificacao(req);
        const corpo = req.body || {};
        const temAtivo = Object.prototype.hasOwnProperty.call(corpo, "ativo");
        const temHorarios = Object.prototype.hasOwnProperty.call(corpo, "horario_inicio") ||
            Object.prototype.hasOwnProperty.call(corpo, "horario_fim");
        if (temAtivo === temHorarios) {
            throw new BadRequestError("Informe a notificação ou os horários que deseja atualizar.");
        }
        if (temAtivo && typeof corpo.ativo !== "boolean") {
            throw new BadRequestError("O campo ativo deve ser verdadeiro ou falso.");
        }
        if (temHorarios) {
            const formato = /^([01]\d|2[0-3]):[0-5]\d$/;
            if (typeof corpo.horario_inicio !== "string" || !formato.test(corpo.horario_inicio) ||
                typeof corpo.horario_fim !== "string" || !formato.test(corpo.horario_fim) ||
                corpo.horario_inicio >= corpo.horario_fim) {
                throw new BadRequestError("Informe um intervalo de horários válido.");
            }
        }
        publicacaoModel.atualizarNotificacaoProdutor(
            idProdutor, temAtivo ? corpo.ativo : undefined,
            corpo.horario_inicio, corpo.horario_fim
        ).then(() => publicacaoModel.buscarNotificacaoProdutor(idProdutor))
            .then((resultado) => {
                if (!resultado.length) return next(new NotFoundError("Produtor não encontrado."));
                const dados = resultado[0];
                return res.status(200).json({
                    sucesso: true,
                    mensagem: temAtivo ? "Preferência de notificação atualizada com sucesso." : "Preferências salvas com sucesso.",
                    notificacao: Number(dados.notificacao) === 1,
                    preferencias: { horario_inicio: dados.horario_inicio, horario_fim: dados.horario_fim }
                });
            }).catch(next);
    } catch (erro) { next(erro); }
}

module.exports = {
    buscarPublicacoes,
    salvarAvaliacao,
    buscarPublicacoesAnotacoes,
    buscarRoteiristas,
    buscarNotificacaoProdutor,
    atualizarNotificacaoProdutor
};
