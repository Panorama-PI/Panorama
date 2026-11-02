
var express = require("express");

var router = express.Router();

var feedbackProdutorController = require("../controllers/feedbackProdutorController");

router.get("/:idProdutor", function (req, res, next) {
    feedbackProdutorController.listarFeedbacks(req, res, next);
});

router.get("/:idProdutor/publicacoes-disponiveis", function (req, res, next) {
    feedbackProdutorController.listarPublicacoesDisponiveis(req, res, next);
});

router.get("/:idProdutor/:id", function (req, res, next) {
    feedbackProdutorController.buscarFeedback(req, res, next);
});

router.post("/:idProdutor", function (req, res, next) {
    feedbackProdutorController.cadastrarFeedback(req, res, next);
});

router.put("/:idProdutor/:id", function (req, res, next) {
    feedbackProdutorController.editarFeedback(req, res, next);
});

router.delete("/:idProdutor/:id", function (req, res, next) {
    feedbackProdutorController.excluirFeedback(req, res, next);
});

module.exports = router;
