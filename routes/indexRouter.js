var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.status(200).json({ title: "Express" }); // Correction : Utilise un statut numérique (200) et un objet JSON
});

module.exports = router;