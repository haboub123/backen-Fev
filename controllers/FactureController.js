const factureModel = require("../models/FactureSchema");
const usermodel = require("../models/userSchema");

// Ajouter une facture
module.exports.addFacture = async (req, res) => {
    try {
        const { montant, date, methode,statut } = req.body;
        const facture = await factureModel.create({ 
            montant, date, methode,statut  
        });
        res.status(200).json({ facture });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer toutes les factures
module.exports.getAllFactures = async (req, res) => {
    try {
        const factures = await factureModel.find();
        res.status(200).json({ factures });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer une facture par ID
module.exports.getFactureById = async (req, res) => {
    try {
        const { id } = req.params;
        const facture = await factureModel.findById(id);
        res.status(200).json({ facture });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour une facture
module.exports.updateFacture = async (req, res) => {
    try {
        const id = req.params.id;
        const { montant, date, methode, statut } = req.body;
        
        const factureById = await  factureModel.findById(id);
        if (!factureById) {
            throw new Error("Facture introuvable");
        }

        await  factureModel.findByIdAndUpdate(id, { 
            $set: { montant, date, methode, statut } 
        });

        const updatedFacture = await factureModel.findById(id);
        res.status(200).json({ updatedFacture });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Supprimer une facture
module.exports.deleteFactureById = async (req, res) => {
    try {
        const { id } = req.params;
        await factureModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Facture supprimée" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.affect = async (req, res) => {
    try {
      const { userId, factureId } = req.body;
  
      const factureById = await factureModel.findById(factureId);
  
      if (!factureById ) {
        throw new Error("facture introuvable");
      }
      const checkIfUserExists = await usermodel.findById(userId);
      if (!checkIfUserExists) {
        throw new Error("User not found");
      }
  
      await factureModel.findByIdAndUpdate(factureId, {
        $set: { client: userId },
      });
  
      await usermodel.findByIdAndUpdate(userId, {
        $push: {factures : factureId},
      });
  
      res.status(200).json('affected'   );
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

