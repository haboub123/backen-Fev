const mongoose = require("mongoose");

const AvisSchema = new mongoose.Schema(
    {
      note: { type: Number, min: 1, max: 5 },
        commentaire: String, // Commentaire de l'avis
        date: Date,// Date de l'avis
        
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
          },
          seance: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Seance"
          }
          
    },
    { timestamps: true }
);

const Avis = mongoose.model("Avis", AvisSchema);
module.exports = Avis;
