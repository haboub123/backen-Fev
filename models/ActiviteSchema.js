const mongoose = require("mongoose");

const ActiviteSchema = new mongoose.Schema(
    {
        nom: String,
        description: String,
         image: String, // <-- nouveau champ pour le chemin de l'image

        seances:[{type:mongoose.Schema.Types.ObjectId,ref:"Seance"}]
          

    },
    { timestamps: true }
);

const Activite = mongoose.model("Activite", ActiviteSchema);
module.exports = Activite;

