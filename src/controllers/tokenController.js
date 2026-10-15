var tokenModel = require("../models/tokenModel");
var hora = require("../../public/js/hora");

function verificaTokenExiste(req,res){
    let token = req.params.token;

    if(!token || !token.trim()){
        res.status(400).send({
            sucesso: false,
            mensagem: "O parametro 'token' é obrigatorio e não pode estar vazio"
        });
    }else{
        tokenModel.verificarTokenExiste(token)
        .then((verifica)=>{
            if(verifica){
                console.log("["+ hora.obterDataHoraFormatada() + "] ERRO 400: Token já cadastrado no banco");

                res.status(409).json({
                    sucesso: false,
                    mensagem: "Token já cadastrado no banco"
                });
            }else{
                console.log("["+ hora.obterDataHoraFormatada() + "] SUCESSO 200: Token valido para uso!");

                res.status(200).json({
                    sucesso: true,
                    mensagem: "Token valido para uso"
                });
            }
        }).catch((erro)=>{
            console.log("["+ hora.obterDataHoraFormatada() + "] ERRO 500: " + erro)

            res.status(500).json({
                    sucesso: false,
                    mensagem: "Erro interno no servidor"
            });
        }
        );
    }
}

function salvarToken(req,res){
    let token = req.body.token;
    let idEmpresa = req.body.idEmpresa;

    if(!token || !token.trim()){
        res.status(400).send({
            sucesso: false,
            mensagem: "O parametro 'token' é obrigatorio e não pode estar vazio"
        });
    }else if (!idEmpresa){
        res.status(400).send({
            sucesso: false,
            mensagem: "O parametro 'idEmpresa' invalido ou não informado"
        });
    }else{
        tokenModel.salvarToken(token,idEmpresa)
        .then((salvar)=>{
            if(salvar){
                console.log("["+ hora.obterDataHoraFormatada() + "] SUCESSO 201: Token Salvo com sucesso!");

                res.status(201).json({
                    sucesso: true,
                    mensagem: "Token Salvo com sucesso!"
                });
            }else{
                console.log("["+ hora.obterDataHoraFormatada() + "] ERRO 400: Não foi possivel salvar o Token no banco");

                res.status(400).json({
                    sucesso: false,
                    mensagem: "Não foi possivel salvar o Token no banco"
                });
            }
        }
        ).catch((erro)=>{
            console.log("["+ hora.obterDataHoraFormatada() + "] ERRO 500: " + erro)

            res.status(500).json({
                    sucesso: false,
                    mensagem: "Erro interno no servidor"
            });
        }
        );
    }
}

module.exports = {
    verificaTokenExiste,
    salvarToken
}