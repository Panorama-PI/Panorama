var filmesModel = require("../models/filmesModel");
var tokenModel = require("../models/tokenModel");

// Cadastra um novo usuário.
// Valida os campos, confere o token (e o e-mail do convite) e descobre
// a empresa a partir dele antes de encaminhar os dados para o model.
// function cadastrar(req, res) {
//     var nome = req.body.nomeServer;
//     var email = req.body.emailServer;
//     var senha = req.body.senhaServer;
//     var perfil_id = req.body.cargoServer === 'Produtor' ? 1 : 2;
//     var token = req.body.tokenServer;

//     // Verifica se todos os campos necessários foram preenchidos.
//     if (nome == undefined) {
//         res.status(400).send("Seu nome está undefined!");
//     } else if (email == undefined) {
//         res.status(400).send("Seu email está undefined!");
//     } else if (senha == undefined) {
//         res.status(400).send("Sua senha está undefined!");
//     } else if (token == undefined) {
//         res.status(400).send("Seu token está undefined!");
//     } else if (!/^[A-Za-z0-9_-]{4,64}$/.test(token)) {
//         // Evita que texto estranho chegue na query do token.
//         res.status(400).send("Token em formato inválido!");
//     } else {

//         // Busca o token válido e descobre a empresa vinculada a ele.
//         tokenModel.autenticar(token)
//             .then(function (resultadoToken) {

//                 if (resultadoToken.length == 0) {
//                     return res.status(401).send("Token inválido ou expirado!");
//                 }

//                 var id_empresa = resultadoToken[0].id_empresa;
//                                 // Cadastra o usuário vinculado à empresa do token.
//                 return usuarioModel.cadastrar(nome, email, senha, perfil_id, id_empresa)
//                     .then(function (resultado) {
//                         // Invalida o token para ele não ser usado de novo.
//                         return tokenModel.invalidarToken(token)
//                             .then(function () {
//                                 res.json(resultado);
//                             });
//                     });
//             })
//             .catch(function (erro) {
//                 console.log(erro);
//                 console.log(
//                     "\nHouve um erro ao realizar o cadastro! Erro: ",
//                     erro.sqlMessage
//                 );
//                 if (erro.code === "ER_DUP_ENTRY") {
//                     return res.status(409).send("Este e-mail já está cadastrado!");
//                 }
//                 res.status(500).json(erro.sqlMessage);
//             });
//     }
// }


// Realiza a autenticação do usuário.
// Verifica os dados de login e retorna as informações do usuário
// quando o email e a senha são válidos.
function pesquisar(req, res) {
    var filme = req.body.filmeServer;
    // var senha = req.body.senhaServer;

    // Verifica se email e senha foram informados.
    if (filme == undefined) {
        res.status(400).send("Seu filme está undefined!");
    } else {

        // Envia os dados de login para o model realizar a autenticação.
        usuarioModel.autenticar(filme)
            .then(
                function (resultadoPesquisar) {
                    console.log(`\nResultados encontrados: ${resultadoPesquisar.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoPesquisar)}`); // transforma JSON em String

                    // Verifica se foi encontrado exatamente um usuário.
                    if (resultadoAutenticar.length == 1) {
                        console.log(resultadoPesquisar);

                        usuarioModel.buscarFilmes()
                            .then((resultadoPesquisar) => {

                                // Retorna os dados do usuário quando ele está vinculado
                                // a uma empresa que possui usuários cadastrados.
                                if (resultadoFilmes.length > 0) {
                                    res.json({
                                        titulo: resultadoAutenticar[0].titulo,
                                        atorPrincipal: resultadoAutenticar[0].atorPrincipal,
                                        genero: resultadoAutenticar[0].genero,
                                        pais: resultadoAutenticar[0].pais,
                                        lucro: resultadoAutenticar[0].lucro
                                    });
                                } else {
                                    res.status(204).json({ filmes: [] });
                                }
                            })

                    // Informa quando nenhum usuário foi encontrado com os dados informados.
                    } else if (resultadoAutenticar.length == 0) {
                        res.status(403).send("Filme inválido");

                    // Informa quando existem vários usuários com os mesmos dados de login.
                    } else {
                        res.status(403).send("Filme duplicado");
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


module.exports = {
    pesquisar
}