var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');
const { requireAuthUser } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadFile');


/* GET users listing. */
router.post('/addUserClient', userController.addUserClient);
router.post('/addUserClientWithImg', upload.single("image_user"), userController.addUserClientWithImg);
router.post('/addUserAdmin', userController.addUserAdmin);
router.post('/addUserCoach', userController.addUserCoach);
router.get('/getAllUsers', requireAuthUser, userController.getAllUsers);
router.get('/getUserById/:id', userController.getUsersById);
router.delete('/deleteUserById/:id', userController.deleteUserById);
router.put('/updateuserById/:id', userController.updateuserById);
router.get('/searchUserByUsername', userController.searchUserByUsername);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/coachs', userController.getAllCoachs);
router.get('/getUserAbonnements/:id', userController.getUserAbonnements);
router.post("/addCoachWithImg", upload.single("user_image"), userController.addUserCoachWithImg);




module.exports = router;
