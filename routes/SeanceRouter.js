const express = require("express");
const router = express.Router();
const SeanceController = require("../controllers/SeanceController");

router.post("/addseance", SeanceController.addseance);
router.get("/getAllSeances", SeanceController.getAllSeances);
router.get('/getSeanceById/:id',SeanceController.getSeanceById);
router.put('/updateSeance/:id',SeanceController.updateSeance);
router.delete('/deleteSeanceById/:id',SeanceController.deleteSeanceById);
router.put('/affect',SeanceController.affect);
router.get('/getSeancesByActivite/:activiteId', SeanceController.getSeancesByActivite);




module.exports = router;