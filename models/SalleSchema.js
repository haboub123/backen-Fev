const mongoose = require("mongoose");

const SalleSchema = new mongoose.Schema(
    {
        nom: String,
        capacite: Number,
        description:String,
        
       seances : [{ type: mongoose.Schema.Types.ObjectId,ref: "Seance" }]
    },
    { timestamps: true }
);

const Salle = mongoose.model("Salle", SalleSchema);
module.exports = Salle;
