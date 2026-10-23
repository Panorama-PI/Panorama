
var express = require("express");
var router = express.Router();

var relatorioController = require("../controllers/relatorioController");

router.post("/", function (req, res) {
    relatorioController.cadastrar(req, res);
});

router.get("/:usuarioId", function (req, res) {
    relatorioController.listar(req, res);
});

router.get("/:usuarioId/:id", function (req, res) {
    relatorioController.buscarPorId(req, res);
});

router.put("/:id", function (req, res) {
    relatorioController.atualizar(req, res);
});

router.delete("/:usuarioId/:id", function (req, res) {
    relatorioController.excluir(req, res);
});

module.exports = router;
