var express = require("express");
var router = express.Router();

var anotacaoController = require("../controllers/anotacaoController");

// projetos
router.get("/projetos/listar/:idUsuario", anotacaoController.listarProjetos);

router.post("/projetos/criar", anotacaoController.criarProjeto);

router.put("/projetos/editar", anotacaoController.editarProjeto);

router.delete("/projetos/excluir", anotacaoController.excluirProjeto);


// anotacoes mesmo
// lista todas as anotacoes do usuario pq a pagina filtra por projeto
router.get("/listar/:idUsuario", anotacaoController.listarAnotacoes);

router.post("/criar", anotacaoController.criarAnotacao);

router.put("/editar", anotacaoController.editarAnotacao);

// exclui uma anotação
router.delete("/excluir", anotacaoController.excluirAnotacao);


module.exports = router;