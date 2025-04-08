const mongoose = require("mongoose");

const SeanceSchema = new mongoose.Schema(
    {
        titre: String,
        description: String,
        date: Date,
        heure: String,
        duree: Number,
        type: String,
       // salle: String,

    coachs: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        
    salle: {   type: mongoose.Schema.Types.ObjectId,ref: "Salle" },
    },
    { timestamps: true }
);

const Seance = mongoose.model("Seance", SeanceSchema);
module.exports = Seance;


