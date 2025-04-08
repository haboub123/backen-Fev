const mongoose = require("mongoose");

const InscrireSchema = new mongoose.Schema(
    {
 // idProgramme: String,
 // idMembre: String,
  dateInscrit:Date,
  // relation
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  programme: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Programme",
    required: true,
  },
},
);

const Inscrire  = mongoose.model("Inscrire", InscrireSchema);
module.exports =Inscrire ;
