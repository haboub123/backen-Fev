const mongoose = require("mongoose");

const FactureSchema = new mongoose.Schema(
    {
        
        montant: Number,
        date:Date,
        methode:String,
        statut:String,

        client: {   type: mongoose.Schema.Types.ObjectId,ref: "User" },
    },
    { timestamps: true }
);

const Facture = mongoose.model("Facture", FactureSchema);
module.exports = Facture;


