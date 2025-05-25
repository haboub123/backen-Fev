const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    contenu: { type: String, required: true },
    dateEnvoi: { type: Date, default: Date.now },
    statut: { type: String, enum: ['lu', 'non lu'], default: 'non lu' },
    roleCible: { type: String, enum: ['admin', 'coach', 'client'], required: true },
    clients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Notification', notificationSchema);