const avisModel = require("../models/avisSchema");
const usermodel = require("../models/userSchema");

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
      const id = req.params.id; 
      const { note, commentaire,date  } = req.body; 
      const avisById = await avisModel.findById(id);
      if (!avisById) {
        throw new Error(" Avisintrouvable");
      }
      if (!note &!commentaire &!date) {
        throw new Error(" Aucune donnée valide ");
      }
      const updated = await avisModel.findByIdAndUpdate(id, {
        $set: { note, commentaire, date},
      });
      res.status(200).json("updated");
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  module.exports.affect = async (req, res) => {
    try {
      const { userId, avisId } = req.body;
  
      const avisById = await avisModel.findById(avisId);
  
      if (!avisById ) {
        throw new Error("avis introuvable");
      }
      const checkIfUserExists = await usermodel.findById(userId);
      if (!checkIfUserExists) {
        throw new Error("User not found");
      }
  
      await avisModel.findByIdAndUpdate(avisId, {
        $set: { client: userId },
      });
  
      await usermodel.findByIdAndUpdate(userId, {
        $push: {avis : avisId},
      });
  
      res.status(200).json('affected');
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  