var express = require("express");
var router = express.Router();

var publicacaoController = require("../controllers/publicacaoController");

router.get("/empresa/:idEmpresa", publicacaoController.buscarPublicacoes);

router.get("/roteiristas", publicacaoController.buscarRoteiristas);

router.get("/roteiristas/:idEmpresa", publicacaoController.buscarRoteiristas);

router.get("/:id/anotacoes", publicacaoController.buscarPublicacoesAnotacoes);

module.exports = router;