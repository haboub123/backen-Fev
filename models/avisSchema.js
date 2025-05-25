const mongoose = require("mongoose");

const AvisSchema = new mongoose.Schema(
  {
    note: { type: Number, min: 1, max: 5 },
    commentaire: String,
    date: Date,
    isShared: { type: Boolean, default: false },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    seance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seance",
    },
  },
  { timestamps: true }
);

const Avis = mongoose.model("Avis", AvisSchema);
module.exports = Avis;