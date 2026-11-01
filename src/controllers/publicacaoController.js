let publicacaoModel = require("../models/publicacaoModel");
var hora = require("../../public/js/hora");

// Importe as classes de erro
const { BadRequestError, NotFoundError } = require("../errors");

function buscarPublicacoes(req, res, next) { // <-- Adicionado 'next'
    let idEmpresa = req.params.idEmpresa;

    if (!idEmpresa) {
        // Erro 400 substituído
        return next(new BadRequestError("O parametro 'idEmpresa' é obrigatorio e não pode estar vazio"));
    } 
    
    publicacaoModel.buscarPublicacoes(idEmpresa)
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

module.exports = {
    buscarPublicacoes,
    buscarPublicacoesAnotacoes,
    buscarRoteiristas
};