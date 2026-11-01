var empresaModel = require("../models/empresaModel");
var validacoes = require("../../public/js/validacoes-cadastro");

// Importe as classes de erro (ajuste o caminho e os nomes de acordo com o que seu colega criou)
const { BadRequestError, ConflictError, NotFoundError } = require("../errors");

async function cadastrar(req, res, next) { // <-- Adicionado o parâmetro 'next'
    console.log("[CADASTRO 1] Requisição recebida");

    var corpo = req.body || {};

    var resultado = validacoes.validarCadastroEmpresa({
        nomeEmpresa: corpo.nomeEmpresaServer,
        cnpj: corpo.cnpjServer,
        telefone: corpo.telefoneServer,
        nomeAdmin: corpo.nomeAdminServer,
        email: corpo.emailServer,
        senha: corpo.senhaServer,
        confirmacaoSenha: corpo.confirmacaoSenhaServer
    });

    console.log("[CADASTRO 2] Validação concluída");

    if (resultado.erros.length > 0) {
        // Se a classe de erro do seu colega aceitar um segundo parâmetro com os detalhes dos erros,
        // você pode passar 'resultado.erros' lá. Ex: new BadRequestError("Mensagem", resultado.erros)
        return next(new BadRequestError("Cadastro não realizado. Corrija os itens informados."));
    }

    try {
        console.log("[CADASTRO 3] Chamando model");

        await empresaModel.cadastrar(resultado.dados);

        console.log("[CADASTRO 4] Model concluiu o cadastro");

        return res.status(201).json({
            mensagem: "Empresa e administrador cadastrados com sucesso."
        });
    } catch (erro) {
        console.error("[CADASTRO ERRO]", erro);

        if (erro.code === "ER_DUP_ENTRY") {
            // Usa o ConflictError para erro de duplicidade
            return next(new ConflictError("Este e-mail já está cadastrado. Utilize outro e-mail."));
        }

        // Passa qualquer outro erro genérico (ex: falha no banco) para o middleware tratar como 500
        return next(erro); 
    }
}

function listar(req, res, next) { // <-- Adicionado o parâmetro 'next'
    empresaModel.listar()
        .then(function (resultado) {
            return res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.error("Erro ao listar empresas:", erro.code || "ERRO_INTERNO");
            // Repassa o erro de banco de dados para o middleware
            next(erro);
        });
}

function buscarPorId(req, res, next) { // <-- Adicionado o parâmetro 'next'
    var idEmpresa = Number(req.params.id);

    if (isNaN(idEmpresa)) {
        // ID inválido é um erro de requisição mal formatada (Bad Request)
        return next(new BadRequestError("ID da empresa inválido."));
    }

    empresaModel.buscarPorId(idEmpresa)
        .then(function (resultado) {
            if (resultado.length === 0) {
                // Empresa não encontrada
                return next(new NotFoundError("Empresa não encontrada."));
            }

            return res.status(200).json(resultado[0]);
        })
        .catch(function (erro) {
            console.error("Erro ao buscar empresa:", erro.code || "ERRO_INTERNO");
            // Repassa o erro de banco de dados para o middleware
            next(erro);
        });
}

module.exports = {
    cadastrar,
    listar,
    buscarPorId
};