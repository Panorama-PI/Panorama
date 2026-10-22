var usuarioModel = require("../models/usuarioModel");
var tokenModel = require("../models/tokenModel");

// Cadastra um novo usuário.
// Valida os campos, confere o token (e o e-mail do convite) e descobre
// a empresa a partir dele antes de encaminhar os dados para o model.
function cadastrar(req, res) {
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var perfil_id = req.body.cargoServer === 'Produtor' ? 1 : 2;
    var token = req.body.tokenServer;

    // Verifica se todos os campos necessários foram preenchidos.
    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else if (token == undefined) {
        res.status(400).send("Seu token está undefined!");
    } else if (!/^[A-Za-z0-9_-]{4,64}$/.test(token)) {
        // Evita que texto estranho chegue na query do token.
        res.status(400).send("Token em formato inválido!");
    } else {

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
                console.log(erro);
                console.log(
                    "\nHouve um erro ao realizar o cadastro! Erro: ",
                    erro.sqlMessage
                );
                if (erro.code === "ER_DUP_ENTRY") {
                    return res.status(409).send("Este e-mail já está cadastrado!");
                }
                res.status(500).json(erro.sqlMessage);
            });
    }
}


// Realiza a autenticação do usuário.
// Verifica os dados de login e retorna as informações do usuário
// quando o email e a senha são válidos.
function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    // Verifica se email e senha foram informados.
    if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {

        // Envia os dados de login para o model realizar a autenticação.
        usuarioModel.autenticar(email, senha)
            .then(
                function (resultadoAutenticar) {
                    console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`); // transforma JSON em String

                    // Verifica se foi encontrado exatamente um usuário.
                    if (resultadoAutenticar.length == 1) {
                        console.log(resultadoAutenticar);

                        usuarioModel.buscarUsuariosPorEmpresa(resultadoAutenticar[0].empresaId)
                            .then((resultadoUsuarios) => {

                                // Retorna os dados do usuário quando ele está vinculado
                                // a uma empresa que possui usuários cadastrados.
                                if (resultadoUsuarios.length > 0) {
                                    res.json({
                                        id: resultadoAutenticar[0].id,
                                        email: resultadoAutenticar[0].email,
                                        nome: resultadoAutenticar[0].nome,
                                        perfil_id: resultadoAutenticar[0].perfil_id
                                    });
                                } else {
                                    res.status(204).json({ usuarios: [] });
                                }
                            })

                    // Informa quando nenhum usuário foi encontrado com os dados informados.
                    } else if (resultadoAutenticar.length == 0) {
                        res.status(403).send("Email e/ou senha inválido(s)");

                    // Informa quando existem vários usuários com os mesmos dados de login.
                    } else {
                        res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }

}


// Busca os usuários vinculados a uma determinada empresa.
// O ID recebido na URL é enviado para o model realizar a consulta.
function buscarUsuariosPorEmpresa(req, res) {
    var idUsuario = req.params.idUsuario;

    usuarioModel.buscarUsuariosPorEmpresa(idUsuario).then((resultado) => {

        // Retorna os usuários encontrados ou informa que não existem resultados.
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).json([]);
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar os Usuarios: ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}


module.exports = {
    cadastrar,
    autenticar,
    buscarUsuariosPorEmpresa
}