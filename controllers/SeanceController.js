
const seancemodel = require("../models/SeanceSchema");
const usermodel = require("../models/userSchema");

module.exports.addseance = async (req, res) => {
    try {
        const {  titre, description, date, heure, duree, type, salle } = req.body;
        const Seance = await seancemodel.create({
            titre, description, date, heure, duree, type, salle
        });
        res.status(200).json({Seance});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports.getAllSeances = async (req, res) => {
    try {
        const seances= await seancemodel.find();
        res.status(200).json({seances});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports.getSeanceById = async (req, res) => {
    try {
        const {id}=req.params;
        const seance= await seancemodel.findById(id);
        res.status(200).json({seance});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports.updateSeance = async (req, res) => {
    try {
      const id = req.params.id;
      const { titre, description, date, duree  } = req.body;
      const seanceById = await Seance.findById(id);
      if (!seanceById) {
        throw new Error("Séance introuvable");
      }
      await Seance.findByIdAndUpdate(id, {
        $set: {titre, description, date, duree},
      });
      const updatedseance = await Seance.findById(id);
      res.status(200).json({ updatedseance });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  module.exports.deleteSeanceById = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedSeance = await seancemodel.findByIdAndDelete(id);
        if (!deletedSeance) {
            throw new Error("Séance introuvable");
        }
        await seancemodel.findByIdAndDelete(id);
        res.status(200).json("deleted");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports.affect = async (req, res) => {
    try {
      const { userId, seanceId } = req.body;
  
      const seanceById = await seancemodel.findById(seanceId);
  
      if (!seanceById ) {
        throw new Error("seance introuvable");
      }
      const checkIfUserExists = await usermodel.findById(userId);
      if (!checkIfUserExists) {
        throw new Error("User not found");
      }
  
      await seancemodel.findByIdAndUpdate(seanceId, {
        $push: { coachs: userId },
      });
  
      await usermodel.findByIdAndUpdate(userId, {
        $push: {seances : seanceId},
      });
  
      res.status(200).json('affected');
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };