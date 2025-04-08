var express = require('express');
var router = express.Router();
const userController=require('../controllers/userController');

/* GET users listing. */
router.post('/addUserClient', userController.addUserClient) ;
router.post('/addUserAdmin', userController.addUserAdmin);
router.post('/addUserCoach', userController.addUserCoach);
router.get('/getAllUsers', userController.getAllUsers);
router.get('/getUserById/:id', userController.getUsersById);
router.get('/deleteUserById/:id', userController.deleteUserById);
router.put('/updateuserById/:id', userController.updateuserById);
router.get('/searchUserByUsername', userController.searchUserByUsername);



module.exports = router;
