var tokenModel = require("../models/tokenModel");
var hora = require("../../public/js/hora");

function verificaTokenExiste(req,res){
    let token = req.params.token;

    if(!token || !token.trim()){
        res.status(400).json({
            sucesso: false,
            mensagem: "O parametro 'token' é obrigatorio e não pode estar vazio"
        });
    }else{
        tokenModel.verificarTokenExiste(token)
        .then((verifica)=>{
            if(verifica.length == 1){
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
    let email = req.body.email;

    if(!token || !token.trim()){
        res.status(400).json({
            sucesso: false,
            mensagem: "O parametro 'token' é obrigatorio e não pode estar vazio"
        });
    }else if(!email || !email.trim()){
        res.status(400).json({
            sucesso: false,
            mensagem: "O parametro 'email' é obrigatorio e não pode estar vazio"
        });
    }else if (!idEmpresa){
        res.status(400).json({
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

function autenticar(req,res){
    let token = req.body.token;

    if(!token || !token.trim()){
        res.status(400).json({
            sucesso: false,
            mensagem: "O parametro 'token' é obrigatorio e não pode estar vazio"
        });
    }else{
        tokenModel.autenticar(token)
        .then((auth)=>{
            if(auth.length > 0){
                console.log("["+ hora.obterDataHoraFormatada() + "] SUCESSO 200: Token autenticado com sucesso!");

                res.status(200).json({
                    sucesso: true,
                    idEmpresa: auth[0].id_empresa,
                });
            }else{
                console.log("["+ hora.obterDataHoraFormatada() + "] ERRO 400: Token inválido ou expirado");

                res.status(400).json({
                    sucesso: false,
                    mensagem: "Token inválido ou expirado"
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

function deletarToken(req,res){
    let token = req.body.token;

    if(!token || !token.trim()){
        res.status(400).json({
            sucesso: false,
            mensagem: "O parametro 'token' é obrigatorio e não pode estar vazio"
        });
    }else{
        tokenModel.deletar(token)
        .then((deletar)=>{
            if(deletar){
                console.log("["+ hora.obterDataHoraFormatada() + "] SUCESSO 200: Token deletado com sucesso!");

                res.status(200).json({
                    sucesso: true,
                    mensagem: "Token deletado com sucesso!"
                });
            }else{
                console.log("["+ hora.obterDataHoraFormatada() + "] ERRO 400: Não foi possivel deletar o Token no banco");

                res.status(400).json({
                    sucesso: false,
                    mensagem: "Não foi possivel deletar o Token no banco"
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
    salvarToken,
    autenticar,
    deletarToken
}