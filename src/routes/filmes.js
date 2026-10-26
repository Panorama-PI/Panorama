var express = require("express");

var router = express.Router();

var filmesController = require("../controllers/filmesController");

router.post("/pesquisar", function (req, res) {
    filmesController.pesquisar(req, res);
});

router.post("/top10", function (req, res) {
    filmesController.top10(req, res);
});


module.exports = router;