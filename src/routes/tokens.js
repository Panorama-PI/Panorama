var express = require('express');

var router = express.Router();

var tokenController = require("../controllers/tokenController");

router.get("/:token", function(req,res){
    tokenController.verificaTokenExiste(req,res);
});

router.post("/", function(req,res){
    tokenController.salvarToken(req,res);
})

router.get("/autenticar/:token", function(req,res){
    tokenController.autenticar(req,res);
})

router.put("/", function(req,res){
    tokenController.atualizarToken(req,res);
})

module.exports = router;