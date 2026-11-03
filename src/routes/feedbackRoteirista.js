var express = require("express");
var router = express.Router();

var feedbackRoteiristaController = require("../controllers/feedbackRoteiristaController");

// As rotas fixas (notificacao) vêm antes da rota com :id
router.get("/roteirista/:idRoteirista/notificacao", feedbackRoteiristaController.buscarNotificacao);
router.put("/roteirista/:idRoteirista/notificacao", feedbackRoteiristaController.atualizarNotificacao);

router.get("/roteirista/:idRoteirista", feedbackRoteiristaController.listarFeedbacks);
router.get("/roteirista/:idRoteirista/:id", feedbackRoteiristaController.buscarFeedback);

module.exports = router;