const avisModel = require("../models/avisSchema");
const usermodel = require("../models/userSchema");
const mongoose = require("mongoose");

// Ajouter un avis
module.exports.addAvis = async (req, res) => {
    try {
        const { note, commentaire,date } = req.body;
        const avis = await avisModel.create({ note, commentaire ,date});
        res.status(200).json({ avis });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer tous les avis
module.exports.getAllAvis = async (req, res) => {
    try {
        const avisListe = await avisModel.find();
        res.status(200).json({ avisListe });
    } catch (error) {
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
        const deletedAvis = await avisModel.findByIdAndDelete(id);
        if (!deletedAvis) {
            throw new Error("Avis introuvable");
        }
        res.status(200).json({ message: "Avis supprimé" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports.updateAvis = async (req, res) => {
    try {
        const { id } = req.params;
        const { note, commentaire, date } = req.body;

        const avisById = await avisModel.findById(id);
        if (!avisById) {
            throw new Error("Avis introuvable");
        }

        // Si aucun champ n'est fourni, renvoyer une erreur
        if (!note && !commentaire && !date) {
            throw new Error("Aucune donnée valide à mettre à jour");
        }

        const updatedData = {};
        if (note) updatedData.note = note;
        if (commentaire) updatedData.commentaire = commentaire;
        if (date) updatedData.date = date;

        const updated = await avisModel.findByIdAndUpdate(id, { $set: updatedData }, { new: true });
        res.status(200).json({ updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 module.exports.affect = async (req, res) => {
    try {
        const { userId, avisId, seanceId } = req.body;

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

        // Vérifier si un avis existe déjà pour cet utilisateur et cette séance
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

        res.status(200).json("Avis affecté avec succès");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


  module.exports.getAvisBySeance = async (req, res) => {
    try {
        const { seanceId } = req.params;
        const avisListe = await avisModel.find({ seance: seanceId }).populate("client", "nom prenom");
        res.status(200).json({ avisListe });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
  