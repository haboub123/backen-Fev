const express = require("express");
const router = express.Router();
const ReservationController = require("../controllers/ReservationController");
const { requireAuthUser } = require("../middlewares/authMiddleware");

// Routes publiques
router.post("/addReservation", ReservationController.addReservation);

// Routes protégées nécessitant une authentification
router.get("/getUserReservations", requireAuthUser, ReservationController.getUserReservations);
router.delete("/deleteReservationById/:id", requireAuthUser, ReservationController.deleteReservationById);
router.put('/affect', requireAuthUser, ReservationController.affect);

module.exports = router;