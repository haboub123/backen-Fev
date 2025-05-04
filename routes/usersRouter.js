var express = require('express');
var router = express.Router();
const userController=require('../controllers/userController');
const {requireAuthUser} = require('../middlewares/authMiddleware');

/* GET users listing. */
router.post('/addUserClient', userController.addUserClient) ;
router.post('/addUserAdmin', userController.addUserAdmin);
router.post('/addUserCoach', userController.addUserCoach);
router.get('/getAllUsers',requireAuthUser,  userController.getAllUsers);
router.get('/getUserById/:id', userController.getUsersById);
router.get('/deleteUserById/:id', userController.deleteUserById);
router.put('/updateuserById/:id', userController.updateuserById);
router.get('/searchUserByUsername', userController.searchUserByUsername);
router.post('/login',userController.login); 
router.post('/logout',userController.logout); 



module.exports = router;
