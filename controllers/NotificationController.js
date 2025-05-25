const notificationModel = require("../models/NotificationSchema");

// Ajouter une notification
module.exports.addNotification = async (req, res) => {
    try {
        const { contenu, roleCible, clients } = req.body;
        const notification = await notificationModel.create({
            contenu,
            dateEnvoi: Date.now(),
            statut: 'non lu',
            roleCible,
            clients
        });
        res.status(201).json({ notification });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer toutes les notifications
module.exports.getAllNotifications = async (req, res) => {
    try {
        const { userId, role } = req.query;
        let query = {};
        if (userId) query.clients = userId;
        if (role) query.roleCible = role;

        const notifications = await notificationModel.find(query).sort({ dateEnvoi: -1 });
        res.status(200).json({ notifications });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Compter les notifications non lues
module.exports.countUnreadNotifications = async (req, res) => {
    try {
        const { userId, role } = req.query;
        let query = { statut: "non lu" };
        if (userId) query.clients = userId;
        if (role) query.roleCible = role;

        const count = await notificationModel.countDocuments(query);
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer une notification par ID
module.exports.getNotificationById = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await notificationModel
            .findById(id)
            .populate("clients", "nom prenom");
        if (!notification) {
            return res.status(404).json({ message: "Notification introuvable" });
        }
        res.status(200).json({ notification });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour une notification
module.exports.updateNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const { contenu, dateEnvoi, statut, clients, roleCible } = req.body;
        const notification = await notificationModel.findById(id);
        if (!notification) {
            return res.status(404).json({ message: "Notification introuvable" });
        }
        const updatedNotification = await notificationModel.findByIdAndUpdate(
            id,
            { $set: { contenu, dateEnvoi, statut, clients, roleCible } },
            { new: true }
        );
        res.status(200).json({ updatedNotification });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Supprimer une notification
module.exports.deleteNotificationById = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await notificationModel.findById(id);
        if (!notification) {
            return res.status(404).json({ message: "Notification introuvable" });
        }
        await notificationModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Notification supprimée" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};