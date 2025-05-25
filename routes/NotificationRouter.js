var express = require("express");
var router = express.Router();
const NotificationController = require("../controllers/NotificationController");
const { requireAuthUser } = require("../middlewares/authMiddleware");

router.post("/addNotification", requireAuthUser, NotificationController.addNotification);
router.get("/getAllNotifications", requireAuthUser, NotificationController.getAllNotifications);
router.get("/countUnread", requireAuthUser, NotificationController.countUnreadNotifications);
router.get("/getNotificationById/:id", requireAuthUser, NotificationController.getNotificationById);
router.delete("/deleteNotificationById/:id", requireAuthUser, NotificationController.deleteNotificationById);
router.put("/updateNotification/:id", requireAuthUser, NotificationController.updateNotification);

module.exports = router;