const express = require("express");
const router = express.Router();
const avisController = require("../controllers/avisController");

router.post("/addAvis", avisController.addAvis);
router.get("/getAllAvis", avisController.getAllAvis);
router.get("/getAvisById/:id", avisController.getAvisById);
router.delete("/deleteAvisById/:id", avisController.deleteAvisById);
router.put("/updateAvis/:id", avisController.updateAvis);
router.post("/affect", avisController.affect); // Décommenté cette ligne
router.get("/getAvisBySeance/:seanceId", avisController.getAvisBySeance);
// router.get("/getAvisByCoach/:coachId", avisController.getAvisByCoach);

module.exports = router;