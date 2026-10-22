var express = require("express");

var router = express.Router();

var publicacaoController = require("../controllers/publicacaoController");

router.get("/empresa/:idEmpresa", function(req,res){
    publicacaoController.buscarPublicacoes(req,res);
});

router.get("/:id/anotacoes", function(req,res){
    publicacaoController.buscarPublicacoesAnotacoes(req,res);
});


module.exports = router;