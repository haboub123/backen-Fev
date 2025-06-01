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
    specialite: {
      type: String,
      default: "Not specified",
    },
    user_image: { type: String, required: false, default: "client.png" },
    age: { type: Number },
    count: { type: Number, default: 0 },
    abonnements: [
      {
        abonnement: { type: mongoose.Schema.Types.ObjectId, ref: "Abonnement" },
        dateDebut: Date,
        dateFin: Date,
      },
    ],
    notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notification" }],
    factures: [{ type: mongoose.Schema.Types.ObjectId, ref: "Facture" }],
    avis: [{ type: mongoose.Schema.Types.ObjectId, ref: "Avis" }],
    reservations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reservation" }],
    seances: [{ type: mongoose.Schema.Types.ObjectId, ref: "Seance" }],
    etat: Boolean,
    ban: Boolean,
    // Ajout des champs pour la réinitialisation
    resetToken: { type: String },
    resetTokenExpiration: { type: Date },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt();
    const user = this;
    // Hache le mot de passe uniquement s'il a été modifié
    if (user.isModified("password")) {
      user.password = await bcrypt.hash(user.password, salt);
    }
    user.etat = false;
    user.ban = true;
    user.count = user.count + 1;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.post("save", function (doc) {
  console.log("new user was created & saved successfully");
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    } else {
      throw new Error("password invalid");
    }
  } else {
    throw new Error("email not found");
  }
};

const User = mongoose.model("User", userSchema);
module.exports = User;