var express = require("express");

var router = express.Router();

var empresaController = require("../controllers/empresaController");

// Rotas de cadastro e consulta de empresas.
// Estão mantidas comentadas porque serão utilizadas posteriormente.

// Cadastra uma nova empresa.
// router.post("/cadastrar", function (req, res) {
//     empresaController.cadastrar(req, res);
// })

// Busca uma empresa pelo CNPJ.
// router.get("/buscar", function (req, res) {
//     empresaController.buscarPorCnpj(req, res);
// });

// Busca uma empresa pelo ID.
// router.get("/buscar/:id", function (req, res) {
//   empresaController.buscarPorId(req, res);
// });

// Lista as empresas cadastradas.
// A requisição é encaminhada para a função listar do controller.
router.get("/listar", function (req, res) {
  empresaController.listar(req, res);
});

module.exports = router;