var express = require("express");

var router = express.Router();

// Exibe a página inicial da aplicação.
router.get("/", function (req, res) {
    res.render("index");
});

module.exports = router;