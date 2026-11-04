var express = require("express");
var router = express.Router();

var tituloController = require("../controllers/catalogoController");

router.get("/", function (req, res) {
    tituloController.listar(req, res);
});

router.get("/generos", function (req, res) {
    tituloController.listarGeneros(req, res);
});

router.get("/anos", function (req, res) {
    tituloController.listarAnos(req, res);
});

module.exports = router;
