const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
        },
        password: {
            type: String,
            required: true,
            minLength: 8,
          
        },
        role: {
            type: String,
            enum: ["admin", "client", "coach"],
        },
        user_image: { type: String, require: false, default: "client.png" },
        age: { type: Number },
        count: { type: Number, default: 0 },

        abonnement: {   type: mongoose.Schema.Types.ObjectId,ref: "Abonnement" },
       programmes: [{ type: mongoose.Schema.Types.ObjectId,ref: "Programme" }],
      notifications:[{   type: mongoose.Schema.Types.ObjectId,ref: "Notification" }],
        factures: [{ type: mongoose.Schema.Types.ObjectId,ref: "Facture" }],
        avis: [{ type: mongoose.Schema.Types.ObjectId,ref: "Avis" }],
        reservations: [{ type: mongoose.Schema.Types.ObjectId,ref: "Reservation" }],
        seances: [{ type: mongoose.Schema.Types.ObjectId,ref: "Seance" }]


           
          
          
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    try {
        const salt = await bcrypt.genSalt();
        const user = this;
        user.password = await bcrypt.hash(user.password, salt);
        //user.etat = false ;
        user.count = user.count + 1;
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.post("save", async function (req, res, next) {
    console.log("new user was created & saved successfully");
    next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;