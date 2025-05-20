const Activitemodel = require("../models/ActiviteSchema");
const seancemodel = require("../models/SeanceSchema");

module.exports.addActivite = async (req, res) => {
  try {
    const { nom, description } = req.body;
    const imagePath = req.file ? `/files/${req.file.filename}` : null;

    const Activite = await Activitemodel.create({
      nom,
      description,
      image: imagePath,
    });

    res.status(200).json({ Activite });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getAllActivites = async (req, res) => {
  try {
    const Activites = await Activitemodel.find();
    res.status(200).json({ Activites });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getActiviteById = async (req, res) => {
  try {
    const { id } = req.params;
    const Activite = await Activitemodel.findById(id).populate("seances");
    res.status(200).json({ Activite });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.updateActivite = async (req, res) => {
  try {
    const id = req.params.id;
    const { nom, description, duree } = req.body;

    const ActiviteById = await Activitemodel.findById(id);
    if (!ActiviteById) {
      throw new Error("Activité introuvable");
    }

    if (!nom && !description && !duree) {
      throw new Error("Erreur : Aucun champ à mettre à jour.");
    }

    await Activitemodel.findByIdAndUpdate(id, {
      $set: { nom, description, duree },
    });

    const updatedActivite = await Activitemodel.findById(id);
    res.status(200).json({ updatedActivite });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.deleteActiviteById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedActivite = await Activitemodel.findByIdAndDelete(id);
    if (!deletedActivite) {
      throw new Error("Activité introuvable");
    }

    res.status(200).json("Activité supprimée");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.affect = async (req, res) => {
  try {
    const { SeanceId, ActiviteId } = req.body;

    const ActiviteById = await Activitemodel.findById(ActiviteId);
    if (!ActiviteById) {
      throw new Error("Activité introuvable");
    }

    const checkIfSeanceExists = await seancemodel.findById(SeanceId);
    if (!checkIfSeanceExists) {
      throw new Error("Séance introuvable");
    }

    await Activitemodel.findByIdAndUpdate(ActiviteId, {
      $push: { seances: SeanceId },
    });

    await seancemodel.findByIdAndUpdate(SeanceId, {
      $set: { activite: ActiviteId },
    });

    res.status(200).json("Affectation réussie");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.desaffect = async (req, res) => {
  try {
    const { SeanceId, ActiviteId } = req.body;

    const activite = await Activitemodel.findById(ActiviteId);
    if (!activite) {
      throw new Error("Activité introuvable");
    }

    const seance = await seancemodel.findById(SeanceId);
    if (!seance) {
      throw new Error("Séance introuvable");
    }

    await Activitemodel.findByIdAndUpdate(ActiviteId, {
      $pull: { seances: SeanceId },
    });

    await seancemodel.findByIdAndUpdate(SeanceId, {
      $unset: { activite: 1 },
    });

    res.status(200).json("Désaffectation réussie");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 

