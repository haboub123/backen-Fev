const AbonnementModel = require('../models/AbonnementSchema');
const usermodel = require("../models/userSchema");

module.exports.getAllAbonnement = async (req, res) => {
  try {
    const abonnementListe = await AbonnementModel.find()
      .populate('client', 'username email')
      .populate('clients', 'username email')
      .populate('promotion', 'type description');
    res.status(200).json({ abonnementListe });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getAbonnementById = async (req, res) => {
  try {
    const id = req.params.id;
    const abonnement = await AbonnementModel.findById(id)
      .populate('client', 'username email')
      .populate('clients', 'username email')
      .populate('promotion', 'type description');
    if (!abonnement) {
      throw new Error("abonnement introuvable")
    }
    res.status(200).json({ abonnement });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.deleteAbonnementById = async (req, res) => {
  try {
    const id = req.params.id;
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
      type, 
      prix, 
      duree,
      clients: []
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
      throw new Error("Abonnement introuvable");
    }
    if (!type && !prix && !duree) {
      throw new Error("Aucune donnée valide");
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
    if (!abonnementById) {
      throw new Error("Abonnement introuvable");
    }

    const user = await usermodel.findById(userId);
    if (!user) {
      throw new Error("Utilisateur introuvable");
    }

    // Calcul des dates
    const dateDebut = new Date();
    const dateFin = new Date(dateDebut.getTime() + abonnementById.duree * 30 * 24 * 60 * 60 * 1000); // en mois

    // Ajouter l'utilisateur dans la liste des clients de l'abonnement
    await AbonnementModel.findByIdAndUpdate(abonnementId, {
      $addToSet: { clients: userId }
    });

    // Ajouter cet abonnement dans la liste des abonnements de l'utilisateur avec dateDebut et dateFin
    await usermodel.findByIdAndUpdate(userId, {
      $push: {
        abonnements: {
          abonnement: abonnementId,
          dateDebut,
          dateFin
        }
      }
    });

    res.status(200).json("Abonnement affecté avec succès");
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

    // Supprimer l'utilisateur de la liste des clients (tableau)
    await AbonnementModel.findByIdAndUpdate(abonnementId, {
      $pull: { clients: userId },
      $unset: { client: "" }
    });

    // Supprimer l'abonnement de l'utilisateur (champ simple)
    await usermodel.findByIdAndUpdate(userId, {
      $unset: { abonnement: 1 },
    });

    res.status(200).json("désaffecté avec succès");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};