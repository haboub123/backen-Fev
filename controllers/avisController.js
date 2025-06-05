const avisModel = require("../models/avisSchema");
const usermodel = require("../models/userSchema");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// Ajouter un avis
module.exports.addAvis = async (req, res) => {
  try {
    const { note, commentaire, date } = req.body;
    const user = req.session.user;
    if (!user || user.role !== "client") {
      return res.status(403).json({ message: "Accès refusé : réservé aux clients" });
    }
    const avis = await avisModel.create({ note, commentaire, date, client: user._id });
    res.status(200).json({ avis });
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'avis :", error);
    res.status(500).json({ message: "Erreur lors de l'ajout de l'avis. Veuillez vous reconnecter et réessayer." });
  }
};

// Récupérer tous les avis
module.exports.getAllAvis = async (req, res) => {
  try {
    const user = req.session.user;
    let avisListe = [];

    if (!user) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    if (user.role === "admin") {
      avisListe = await avisModel
        .find()
        .populate("client", "username")
        .populate({
          path: "seance",
          populate: [
            { path: "coachs", select: "username" },
            { path: "activite", select: "nom" },
          ],
          select: "titre",
        });
    } else if (user.role === "coach") {
      const coachSeances = await mongoose.model("Seance").find({ coachs: user._id });
      const seanceIds = coachSeances.map((seance) => seance._id);
      avisListe = await avisModel
        .find({ seance: { $in: seanceIds } })
        .populate("client", "username")
        .populate({
          path: "seance",
          populate: [
            { path: "coachs", select: "username" },
            { path: "activite", select: "nom" },
          ],
          select: "titre",
        });
    } else if (user.role === "client") {
      avisListe = await avisModel
        .find()
        .populate("client", "username")
        .populate({
          path: "seance",
          populate: [
            { path: "coachs", select: "username" },
            { path: "activite", select: "nom" },
          ],
          select: "titre",
        });
    }

    // Filtrer les avis pour ne garder que ceux avec un client et une séance valides
    avisListe = avisListe.filter((avis) => avis.client && avis.seance);

    console.log("Avis avec population :", avisListe);
    res.status(200).json({ avisListe });
  } catch (error) {
    console.error("Erreur lors de la récupération des avis :", error);
    res.status(500).json({ message: error.message });
  }
};

// Récupérer un avis par ID
module.exports.getAvisById = async (req, res) => {
  try {
    const { id } = req.params;
    const avis = await avisModel.findById(id);
    if (!avis) {
      throw new Error("Avis introuvable");
    }
    res.status(200).json({ avis });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer un avis
module.exports.deleteAvisById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.session.user;
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Accès refusé : réservé aux administrateurs" });
    }
    const deletedAvis = await avisModel.findByIdAndDelete(id);
    if (!deletedAvis) {
      throw new Error("Avis introuvable");
    }
    res.status(200).json({ message: "Avis supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Basculer l'état de partage d'un avis
module.exports.toggleShare = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.session.user;
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Accès refusé : réservé aux administrateurs" });
    }

    const avis = await avisModel
      .findById(id)
      .populate("client", "username")
      .populate({
        path: "seance",
        populate: [
          { path: "coachs", select: "username" },
          { path: "activite", select: "nom" },
        ],
        select: "titre",
      });

    if (!avis) {
      return res.status(404).json({ message: "Avis introuvable" });
    }

    // Vérifier que l'avis a un client et une séance valides avant de modifier isShared
    if (!avis.client || !avis.seance) {
      return res.status(400).json({ message: "Cet avis ne peut pas être partagé car il manque des informations (client ou séance)." });
    }

    avis.isShared = !avis.isShared;
    await avis.save();

    res.status(200).json({ message: "État de partage mis à jour", avis });
  } catch (error) {
    console.error("Erreur lors du changement d'état de partage :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Récupérer les avis partagés
module.exports.getSharedAvis = async (req, res) => {
  try {
    console.log("Début de getSharedAvis");
    const avisInitial = await avisModel.find({ isShared: true }).sort({ note: -1 });
    console.log("Avis initiaux trouvés (avant populate) :", avisInitial);

    const avisListe = await avisModel
      .find({ isShared: true })
      .sort({ note: -1 })
      .populate("client", "username")
      .populate({
        path: "seance",
        populate: [
          { path: "coachs", select: "username" },
          { path: "activite", select: "nom" },
        ],
        select: "titre",
      });

    console.log("Avis après populate :", avisListe);

    // Filtrer les avis pour ne garder que ceux avec un client valide (seance peut être null)
    const filteredAvis = avisListe.filter((avis) => {
      console.log("Filtrage de l'avis :", avis._id, "Client :", avis.client);
      return avis.client;
    });

    console.log("Avis partagés récupérés (après filtrage) :", filteredAvis);
    res.status(200).json({ avisListe: filteredAvis });
  } catch (error) {
    console.error("Erreur lors de la récupération des avis partagés :", error);
    res.status(500).json({ message: error.message });
  }
};

// Affecter un avis à un client et une séance
module.exports.affect = async (req, res) => {
  try {
    const { userId, avisId, seanceId } = req.body;
    const user = req.session.user;
    if (!user || user.role !== "client") {
      return res.status(403).json({ message: "Accès refusé : réservé aux clients" });
    }

    const avisById = await avisModel.findById(avisId);
    if (!avisById) {
      throw new Error("Avis introuvable");
    }

    const checkIfUserExists = await usermodel.findById(userId);
    if (!checkIfUserExists || checkIfUserExists.role !== "client") {
      throw new Error("Utilisateur non trouvé ou n'est pas un client");
    }

    const checkIfSeanceExists = await mongoose.model("Seance").findById(seanceId);
    if (!checkIfSeanceExists) {
      throw new Error("Séance introuvable");
    }

    const existingAvis = await avisModel.findOne({ client: userId, seance: seanceId });
    if (existingAvis) {
      throw new Error("Un avis existe déjà pour cette séance");
    }

    await avisModel.findByIdAndUpdate(avisId, {
      $set: { client: userId, seance: seanceId },
    });

    await usermodel.findByIdAndUpdate(userId, {
      $push: { avis: avisId },
    });

    res.status(200).json({ message: "Avis affecté avec succès" });
  } catch (error) {
    console.error("Erreur lors de l'affectation de l'avis :", error);
    res.status(500).json({ message: error.message });
  }
};

// Nouvelle fonction : Récupérer les avis par séance
module.exports.getAvisBySeance = async (req, res) => {
  try {
    const { seanceId } = req.params;
    const user = req.session.user;

    if (!user) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    if (user.role !== "coach" && user.role !== "admin") {
      return res.status(403).json({ message: "Accès refusé : réservé aux coachs et administrateurs" });
    }

    if (user.role === "coach") {
      const seance = await mongoose.model("Seance").findById(seanceId);
      if (!seance || !seance.coachs.includes(user._id)) {
        return res.status(403).json({ message: "Accès refusé : vous n'êtes pas associé à cette séance" });
      }
    }

    const avisListe = await avisModel
      .find({ seance: seanceId })
      .populate("client", "username")
      .sort({ createdAt: -1 });

    console.log("Avis récupérés pour la séance :", avisListe);
    res.status(200).json({ avisListe });
  } catch (error) {
    console.error("Erreur lors de la récupération des avis par séance :", error);
    res.status(500).json({ message: error.message });
  }
};