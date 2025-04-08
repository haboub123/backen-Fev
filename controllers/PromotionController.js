const PromotionModel= require("../models/PromotionSchema");

// Ajouter une promotion
module.exports.addPromotion = async (req, res) => {
    try {
        const {  taux, dateDebut, dateFin } = req.body;
        const promotion = await Promotion.create({
              taux, dateDebut, dateFin 
            });
        res.status(200).json({ promotion });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir toutes les promotions
module.exports.getAllPromotions = async (req, res) => {
    try {
        const promotions = await Promotion.find();
        res.status(200).json({ promotions });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir une promotion par ID
module.exports.getPromotionById = async (req, res) => {
    try {
        const { id } = req.params;
        const promotion = await Promotion.findById(id);
        if (!promotion) throw new Error("Promotion introuvable");
        res.status(200).json({ promotion });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour une promotion
module.exports.updatePromotion = async (req, res) => {
    try {
        const id = req.params.id;
        const { taux, dateDebut, dateFin } = req.body;
        
        const promotionById = await PromotionModel.findById(id);
        if (!promotionById) {
            throw new Error("promotion introuvable");
        }

        await PromotionModel.findByIdAndUpdate(id, { 
            $set: { taux, dateDebut, dateFin} 
        });

        const updatedPromotion= await PromotionModel.findById(id);
        res.status(200).json({ updatedPromotion});

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Supprimer une promotion
module.exports.deletePromotionById = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await PromotionModel.findByIdAndDelete(id);
        if (!deleted) throw new Error("Promotion introuvable");
        res.status(200).json( "deleted" );
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
