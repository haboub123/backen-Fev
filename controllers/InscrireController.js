const inscrireModel = require("../models/InscrireSchema");

// Ajouter une inscription

module.exports.addInscription = async (req, res) => {
  try {
    const { idProgramme, idMembre, dateInscrit } = req.body;

    const inscription = await inscrireModel.create({
      idProgramme,
      idMembre,
      dateInscrit
    });

    res.status(200).json({ inscription });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer toutes les inscriptions

module.exports.getAllInscriptions = async (req, res) => {
  try {
    const inscriptions = await inscrireModel.find();
    res.status(200).json({ inscriptions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Récupérer une inscription par ID

module.exports.getInscriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const inscription = await inscrireModel.findById(id);
    res.status(200).json({ inscription });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour une inscription

module.exports.updateInscription = async (req, res) => {
  try {
    const id = req.params.id;
    const { idProgramme, idMembre, dateInscrit } = req.body;

    const inscriptionById = await inscrireModel.findById(id);
    if (!inscriptionById) {
      throw new Error("Inscription introuvable");
    }

    await inscrireModel.findByIdAndUpdate(id, {
      $set: { idProgramme, idMembre, dateInscrit }
    });

    const updatedInscription = await inscrireModel.findById(id);
    res.status(200).json({ updatedInscription });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer une inscription

module.exports.deleteInscriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    await inscrireModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Inscription supprimée" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
