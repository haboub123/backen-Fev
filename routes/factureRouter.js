const express = require("express");
const router = express.Router();
const factureController = require("../controllers/FactureController");

router.post("/addFacture", factureController.addFacture );
router.get("/getAllFactures", factureController.getAllFactures);
router.get("/getFactureById/:id", factureController.getFactureById );
router.delete("/deleteFactureById/:id",factureController.deleteFactureById);
router.put("/updateFacture/:id", factureController.updateFacture);
router.put('/affect',factureController.affect);





module.exports = router;