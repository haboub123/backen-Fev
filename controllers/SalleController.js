const sallemodel = require("../models/SalleSchema");
const seancemodel = require("../models/SeanceSchema"); // Ajout pour gérer les séances

module.exports.addSalle = async (req, res) => {
    try {
        const { nom, capacite, description } = req.body;
        const salle = await sallemodel.create({
            nom,
            description,
            capacite
        });
        res.status(200).json({ salle });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.getAllSalles = async (req, res) => {
    try {
        const salles = await sallemodel.find();
        res.status(200).json({ salles });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.getSalleById = async (req, res) => {
    try {
        const { id } = req.params;
        const salle = await sallemodel.findById(id);
        if (!salle) throw new Error("Salle introuvable");
        res.status(200).json({ salle });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.updateSalle = async (req, res) => {
    try {
        const id = req.params.id;
        const { nom, capacite, description } = req.body;
        const salleById = await sallemodel.findById(id);
        if (!salleById) {
            throw new Error("Salle introuvable");
        }
        if (!nom && !description && !capacite) {
            throw new Error("Aucune donnée valide");
        }
        await sallemodel.findByIdAndUpdate(id, {
            $set: { nom, capacite, description },
        });
        const updated = await sallemodel.findById(id);
        res.status(200).json({ updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.deleteSalle = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedSalle = await sallemodel.findByIdAndDelete(id);
        if (!deletedSalle) {
            throw new Error("Salle introuvable");
        }
        res.status(200).json("deleted");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};