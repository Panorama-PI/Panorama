var express = require("express");
var router = express.Router();

var anotacaoController = require("../controllers/anotacaoController");

// proejtos

router.get("/projetos/listar/:idUsuario", function (req, res) {
    anotacaoController.listarProjetos(req, res);
});
router.post("/projetos/criar", function (req, res) {
    anotacaoController.criarProjeto(req, res);
});

// anotacoes mesmo

// lista todas as anotacoes do usuario pq a pagina filtra por projeto
router.get("/listar/:idUsuario", function (req, res) {
    anotacaoController.listarAnotacoes(req, res);
});

router.post("/criar", function (req, res) {
    anotacaoController.criarAnotacao(req, res);
});

router.put("/editar", function (req, res) {
    anotacaoController.editarAnotacao(req, res);
});

// exclui uma anotação
router.delete("/excluir", function (req, res) {
    anotacaoController.excluirAnotacao(req, res);
});

module.exports = router;