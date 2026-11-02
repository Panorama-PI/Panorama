var express = require("express");
var router = express.Router();

var relatorioController = require("../controllers/relatorioController");

router.post("/", relatorioController.cadastrar);

router.get("/:usuarioId", relatorioController.listar);

router.get("/:usuarioId/:id", relatorioController.buscarPorId);

router.put("/:id", relatorioController.atualizar);

router.delete("/:usuarioId/:id", relatorioController.excluir);

module.exports = router;