var express = require("express");

var router = express.Router();

var usuarioController = require("../controllers/usuarioController");

// Cadastra um novo usuário.
// Os dados enviados na requisição são encaminhados para o controller,
// que realiza as validações e o cadastro.
router.post("/cadastrar", function (req, res) {
    usuarioController.cadastrar(req, res);
})

// Realiza a autenticação de um usuário.
// O controller verifica os dados informados e retorna o resultado do login.
router.post("/autenticar", function (req, res) {
    usuarioController.autenticar(req, res);
});

// Busca os usuários vinculados a uma determinada empresa.
// O ID da empresa é recebido como parâmetro na URL.
router.get("/:empresaId", function (req, res) {
    usuarioController.buscarUsuariosPorEmpresa(req, res);
});

module.exports = router;