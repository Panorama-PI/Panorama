var express = require("express");
var router = express.Router();

var filmesController = require("../controllers/filmesController");

router.post("/pesquisar", filmesController.pesquisar);

router.post("/top10", filmesController.top10);

module.exports = router;