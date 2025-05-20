const mongoose = require("mongoose");

const SeanceSchema = new mongoose.Schema(
  {
    titre: String,
    description: String,
    date: Date,
    heure: String,
    duree: String,
    salle: { type: mongoose.Schema.Types.ObjectId, ref: "Salle" },
    coachs: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    activite: { type: mongoose.Schema.Types.ObjectId, ref: "Activite" },
  },
  { timestamps: true }
);

const Seance = mongoose.model("Seance", SeanceSchema);
module.exports = Seance;