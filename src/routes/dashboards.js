var express = require("express");
var router = express.Router();

var dashboardsController = require("../controllers/dashboardsController");


router.get("/produtor/geral", function (req, res, next) {
    dashboardsController.produtorGeral(req, res, next);
});

router.get("/produtor/especifica", function (req, res, next) {
    dashboardsController.produtorEspecifica(req, res, next);
});

router.get("/roteirista/especifica", function (req, res, next) {
    dashboardsController.roteiristaEspecifica(req, res, next);
});

module.exports = router;
