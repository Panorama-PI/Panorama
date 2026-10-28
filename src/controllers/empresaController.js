
var empresaModel = require("../models/empresaModel");
var validacoes = require("../../public/js/validacoes-cadastro");

async function cadastrar(req, res) {
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
        return res.status(400).json({
            mensagem: "Cadastro não realizado. Corrija os itens informados.",
            erros: resultado.erros
        });
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
            return res.status(409).json({
                mensagem: "Este e-mail já está cadastrado. Utilize outro e-mail."
            });
        }

        return res.status(500).json({
            mensagem: "Não foi possível realizar o cadastro. Tente novamente."
        });
    }
}

function listar(req, res) {
    empresaModel.listar()
        .then(function (resultado) {
            return res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.error("Erro ao listar empresas:", erro.code || "ERRO_INTERNO");

            return res.status(500).json({
                mensagem: "Não foi possível listar as empresas."
            });
        });
}

function buscarPorId(req, res) {
    var idEmpresa = Number(req.params.id);

    if (isNaN(idEmpresa)) {
        return res.status(400).json({ mensagem: "ID da empresa inválido." });
    }

    empresaModel.buscarPorId(idEmpresa)
        .then(function (resultado) {
            if (resultado.length === 0) {
                return res.status(404).json({ mensagem: "Empresa não encontrada." });
            }

            return res.status(200).json(resultado[0]);
        })
        .catch(function (erro) {
            console.error("Erro ao buscar empresa:", erro.code || "ERRO_INTERNO");

            return res.status(500).json({
                mensagem: "Não foi possível buscar a empresa."
            });
        });
}


module.exports = {
    cadastrar,
    listar,
    buscarPorId
};
