const mongoose = require("mongoose");

const ProgrammeSchema = new mongoose.Schema(
    {
        nom: String,
        description: String,
        duree: Number,

        coach: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
          },
         clients:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}]
          

    },
    { timestamps: true }
);

const Programme = mongoose.model("Programme", ProgrammeSchema);
module.exports = Programme;

