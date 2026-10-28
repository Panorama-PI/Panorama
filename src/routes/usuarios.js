var express = require("express");

var router = express.Router();

var usuarioController = require("../controllers/usuarioController");


/* =========================
   CADASTRO E LOGIN
========================= */

// Cadastra um novo usuário.
// Os dados enviados na requisição são encaminhados para o controller,
// que realiza as validações e o cadastro.
router.post("/cadastrar", function (req, res) {
    usuarioController.cadastrar(req, res);
});

// Realiza a autenticação de um usuário.
// O controller verifica os dados informados e retorna o resultado do login.
router.post("/autenticar", function (req, res) {
    usuarioController.autenticar(req, res);
});


/* =========================
   GERENCIAMENTO DE FUNCIONÁRIOS
========================= */

// Lista os funcionários de uma empresa.
router.get("/listar/:idEmpresa", function (req, res) {
    usuarioController.listarPorEmpresa(req, res);
});

// Edita um funcionário. Os dados novos vêm no body.
router.put("/editar/:idUsuario", function (req, res) {
    usuarioController.editar(req, res);
});

// Exclui um funcionário da empresa.
router.delete("/excluir/:idUsuario/:idEmpresa", function (req, res) {
    usuarioController.excluir(req, res);
});


/* =========================
   CONSULTA GENÉRICA
========================= */

// Busca os usuários vinculados a uma determinada empresa.
// Fica por último porque "/:empresaId" casa com qualquer
// caminho de um segmento só e poderia "roubar" as rotas acima.
router.get("/:empresaId", function (req, res) {
    usuarioController.buscarUsuariosPorEmpresa(req, res);
});

module.exports = router;