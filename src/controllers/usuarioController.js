var usuarioModel = require("../models/usuarioModel");
var tokenModel = require("../models/tokenModel");

// Token de convite: 4 a 64 caracteres (letras, números, _ e -).
// Evita que texto estranho chegue na query do token.
var FORMATO_TOKEN = /^[A-Za-z0-9_-]{4,64}$/;


/* =========================
   FUNÇÕES AUXILIARES
========================= */

// Converte o cargo recebido do front no perfil_id do banco.
// Retorna null quando o cargo não é reconhecido.
function perfilDoCargo(cargo) {
    if (cargo === "Produtor") {
        return 1;
    }

    if (cargo === "Roteirista") {
        return 2;
    }

    return null;
}

// Converte um valor em número inteiro positivo.
// Retorna null quando não é um id válido.
function idValido(valor) {
    var numero = Number(valor);

    if (Number.isInteger(numero) && numero > 0) {
        return numero;
    }

    return null;
}


/* =========================
   CADASTRO E LOGIN
========================= */

// Cadastra um novo usuário.
// Valida os campos, confere o token e descobre a empresa
// vinculada a ele antes de encaminhar os dados para o model.
function cadastrar(req, res) {
    var corpo = req.body || {};

    var nome = corpo.nomeServer;
    var email = corpo.emailServer;
    var senha = corpo.senhaServer;
    var perfil_id = perfilDoCargo(corpo.cargoServer);
    var token = corpo.tokenServer;

    // Verifica se todos os campos necessários foram preenchidos.
    if (nome == undefined) {
        return res.status(400).send("Seu nome está undefined!");
    }

    if (email == undefined) {
        return res.status(400).send("Seu email está undefined!");
    }

    if (senha == undefined) {
        return res.status(400).send("Sua senha está undefined!");
    }

    if (perfil_id == null) {
        return res.status(400).send("Seu cargo é inválido!");
    }

    if (token == undefined) {
        return res.status(400).send("Seu token está undefined!");
    }

    if (!FORMATO_TOKEN.test(token)) {
        return res.status(400).send("Token em formato inválido!");
    }

    // Busca o token válido e descobre a empresa vinculada a ele.
    tokenModel.autenticar(token)
        .then(function (resultadoToken) {
            if (resultadoToken.length == 0) {
                return res.status(401).send("Token inválido ou expirado!");
            }

            var id_empresa = resultadoToken[0].id_empresa;

            // Cadastra o usuário vinculado à empresa do token.
            return usuarioModel.cadastrar(nome, email, senha, perfil_id, id_empresa)
                .then(function (resultado) {
                    // Invalida o token para ele não ser usado de novo.
                    return tokenModel.invalidarToken(token)
                        .then(function () {
                            res.json(resultado);
                        });
                });
        })
        .catch(function (erro) {
            console.log("\nHouve um erro ao realizar o cadastro! Erro: ", erro.sqlMessage || erro);

            if (erro.code === "ER_DUP_ENTRY") {
                return res.status(409).send("Este e-mail já está cadastrado!");
            }

            res.status(500).json(erro.sqlMessage);
        });
}


// Realiza a autenticação do usuário.
// Retorna as informações do usuário quando email e senha são válidos.
function autenticar(req, res) {
    var corpo = req.body || {};

    var email = corpo.emailServer;
    var senha = corpo.senhaServer;

    // Verifica se email e senha foram informados.
    if (email == undefined) {
        return res.status(400).send("Seu email está undefined!");
    }

    if (senha == undefined) {
        return res.status(400).send("Sua senha está indefinida!");
    }

    usuarioModel.autenticar(email, senha)
        .then(function (resultadoAutenticar) {
            console.log("\nResultados encontrados: " + resultadoAutenticar.length);

            // Nenhum usuário com os dados informados.
            if (resultadoAutenticar.length == 0) {
                return res.status(403).send("Email e/ou senha inválido(s)");
            }

            // Vários usuários com os mesmos dados de login.
            if (resultadoAutenticar.length > 1) {
                return res.status(403).send("Mais de um usuário com o mesmo login e senha!");
            }

            var usuario = resultadoAutenticar[0];

            return usuarioModel.buscarUsuariosPorEmpresa(usuario.empresaId)
                .then(function (resultadoUsuarios) {
                    // Empresa sem usuários cadastrados.
                    if (resultadoUsuarios.length == 0) {
                        return res.status(204).end();
                    }

                    res.json({
                        id: usuario.id,
                        email: usuario.email,
                        nome: usuario.nome,
                        perfil_id: usuario.perfil_id,
                        empresaId: usuario.empresaId
                    });
                });
        })
        .catch(function (erro) {
            console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage || erro);
            res.status(500).json(erro.sqlMessage);
        });
}


/* =========================
   CONSULTA (rota antiga)
========================= */

// Busca os usuários vinculados a uma determinada empresa.
// O ID da empresa é recebido na URL (/:empresaId).
function buscarUsuariosPorEmpresa(req, res) {
    var idEmpresa = req.params.empresaId;

    usuarioModel.buscarUsuariosPorEmpresa(idEmpresa)
        .then(function (resultado) {
            if (resultado.length > 0) {
                return res.status(200).json(resultado);
            }

            res.status(204).end();
        })
        .catch(function (erro) {
            console.log("Houve um erro ao buscar os usuários: ", erro.sqlMessage || erro);
            res.status(500).json(erro.sqlMessage);
        });
}


/* =========================
   GERENCIAMENTO DE FUNCIONÁRIOS
   (tela administrativa)
========================= */

// Lista os funcionários (sem os administradores) de uma empresa.
function listarPorEmpresa(req, res) {
    var idEmpresa = idValido(req.params.idEmpresa);

    if (idEmpresa == null) {
        return res.status(400).json({ mensagem: "ID da empresa inválido." });
    }

    usuarioModel.listarPorEmpresa(idEmpresa)
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.error("Erro ao listar funcionários:", erro.code || "ERRO_INTERNO");

            res.status(500).json({
                mensagem: "Não foi possível listar os funcionários."
            });
        });
}


// Edita nome, e-mail, cargo e status de um funcionário.
// O idEmpresa vem no body e garante que o usuário é daquela empresa.
function editar(req, res) {
    var corpo = req.body || {};

    var idUsuario = idValido(req.params.idUsuario);
    var idEmpresa = idValido(corpo.idEmpresa);
    var nome = String(corpo.nome || "").trim();
    var email = String(corpo.email || "").trim();
    var perfilId = perfilDoCargo(corpo.cargo);

    if (idUsuario == null || idEmpresa == null) {
        return res.status(400).json({ mensagem: "Identificadores inválidos." });
    }

    if (nome === "" || email.indexOf("@") === -1) {
        return res.status(400).json({ mensagem: "Informe um nome e um e-mail válidos." });
    }

      if (perfilId == null) {
        return res.status(400).json({ mensagem: "Cargo inválido." });
    }


    usuarioModel.editar(idUsuario, idEmpresa, nome, email, perfilId)
        .then(function (resultado) {
            if (resultado.affectedRows === 0) {
                return res.status(404).json({ mensagem: "Funcionário não encontrado." });
            }

            res.status(200).json({ mensagem: "Funcionário atualizado com sucesso." });
        })
        .catch(function (erro) {
            console.error("Erro ao editar funcionário:", erro.code || "ERRO_INTERNO");

            if (erro.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    mensagem: "Este e-mail já está cadastrado. Utilize outro e-mail."
                });
            }

            res.status(500).json({
                mensagem: "Não foi possível atualizar o funcionário."
            });
        });
}


// Exclui um funcionário da empresa.
function excluir(req, res) {
    var idUsuario = idValido(req.params.idUsuario);
    var idEmpresa = idValido(req.params.idEmpresa);

    if (idUsuario == null || idEmpresa == null) {
        return res.status(400).json({ mensagem: "Identificadores inválidos." });
    }

    usuarioModel.excluir(idUsuario, idEmpresa)
        .then(function (resultado) {
            if (resultado.affectedRows === 0) {
                return res.status(404).json({ mensagem: "Funcionário não encontrado." });
            }

            res.status(200).json({ mensagem: "Funcionário excluído com sucesso." });
        })
        .catch(function (erro) {
            console.error("Erro ao excluir funcionário:", erro.code || "ERRO_INTERNO");

            res.status(500).json({
                mensagem: "Não foi possível excluir o funcionário."
            });
        });
}


module.exports = {
    cadastrar,
    autenticar,
    buscarUsuariosPorEmpresa,
    listarPorEmpresa,
    editar,
    excluir
};