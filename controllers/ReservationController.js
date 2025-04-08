const reservationModel = require("../models/ReservationSchema");
const usermodel = require("../models/userSchema");

// Ajouter une réservation
module.exports.addReservation = async (req, res) => {
    try {
        const { nomSeance, date, heure } = req.body;
        const reservation = await reservationModel.create({
             nomSeance, date, heure 
            });
        res.status(200).json({ reservation });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer toutes les réservations
module.exports.getAllReservations = async (req, res) => {
    try {
        const reservations = await reservationModel.find();
        res.status(200).json({ reservations });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer une réservation par ID
module.exports.getReservationById = async (req, res) => {
    try {
        const { id } = req.params;
        const reservation = await reservationModel.findById(id);
        if (!reservation) {
            throw new Error("Réservation introuvable");
        }
        res.status(200).json({ reservation });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour une réservation
module.exports.updateReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const { nomSeance, date, heure } = req.body;

        const reservation = await reservationModel.findById(id);
        if (!reservation) {
            throw new Error("Réservation introuvable");
        }

        if (!nomSeance & !date &!heure) {
            throw new Error("Aucune donnée valide à mettre à jour");
        }

        const updatedReservation = await reservationModel.findByIdAndUpdate(
            id,
            { $set: { nomSeance, date, heure } },
            { new: true }
        );

        res.status(200).json({ updatedReservation });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Supprimer une réservation
module.exports.deleteReservationById = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedReservation = await reservationModel.findByIdAndDelete(id);
        if (!deletedReservation) {
            throw new Error("Réservation introuvable");
        }
        res.status(200).json({ message: "Réservation supprimée" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.affect = async (req, res) => {
    try {
        const { userId, reservationId } = req.body;

        // Vérifier si la réservation existe
        const reservationById = await reservationModel.findById(reservationId);
        if (!reservationById) {
            throw new Error("Réservation introuvable");
        }

        // Vérifier si l'utilisateur existe
        const checkIfUserExists = await usermodel.findById(userId);
        if (!checkIfUserExists) {
            throw new Error("Utilisateur non trouvé");
        }

        // Mettre à jour la réservation avec l'utilisateur (client) et la séance
        await reservationModel.findByIdAndUpdate(reservationId, {
            $set: { client: userId, seance: reservationById.seance }  // Seance déjà dans la réservation
        });

        // Ajouter la réservation à l'utilisateur
        await usermodel.findByIdAndUpdate(userId, {
            $push: { reservations: reservationId }
        });

        res.status(200).json('Affectation réussie');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
