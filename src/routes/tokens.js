var express = require('express');

var router = express.Router();

var tokenController = require("../controllers/tokenController");

router.get("/:token", function(req,res){
    tokenController.verificaTokenExiste(req,res);
});

router.post("/", function(req,res){
    tokenController.salvarToken(req,res);
})

module.exports = router;