const userModel = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto"); // Ajout pour générer un token

const maxTime = 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "net secret pfe", { expiresIn: maxTime });
};

module.exports.addUserClient = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const roleClient = "client";

    const user = await userModel.create({
      username,
      email,
      password,
      role: roleClient,
    });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.addUserClientWithImg = async (req, res) => {
  try {
    console.log("Raw Body:", req.body);
    console.log("File Details:", req.file);

    const { username, email, password } = req.body;
    const roleClient = "client";
    const { filename } = req.file || {};

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Champs manquants" });
    }

    const user = await userModel.create({
      username,
      email,
      password,
      role: roleClient,
      user_image: filename,
    });

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports.addUserAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const roleAdmin = "admin";

    const user = await userModel.create({
      username,
      email,
      password,
      role: roleAdmin,
    });

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.addUserCoach = async (req, res) => {
  try {
    const { username, email, password, specialite, age } = req.body;
    const roleCoach = "coach";

    const user = await userModel.create({
      username,
      email,
      password,
      role: roleCoach,
      specialite,
      age,
    });

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getAllUsers = async (req, res) => {
  try {
    const userListe = await userModel
      .find()
      .populate("abonnements")
      .populate("notifications")
      .populate("factures")
      .populate("avis")
      .populate("reservations")
      .populate("seances");

    res.status(200).json({ userListe });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getUsersById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel
      .findById(id)
      .populate({
        path: "abonnements.abonnement",
        populate: [{ path: "promotion" }],
      })
      .populate("notifications")
      .populate("factures")
      .populate("reservations")
      .populate("seances");

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const checkIfUserExists = await userModel.findById(id);
    if (!checkIfUserExists) {
      throw new Error("User not found");
    }

    await userModel.findByIdAndDelete(id);
    res.status(200).json("deleted");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.updateuserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, username, specialite, age } = req.body;

    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const updateFields = { email, username };

    if (user.role === "coach" && specialite) {
      updateFields.specialite = specialite;
    }
    if (user.role === "coach" && age) {
      updateFields.age = age;
    }

    await userModel.findByIdAndUpdate(id, { $set: updateFields });

    const updated = await userModel.findById(id);
    res.status(200).json({ updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.searchUserByUsername = async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) {
      throw new Error("Veuillez fournir un nom pour la recherche.");
    }

    const userListe = await userModel.find({
      username: { $regex: username, $options: "i" },
    });

    const count = userListe.length;
    res.status(200).json({ userListe, count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt_token_9antra", token, { httpOnly: false, maxAge: maxTime * 1000 });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Dans votre contrôleur backend (userController.js)
module.exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Vérifie si l'email existe
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Aucun utilisateur trouvé avec cet email." });
    }

    // Génère un token de réinitialisation
    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000; // Token valide pendant 1 heure
    await user.save();

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // CORRECTION: Pointer vers le frontend React (port 3000) au lieu du backend (port 5000)
    const localIp = "192.168.56.198"; // Ton adresse IP (sans espace au début)
    const resetLink = `http://${localIp}:3000/reset-password/${token}`; // Port 3000 pour React

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Réinitialisation de votre mot de passe",
      text: `Cliquez sur ce lien pour réinitialiser votre mot de passe : ${resetLink}. Ce lien expire dans 1 heure.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Un lien de réinitialisation a été envoyé à votre email." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Cherche l'utilisateur avec le token
    const user = await userModel.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() }, // Vérifie que le token n'a pas expiré
    });

    if (!user) {
      return res.status(400).json({ message: "Token invalide ou expiré." });
    }

    // Met à jour le mot de passe
    user.password = newPassword; // Le hachage sera géré par le middleware pre("save")
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    res.status(200).json({ message: "Mot de passe réinitialisé avec succès." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.logout = async (req, res) => {
  try {
    res.cookie("jwt_token_9antra", "", { httpOnly: false, maxAge: 1 });
    res.status(200).json("logged");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getAllCoachs = async (req, res) => {
  try {
    const coachs = await userModel.find({ role: "coach" });
    res.status(200).json({ coachs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getUserAbonnements = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userModel.findById(id).populate({
      path: "abonnements.abonnement",
      populate: {
        path: "promotion",
        select: "type description taux",
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const abonnements = user.abonnements.map((item) => ({
      abonnementId: item.abonnement._id,
      type: item.abonnement.type,
      prix: item.abonnement.prix,
      duree: item.abonnement.duree,
      promotion: item.abonnement.promotion || null,
      dateDebut: item.dateDebut,
      dateFin: item.dateFin,
    }));

    res.status(200).json({ abonnements });
  } catch (error) {
    console.error("Erreur lors de la récupération des abonnements:", error);
    res.status(500).json({
      message: error.message || "Erreur lors de la récupération des abonnements",
    });
  }
};

module.exports.addUserCoachWithImg = async (req, res) => {
  try {
    const { username, email, password, specialite, age } = req.body;
    const roleCoach = "coach";
    const { filename } = req.file || {};

    if (!username || !email || !password || !specialite || !age) {
      return res.status(400).json({ message: "Champs manquants" });
    }

    const user = await userModel.create({
      username,
      email,
      password,
      role: roleCoach,
      specialite,
      age,
      user_image: filename,
    });

    res.status(200).json({ user });
  } catch (error) {
    console.error("Erreur ajout coach avec image :", error);
    res.status(500).json({ message: error.message });
  }
};