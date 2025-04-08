const express = require("express");
const router = express.Router();
const promotionController = require("../controllers/PromotionController");

router.post("/addPromotion",promotionController.addPromotion);
router.get("/getAllPromotion", promotionController.getAllPromotions);
router.get("/getPromotionById/:id", promotionController.getPromotionById );
router.delete("/deletePromotionById/:id",promotionController.deletePromotionById);
router.put("/updatePromotion/:id", promotionController.updatePromotion);





module.exports = router;