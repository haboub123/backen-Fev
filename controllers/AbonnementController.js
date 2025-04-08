const AbonnementModel = require('../models/AbonnementSchema');
const usermodel = require("../models/userSchema");
module.exports.getAllAbonnement= async (req,res) => {
    try {
        const abonnementListe = await AbonnementModel.find();

        res.status(200).json({abonnementListe});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}
module.exports.getAbonnementById = async (req, res) => {
    try {
        const id  = req.params .id ;
        const abonnement = await AbonnementModel.findById(id);
        if(!abonnement){
            throw new Error("abonnement introuvable")
        }
        res.status(200).json({abonnement});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports.deleteAbonnementById = async (req, res) => {
    try {
        const id  = req.params .id;
        const abonnementById = await AbonnementModel.findById(id);
        if (!abonnementById) {
            throw new Error("abonnement inrouvable");
        }
        await AbonnementModel.findByIdAndDelete(id);
        res.status(200).json("deleted");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports.addAbonnement = async (req, res) => {
    try {
        const { type, prix, duree } = req.body;


        const abonnement = await AbonnementModel.create({
            type, prix, duree  
        });

        res.status(200).json({ abonnement });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.updateAbonnement = async (req, res) => {
  try {
    const id = req.params.id; 
    const { type, prix, duree } = req.body; 
    const abonnementById = await AbonnementModel.findById(id);
    if (!abonnementById) {
      throw new Error(" Abonnement introuvable");
    }
    if (!type &!prix &!duree) {
      throw new Error(" Aucune donnée valide ");
    }
    const updated = await AbonnementModel.findByIdAndUpdate(id, {
      $set: { type, prix, duree },
    });
    res.status(200).json("updated");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports.affect = async (req, res) => {
    try {
      const { userId, abonnementId } = req.body;
  
      const abonnementById = await AbonnementModel.findById(abonnementId);
  
      if (!abonnementById ) {
        throw new Error("abonnement introuvable");
      }
      const checkIfUserExists = await usermodel.findById(userId);
      if (!checkIfUserExists) {
        throw new Error("User not found");
      }
  
      await AbonnementModel.findByIdAndUpdate(abonnementId, {
        $push: { clients: userId },
      });
  
      await usermodel.findByIdAndUpdate(userId, {
        $set: {abonnement : abonnementId},
      });
  
      res.status(200).json('affected');
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  module.exports.desaffect = async (req, res) => {
    try {
      const { userId, abonnementId } = req.body;
  
      // Vérifier que l'abonnement existe
      const abonnementById = await AbonnementModel.findById(abonnementId);
      if (!abonnementById) {
        throw new Error("Abonnement introuvable");
      }
  
      // Vérifier que l'utilisateur existe
      const checkIfUserExists = await usermodel.findById(userId);
      if (!checkIfUserExists) {
        throw new Error("Utilisateur introuvable");
      }
  
      // ❌ Supprimer l'utilisateur de la liste des clients (tableau)
      await AbonnementModel.findByIdAndUpdate(abonnementId, {
        $pull: { clients: userId },
      });
  
      // ❌ Supprimer l’abonnement de l’utilisateur (champ simple)
      await usermodel.findByIdAndUpdate(userId, {
        $unset: { abonnement: 1 },
      });
  
      res.status(200).json("désaffecté avec succès");
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  