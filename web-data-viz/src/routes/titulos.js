var express = require("express");
var router = express.Router();
var tituloController = require("../controllers/tituloController");

router.post("/sincronizar", function (req, res) {
    tituloController.sincronizar(req, res);
});

module.exports = router;
