const userModel = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const maxTime = 24 * 60 * 60;
const createToken = (id) => {
  try {
    return jwt.sign({ id }, process.env.JWT_SECRET || "net secret pfe", { expiresIn: maxTime });
  } catch (error) {
    throw new Error("Erreur lors de la création du token : " + error.message);
  }
};

// Fonction pour envoyer un email avec le mot de passe temporaire
const sendTempPasswordEmail = async (email, tempPassword) => {
  try {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
      throw new Error("Les identifiants Gmail (GMAIL_USER ou GMAIL_PASS) ne sont pas définis.");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const localIp = process.env.LOCAL_IP || "192.168.1.14";
    const resetLink = `http://${localIp}:3000/auth/reset-password`;
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Votre mot de passe temporaire - GymWolf",
      text: `Bienvenue sur GymWolf ! Votre mot de passe temporaire est : ${tempPassword}. Utilisez-le pour vous connecter, puis changez-le via ce lien : ${resetLink}. Ce lien expire dans 1 heure.`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email envoyé à ${email}.`);
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
    throw new Error("Erreur lors de l'envoi de l'email : " + error.message);
  }
};

module.exports.addUserCoach = async (req, res) => {
  try {
    const { username, email, specialite, age, phone } = req.body;
    const roleCoach = "coach";
    const tempPassword = crypto.randomBytes(8).toString("hex");

    if (!username || !email || !specialite || !age || !phone) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    // Le mot de passe sera hashé automatiquement par le middleware pre('save')
    const user = await userModel.create({
      username,
      email,
      password: tempPassword, // Mot de passe en clair, sera hashé par le middleware
      role: roleCoach,
      specialite,
      age,
      phone,
    });

    await sendTempPasswordEmail(email, tempPassword);

    res.status(200).json({ user, message: "Coach créé, mot de passe temporaire envoyé par email." });
  } catch (error) {
    console.error("Erreur lors de l'ajout du coach :", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports.addUserCoachWithImg = async (req, res) => {
  try {
    const { username, email, specialite, age, phone } = req.body;
    const roleCoach = "coach";
    const { filename } = req.file || {};
    const tempPassword = crypto.randomBytes(8).toString("hex");

    if (!username || !email || !specialite || !age || !phone) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    if (!filename) {
      return res.status(400).json({ message: "Aucune image de profil sélectionnée." });
    }

    // Le mot de passe sera hashé automatiquement par le middleware pre('save')
    const user = await userModel.create({
      username,
      email,
      password: tempPassword, // Mot de passe en clair, sera hashé par le middleware
      role: roleCoach,
      specialite,
      age,
      phone,
      user_image: filename,
    });

    await sendTempPasswordEmail(email, tempPassword);

    res.status(200).json({ user, message: "Coach créé avec image, mot de passe temporaire envoyé par email." });
  } catch (error) {
    console.error("Erreur ajout coach avec image :", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports.addUserClient = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const roleClient = "client";

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Champs manquants" });
    }

    // Le mot de passe sera hashé automatiquement par le middleware pre('save')
    const user = await userModel.create({
      username,
      email,
      password, // Mot de passe en clair, sera hashé par le middleware
      role: roleClient,
    });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.addUserClientWithImg = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const roleClient = "client";
    const { filename } = req.file || {};

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Champs manquants" });
    }

    if (!filename) {
      return res.status(400).json({ message: "Aucune image de profil sélectionnée." });
    }

    // Le mot de passe sera hashé automatiquement par le middleware pre('save')
    const user = await userModel.create({
      username,
      email,
      password, // Mot de passe en clair, sera hashé par le middleware
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

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Champs manquants" });
    }

    // Le mot de passe sera hashé automatiquement par le middleware pre('save')
    const user = await userModel.create({
      username,
      email,
      password, // Mot de passe en clair, sera hashé par le middleware
      role: roleAdmin,
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
    res.status(200).json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, username, specialite, age, phone, user_image } = req.body;
    const { filename } = req.file || {};

    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const updateFields = { email, username };
    if (user.role === "coach") {
      if (specialite) updateFields.specialite = specialite;
      if (age) updateFields.age = age;
      if (phone) updateFields.phone = phone;
    }
    if (filename) updateFields.user_image = filename;

    await userModel.findByIdAndUpdate(id, { $set: updateFields }, { new: true });

    const updated = await userModel.findById(id);
    res.status(200).json({ user: updated, message: "Utilisateur mis à jour avec succès" });
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
    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe sont requis." });
    }

    const user = await userModel.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt_token_9antra", token, { 
      httpOnly: true,
      maxAge: maxTime * 1000,
      secure: process.env.NODE_ENV === 'production'
    });
    res.status(200).json({ user, token });
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    if (error.message === "Email ou mot de passe invalide.") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Aucun utilisateur trouvé avec cet email." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000; // 1 heure
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const localIp = process.env.LOCAL_IP || "192.168.1.14";
    const resetLink = `http://${localIp}:3000/reset-password/${token}`;
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
    const user = await userModel.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Token invalide ou expiré." });
    }

    // Hashage manuel nécessaire ici car on met à jour directement
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    
    // Désactiver le middleware de hashage pour cette sauvegarde
    user._skipPasswordHash = true;
    await user.save();

    res.status(200).json({ message: "Mot de passe réinitialisé avec succès." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.logout = async (req, res) => {
  try {
    res.cookie("jwt_token_9antra", "", { httpOnly: true, maxAge: 1 });
    res.status(200).json({ message: "Déconnexion réussie" });
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
      populate: { path: "promotion", select: "type description taux" },
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
    res.status(500).json({ message: error.message || "Erreur lors de la récupération des abonnements" });
  }
};

module.exports.updateCoachProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password, phone } = req.body;
    const { filename } = req.file || {};

    const user = await userModel.findById(id);
    if (!user || user.role !== "coach") {
      return res.status(404).json({ message: "Coach non trouvé" });
    }

    const updateFields = {};
    if (email) updateFields.email = email;
    if (password) {
      // Hashage manuel car findByIdAndUpdate ne déclenche pas le middleware pre('save')
      const salt = await bcrypt.genSalt();
      updateFields.password = await bcrypt.hash(password, salt);
    }
    if (phone) updateFields.phone = phone;
    if (filename) {
      console.log("Nouvelle image téléchargée :", filename);
      updateFields.user_image = filename;
    }

    await userModel.findByIdAndUpdate(id, { $set: updateFields }, { new: true });

    const updatedUser = await userModel.findById(id);
    res.status(200).json({ user: updatedUser, message: "Profil mis à jour avec succès." });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil :", error);
    res.status(500).json({ message: error.message });
  }
};