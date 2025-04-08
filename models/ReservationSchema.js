const mongoose = require("mongoose");

const ReservationSchema = new mongoose.Schema(
    {
        nomSeance: { type: String, required: true },
        date: { type: Date, required: true },
        heure: { type: String, required: true },
        
         client: {   type: mongoose.Schema.Types.ObjectId,ref: "User" },
         seance: {   type: mongoose.Schema.Types.ObjectId,ref: "Seance" },
          
    },
    { timestamps: true }
);

const Reservation = mongoose.model("Reservation", ReservationSchema);
module.exports = Reservation;
