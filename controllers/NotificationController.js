const notificationModel = require("../models/NotificationSchema");

// Ajouter une notification
module.exports.addNotification = async (req, res) => {
    try {
        const { contenu,dateEnvoi, statut } = req.body;
        const notification = await notificationModel.create ({
             contenu,dateEnvoi, statut
             });
        res.status(200).json({ notification });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer toutes les notifications
module.exports.getAllNotifications = async (req, res) => {
    try {
        const notifications = await notificationModel.find();
        res.status(200).json({ notifications });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer une notification par ID
module.exports.getNotificationById = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await notificationModel.findById(id);
        res.status(200).json({ notification });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour une notification
module.exports.updateNotification = async (req, res) => {
    try {
        const id = req.params.id;
        const {  contenu,dateEnvoi, statut } = req.body;
        
        const notificationById = await notificationModel.findById(id);
        if (!notificationById) {
            throw new Error("notification introuvable");
        }

        await notificationModel.findByIdAndUpdate(id, { 
            $set: {  contenu,dateEnvoi, statut} 
        });

        const updatedNotification= await notificationModel.findById(id);
        res.status(200).json({ updatedNotification});

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Supprimer une notification
module.exports.deleteNotificationById = async (req, res) => {
    try {
        const { id } = req.params;
        await notificationModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Notification supprimée" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
