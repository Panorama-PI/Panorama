var express = require("express");
var router = express.Router();

var publicacaoRController = require("../controllers/publicacaoRController");

// ATENÇÃO À ORDEM: rotas fixas ("/projetos") devem vir ANTES de "/:id",
// senão o Express entende "projetos" como se fosse um id de publicação.

router.get("/", function (req, res) {
    publicacaoRController.listarPublicacoes(req, res);
});

router.get("/projetos", function (req, res) {
    publicacaoRController.listarProjetos(req, res);
});

router.get("/projetos/:idProjeto/anotacoes", function (req, res) {
    publicacaoRController.listarAnotacoes(req, res);
});

router.get("/:id/anotacoes", function (req, res) {
    publicacaoRController.listarAnotacoesPublicacao(req, res);
});

router.get("/:id", function (req, res) {
    publicacaoRController.buscarPublicacao(req, res);
});

router.post("/", function (req, res) {
    publicacaoRController.criarPublicacao(req, res);
});

router.put("/:id", function (req, res) {
    publicacaoRController.editarPublicacao(req, res);
});

router.delete("/:id", function (req, res) {
    publicacaoRController.excluirPublicacao(req, res);
});

module.exports = router;
