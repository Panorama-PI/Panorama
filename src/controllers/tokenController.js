var tokenModel = require("../models/tokenModel");
var hora = require("../../public/js/hora");

// Importe as classes de erro
const { BadRequestError, ConflictError } = require("../errors");

function verificaTokenExiste(req, res, next) { // <-- Adicionado 'next'
    let token = req.params.token;
    
    if(!token || !token.trim()){
        return next(new BadRequestError("O parametro 'token' é obrigatorio e não pode estar vazio"));
    }
    
    tokenModel.verificarTokenExiste(token)
        .then((verifica)=>{
            if(verifica.length == 1){
                console.log("["+ hora.obterDataHoraFormatada() + "] ERRO 409: Token já cadastrado no banco");
                // Substituído o res.status(409) pela classe de erro
                return next(new ConflictError("Token já cadastrado no banco"));
            }
            
            console.log("["+ hora.obterDataHoraFormatada() + "] SUCESSO 200: Token valido para uso!");
            res.status(200).json({
                sucesso: true,
                mensagem: "Token valido para uso"
            });
        }).catch((erro)=>{
            console.log("["+ hora.obterDataHoraFormatada() + "] ERRO ao verificar token: " + erro);
            next(erro); // Repassa o erro 500
        });
}

function salvarToken(req, res, next) { // <-- Adicionado 'next'
    let token = req.body.token;
    let idEmpresa = req.body.idEmpresa;
    let email = req.body.email; 

    if(!token || !token.trim()){
        return next(new BadRequestError("O parametro 'token' é obrigatorio e não pode estar vazio"));
    }
    
    if(!email || !email.trim()){
        return next(new BadRequestError("O parametro 'email' é obrigatorio e não pode estar vazio"));
    }
    
    if (!idEmpresa){
        return next(new BadRequestError("O parametro 'idEmpresa' invalido ou não informado"));
    }
    
    tokenModel.salvarToken(token, idEmpresa, email)
        .then((salvar)=>{
            if(salvar){
                console.log("["+ hora.obterDataHoraFormatada() + "] SUCESSO 201: Token Salvo com sucesso!");
                res.status(201).json({
                    sucesso: true,
                    mensagem: "Token Salvo com sucesso!"
                });
            } else {
                console.log("["+ hora.obterDataHoraFormatada() + "] ERRO 400: Não foi possivel salvar o Token no banco");
                return next(new BadRequestError("Não foi possivel salvar o Token no banco"));
            }
        }).catch((erro)=>{
            console.log("["+ hora.obterDataHoraFormatada() + "] ERRO ao salvar token: " + erro);
            next(erro); // Repassa o erro 500
        });
}

function autenticar(req, res, next) { // <-- Adicionado 'next'
    let token = req.params.token;

    if(!token || !token.trim()){
        return next(new BadRequestError("O parametro 'token' é obrigatorio e não pode estar vazio"));
    }
    
    tokenModel.autenticar(token)
        .then((auth)=>{
            if(auth.length > 0){
                console.log("["+ hora.obterDataHoraFormatada() + "] SUCESSO 200: Token autenticado com sucesso!");
                res.status(200).json({
                    sucesso: true,
                    idEmpresa: auth[0].id_empresa,
                });
            } else {
                console.log("["+ hora.obterDataHoraFormatada() + "] ERRO 400: Token inválido ou expirado");
                return next(new BadRequestError("Token inválido ou expirado"));
            }
        }).catch((erro)=>{
            console.log("["+ hora.obterDataHoraFormatada() + "] ERRO ao autenticar token: " + erro);
            next(erro); // Repassa o erro 500
        });
}

function atualizarToken(req, res, next) { // <-- Adicionado 'next'
    let tokenNovo = req.body.tokenNovo;
    let tokenAntigo = req.body.tokenAntigo;

    if(!tokenNovo || !tokenNovo.trim()){
        return next(new BadRequestError("O parametro 'tokenNovo' é obrigatorio e não pode estar vazio"));
    }
    
    if(!tokenAntigo || !tokenAntigo.trim()){
        return next(new BadRequestError("O parametro 'tokenAntigo' é obrigatorio e não pode estar vazio"));
    }
    
    tokenModel.atualizarToken(tokenNovo, tokenAntigo)
        .then((deletar)=>{
            if(deletar){
                console.log("["+ hora.obterDataHoraFormatada() + "] SUCESSO 200: Token atualizado com sucesso!");
                res.status(200).json({
                    sucesso: true,
                    mensagem: "Token atualizado com sucesso!"
                });
            } else {
                console.log("["+ hora.obterDataHoraFormatada() + "] ERRO 400: Não foi possivel atualizar o Token no banco");
                return next(new BadRequestError("Não foi possivel atualizar o Token no banco"));
            }
        }).catch((erro)=>{
            console.log("["+ hora.obterDataHoraFormatada() + "] ERRO ao atualizar token: " + erro);
            next(erro); // Repassa o erro 500
        });
}

module.exports = {
    verificaTokenExiste,
    salvarToken,
    autenticar,
    atualizarToken
};