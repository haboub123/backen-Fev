const express = require("express");
const router = express.Router();
const inscrireController = require("../controllers/InscrireController");

router.post("/addInscription/", inscrireController.addInscription);
router.get("/getAllInscriptions/", inscrireController.getAllInscriptions);
router.get("/getInscriptionById/:id",inscrireController.getInscriptionById );
router.delete("/deleteInscriptionById/:id",inscrireController.deleteInscriptionById);
router.put("/updateInscription/:id", inscrireController.updateInscription);





module.exports = router;