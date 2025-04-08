const express = require("express");
const router = express.Router();
const Reservationcontroller = require("../controllers/ReservationController");

router.post("/addReservation", Reservationcontroller.addReservation);
router.get("/getAllReservations", Reservationcontroller.getAllReservations);
router.get("/getReservationById/:id", Reservationcontroller.deleteReservationById);
router.delete("/deleteReservationById/:id",Reservationcontroller.deleteReservationById);
router.put("/updateReservation/:id", Reservationcontroller.updateReservation);
router.put('/affect',Reservationcontroller.affect);
module.exports = router;




