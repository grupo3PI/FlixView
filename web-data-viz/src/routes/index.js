var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
    res.redirect("/html/home.html");

});

module.exports = router;