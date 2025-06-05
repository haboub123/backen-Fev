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
    phone: { type: String }, // Nouveau champ pour le numéro de téléphone
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
    resetToken: { type: String },
    resetTokenExpiration: { type: Date },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    const user = this;
    
    // Vérifier si le mot de passe doit être hashé
    // (évite le double hash pour les mots de passe déjà traités)
    if (user.isModified("password") && !user._skipPasswordHash) {
      const salt = await bcrypt.genSalt();
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
  console.log("Tentative de login pour email:", email);
  const user = await this.findOne({ email });
  if (!user) {
    console.log("Utilisateur non trouvé pour email:", email);
    throw new Error("Email ou mot de passe invalide.");
  }

  console.log("Mot de passe stocké:", user.password);
  console.log("Mot de passe fourni:", password);
  const isMatch = await bcrypt.compare(password, user.password);
  console.log("Comparaison réussie:", isMatch);
  if (!isMatch) {
    console.log("Mot de passe invalide pour email:", email);
    throw new Error("Email ou mot de passe invalide.");
  }

  return user;
};

const User = mongoose.model("User", userSchema);
module.exports = User;