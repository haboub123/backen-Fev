const mongoose = require("mongoose");

const AbonnementSchema = new mongoose.Schema(
  {
    type: String,
    prix: Number,
    duree: Number,
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    clients: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    dateDebut: {
      type: Date
    },
    dateFin: {
      type: Date
    },
    promotion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Promotion",
      required: false
    }
  },
  { timestamps: true }
);

const Abonnement = mongoose.model("Abonnement", AbonnementSchema);
module.exports = Abonnement;