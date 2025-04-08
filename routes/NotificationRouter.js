var express = require('express');
var router = express.Router();
const NotificationController=require('../controllers/NotificationController');

router.post('/addNotification',NotificationController.addNotification);
router.get('/getAllNotifications',NotificationController.getAllNotifications); 
router.get("/etNotificationById/:id", NotificationController.getNotificationById);
router.delete("/deleteNotificationById/:id",NotificationController.deleteNotificationById);
router.put("/updateNotification/:id", NotificationController.updateNotification);

module.exports = router;