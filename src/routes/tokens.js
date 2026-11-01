var express = require('express');
var router = express.Router();

var tokenController = require("../controllers/tokenController");

router.get("/:token", tokenController.verificaTokenExiste);

router.post("/", tokenController.salvarToken);

router.get("/autenticar/:token", tokenController.autenticar);

router.put("/", tokenController.atualizarToken);

module.exports = router;