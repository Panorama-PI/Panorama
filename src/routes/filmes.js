var express = require("express");

var router = express.Router();

var filmesController = require("../controllers/filmesController");

router.post("/pesquisar", function (req, res) {
    filmesController.pesquisar(req, res);
});

module.exports = router;