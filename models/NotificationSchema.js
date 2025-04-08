const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
    {
        contenu: { type: String, required: true }, // Obligatoire
        dateEnvoi: Date,
        statut: String,
        
        clients: [{   type: mongoose.Schema.Types.ObjectId,ref: "User" }]
    },
    { timestamps: true }
);

const Notification = mongoose.model("Notification", NotificationSchema);
module.exports = Notification;
