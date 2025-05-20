const seancemodel = require("../models/SeanceSchema");
const activiteModel = require("../models/ActiviteSchema"); // Importer le modèle Activite
const salleModel = require("../models/SalleSchema");
const usermodel = require("../models/userSchema");

module.exports.addseance = async (req, res) => {
    try {
        const { titre, description, date, heure, duree, salle, activite } = req.body;

        // Vérifier si l'activité existe
        const activiteExists = await activiteModel.findById(activite);
        if (!activiteExists) {
            return res.status(404).json({ message: "Activité non trouvée" });
        }

        // Créer la nouvelle séance
        const newSeance = await seancemodel.create({
            titre,
            description,
            date,
            heure,
            duree,
            salle,
            activite
        });

        // Mettre à jour le tableau seances de l'activité avec l'ID de la nouvelle séance
        await activiteModel.findByIdAndUpdate(
            activite,
            { $push: { seances: newSeance._id } },
            { new: true, runValidators: true }
        );

        res.status(200).json({ Seance: newSeance });
    } catch (error) {
        console.error("Erreur lors de l'ajout de la séance:", error);
        res.status(500).json({ message: error.message });
    }
};

module.exports.getAllSeances = async (req, res) => {
    try {
        const seances = await seancemodel.find()
            .populate("salle", "nom")
            .populate("activite", "nom");
        res.status(200).json({ seances });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.getSeanceById = async (req, res) => {
    try {
        const { id } = req.params;
        const seance = await seancemodel.findById(id);
        res.status(200).json({ seance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.updateSeance = async (req, res) => {
    try {
        const id = req.params.id;
        const { titre, description, date, duree, heure, salle, activite } = req.body;

        const seanceById = await seancemodel.findById(id);
        if (!seanceById) {
            return res.status(404).json({ message: "Séance introuvable" });
        }

        // Si l'activité change, mettre à jour les relations
        if (activite && activite !== seanceById.activite?.toString()) {
            // Retirer la séance de l'ancienne activité
            if (seanceById.activite) {
                await activiteModel.findByIdAndUpdate(
                    seanceById.activite,
                    { $pull: { seances: id } },
                    { new: true }
                );
            }

            // Ajouter la séance à la nouvelle activité
            await activiteModel.findByIdAndUpdate(
                activite,
                { $push: { seances: id } },
                { new: true }
            );
        }

        // Mettre à jour la séance
        await seancemodel.findByIdAndUpdate(id, {
            $set: { titre, description, date, heure, duree, salle, activite },
        });

        const updatedSeance = await seancemodel.findById(id);
        res.status(200).json({ updatedSeance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.deleteSeanceById = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedSeance = await seancemodel.findById(id);
        if (!deletedSeance) {
            return res.status(404).json({ message: "Séance introuvable" });
        }

        // Supprimer la séance
        await seancemodel.findByIdAndDelete(id);

        // Retirer l'ID de la séance du tableau seances de l'activité associée
        if (deletedSeance.activite) {
            await activiteModel.findByIdAndUpdate(
                deletedSeance.activite,
                { $pull: { seances: id } },
                { new: true }
            );
        }

        // Retirer l'ID de la séance du tableau seances de la salle associée
        if (deletedSeance.salle) {
            await salleModel.findByIdAndUpdate(
                deletedSeance.salle,
                { $pull: { seances: id } }, // Ajusté pour "seances"
                { new: true }
            );
        }

        res.status(200).json("Séance supprimée");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports.affect = async (req, res) => {
    try {
        const { userId, seanceId } = req.body;

        const seanceById = await seancemodel.findById(seanceId);
        if (!seanceById) {
            throw new Error("Séance introuvable");
        }
        const checkIfUserExists = await usermodel.findById(userId);
        if (!checkIfUserExists) {
            throw new Error("User not found");
        }

        await seancemodel.findByIdAndUpdate(seanceId, {
            $push: { coachs: userId },
        });

        await usermodel.findByIdAndUpdate(userId, {
            $push: { seances: seanceId },
        });

        res.status(200).json('affected');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.getSeancesByActivite = async (req, res) => {
    try {
        const { activiteId } = req.params;
        console.log("Recherche de séances pour l'activité ID:", activiteId);
        const seances = await seancemodel.find({ activite: activiteId })
            .populate("salle", "nom")
            .populate("activite", "nom");
        if (!seances.length) {
            console.log("Aucune séance trouvée pour cette activité");
            return res.status(404).json({ message: "Aucune séance trouvée pour cette activité" });
        }
        console.log("Séances trouvées:", seances);
        res.status(200).json({ seances });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

