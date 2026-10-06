var usuarioModel = require("../models/usuarioModel");

// Cadastra um novo usuário.
// Recebe os dados enviados pela requisição, valida os campos obrigatórios
// e encaminha as informações para o model realizar o cadastro.
function cadastrar(req, res) {
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var cargo = req.body.cargoServer;
    var fkEmpresa = req.body.idEmpresaVincularServer;

    // Verifica se todos os campos necessários foram preenchidos.
    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else if (cargo == undefined) {
        res.status(400).send("Seu cargo está undefined!");
    } else if (fkEmpresa == undefined) {
        res.status(400).send("Sua empresa a vincular está undefined!");
    } else {

        // Envia os dados validados para o model realizar o cadastro.
        usuarioModel.cadastrar(nome, email, senha, cargo, fkEmpresa)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
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
                                         senha: resultadoAutenticar[0].senha,
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