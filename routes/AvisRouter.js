const express = require("express");
const router = express.Router();
const avisController = require("../controllers/avisController");
const { requireAuthUser } = require("../middlewares/authMiddleware");

router.post("/addAvis", requireAuthUser, avisController.addAvis);
router.get("/getAllAvis", requireAuthUser, avisController.getAllAvis);
router.get("/getAvisById/:id", avisController.getAvisById);
router.delete("/deleteAvisById/:id", requireAuthUser, avisController.deleteAvisById);
router.put("/toggleShare/:id", requireAuthUser, avisController.toggleShare);
router.get("/getSharedAvis", avisController.getSharedAvis);
router.post("/affect", requireAuthUser, avisController.affect);
router.get("/getAvisBySeance/:seanceId", requireAuthUser, avisController.getAvisBySeance);

module.exports = router;