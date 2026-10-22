let publicacaoModel = require("../models/publicacaoModel");
var hora = require("../../public/js/hora");

function buscarPublicacoes(req,res){

    let idEmpresa = req.params.idEmpresa;

    if(!idEmpresa){
        res.status(400).json({
            sucesso: false,
            mensagem: "O parametro 'idEmpresa' é obrigatorio e não pode estar vazio"
        })

    }else{
        publicacaoModel.buscarPublicacoes(idEmpresa)
        .then((resultado)=>{
            if(resultado){
                console.log("["+ hora.obterDataHoraFormatada() + "] SUCESSO 200: publicações foram encontradas!");
                res.status(200).json({
                    sucesso: true,
                    publicacoes: resultado
                });
            }
        }
        ).catch((erro)=>{
            console.log("["+ hora.obterDataHoraFormatada() + "] ERRO 500: " + erro)
            res.status(500).json({
                sucesso: false,
                mensagem: "Erro interno no servidor"
            })
        }
        );
    }
}

function buscarPublicacoesAnotacoes(req,res){
    let id = req.params.id;

    if(!id){
        res.status(400).json({
            sucesso: false,
            mensagem: "O parametro 'id' é obrigatorio e não pode estar vazio"
        });
    }else{
        publicacaoModel.buscarPublicacoesAnotacoes(id)
        .then((resultado)=>{
            if(resultado.length > 0){
                console.log("["+ hora.obterDataHoraFormatada() + "] SUCESSO 200: As anotações da publicação foram encontradas");
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
            }else{
                res.status(404).json({
                    sucesso: true,
                    mensagem: "publicação não encontrada"
                });
            }
        }).catch((erro)=>{
            console.log("["+ hora.obterDataHoraFormatada() + "] ERRO 500: " + erro)
            res.status(500).json({
                sucesso: false,
                mensagem: "Erro interno no servidor"
            })
        });
    }

}

module.exports = {
    buscarPublicacoes,
    buscarPublicacoesAnotacoes
}