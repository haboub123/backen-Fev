const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema({
    taux: Number,// Exemple : 20% de réduction
    dateDebut: Date,
    dateFin: Date,
    
    abonements:[{ type: mongoose.Schema.Types.ObjectId, ref: "Abonnement", required: false }]


}, 
{ timestamps: true });

module.exports = mongoose.model("Promotion", promotionSchema);
