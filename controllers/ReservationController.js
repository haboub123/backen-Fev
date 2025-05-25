const reservationModel = require("../models/ReservationSchema");
const usermodel = require("../models/userSchema");

// Add a reservation
module.exports.addReservation = async (req, res) => {
  try {
    const { nomSeance, date, heure, seance } = req.body;
    
    if (!nomSeance || !date || !heure || !seance) {
      return res.status(400).json({ 
        message: "Données de réservation incomplètes" 
      });
    }
    
    const reservation = await reservationModel.create({
      nomSeance, date, heure, seance
    });
    
    res.status(200).json({ reservation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getUserReservations = async (req, res) => {
  try {
    // userId is extracted from session (set by requireAuthUser middleware)
    const userId = req.session.user._id;
    
    if (!userId) {
      return res.status(401).json({ 
        message: "Utilisateur non authentifié" 
      });
    }
    
    const user = await usermodel.findById(userId).populate('reservations');
    
    if (!user) {
      return res.status(404).json({ 
        message: "Utilisateur non trouvé" 
      });
    }
    
    res.status(200).json({ reservations: user.reservations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Assign reservation to user
module.exports.affect = async (req, res) => {
  try {
    const { reservationId } = req.body;
    // userId is extracted from session (set by requireAuthUser middleware)
    const userId = req.session.user._id;
    
    if (!userId) {
      return res.status(401).json({ 
        message: "Utilisateur non authentifié" 
      });
    }
    
    // Check if reservation exists
    const reservation = await reservationModel.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ 
        message: "Réservation introuvable" 
      });
    }
    
    // Check if user exists
    const user = await usermodel.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        message: "Utilisateur non trouvé" 
      });
    }
    
    // Update reservation with user ID
    await reservationModel.findByIdAndUpdate(reservationId, {
      $set: { client: userId }
    });
    
    // Add reservation to user's reservations array
    await usermodel.findByIdAndUpdate(userId, {
      $push: { reservations: reservationId }
    });
    
    res.status(200).json({ message: 'Affectation réussie' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete reservation
module.exports.deleteReservationById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session.user._id;
    
    // Verify reservation belongs to user
    const reservation = await reservationModel.findById(id);
    
    if (!reservation) {
      return res.status(404).json({ 
        message: "Réservation introuvable" 
      });
    }
    
    if (reservation.client.toString() !== userId.toString()) {
      return res.status(403).json({ 
        message: "Vous n'êtes pas autorisé à supprimer cette réservation" 
      });
    }
    
    // Delete reservation
    await reservationModel.findByIdAndDelete(id);
    
    // Remove reservation from user's reservations array
    await usermodel.findByIdAndUpdate(userId, {
      $pull: { reservations: id }
    });
    
    res.status(200).json({ message: "Réservation supprimée" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};