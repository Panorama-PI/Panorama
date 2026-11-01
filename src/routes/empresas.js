var express = require("express");
var router = express.Router();

var empresaController = require("../controllers/empresaController");

router.post("/cadastrar", empresaController.cadastrar);

// Rotas de cadastro e consulta de empresas.
// Estão mantidas comentadas porque serão utilizadas posteriormente.
// (Já deixei o código comentado no padrão correto para quando você for usar)

// Cadastra uma nova empresa.
// router.post("/cadastrar", empresaController.cadastrar);

// Busca uma empresa pelo CNPJ.
// router.get("/buscar", empresaController.buscarPorCnpj);

// Lista as empresas cadastradas.
// A requisição é encaminhada para a função listar do controller.
router.get("/listar", empresaController.listar);

// Busca uma empresa pelo ID.
router.get("/buscar/:id", empresaController.buscarPorId);

module.exports = router;