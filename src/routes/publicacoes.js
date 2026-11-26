var express = require("express");
var router = express.Router();

var publicacaoController = require("../controllers/publicacaoController");

router.get("/:idProdutor/notificacao", publicacaoController.buscarNotificacaoProdutor);
router.put("/:idProdutor/notificacao", publicacaoController.atualizarNotificacaoProdutor);

router.get("/empresa/:idEmpresa", publicacaoController.buscarPublicacoes);

router.get("/roteiristas", publicacaoController.buscarRoteiristas);

router.get("/roteiristas/:idEmpresa", publicacaoController.buscarRoteiristas);

router.get("/:id/anotacoes", publicacaoController.buscarPublicacoesAnotacoes);

router.put("/:id/avaliacao", publicacaoController.salvarAvaliacao);

module.exports = router;
