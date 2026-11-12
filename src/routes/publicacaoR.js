var express = require("express");
var router = express.Router();

var publicacaoRController = require("../controllers/publicacaoRController");

// ATENÇÃO À ORDEM: rotas fixas ("/projetos") devem vir ANTES de "/:id",
// senão o Express entende "projetos" como se fosse um id de publicação.

router.get("/", publicacaoRController.listarPublicacoes);

router.get("/projetos", publicacaoRController.listarProjetos);

router.get("/projetos/:idProjeto/anotacoes", publicacaoRController.listarAnotacoes);

router.get("/:id/anotacoes", publicacaoRController.listarAnotacoesPublicacao);

router.get("/:id", publicacaoRController.buscarPublicacao);

router.post("/", publicacaoRController.criarPublicacao);

router.put("/:id", publicacaoRController.editarPublicacao);

router.delete("/:id", publicacaoRController.excluirPublicacao);

module.exports = router;