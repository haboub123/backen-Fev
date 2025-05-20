var express = require('express');
var router = express.Router();
const AbonnementController=require('../controllers/AbonnementController');

/* GET home page. */
router.get('/getAllAbonnement',AbonnementController.getAllAbonnement); 
router.post('/addAbonnement',AbonnementController.addAbonnement);
router.get('/getAbonnementById/:id',AbonnementController.getAbonnementById);
router.delete('/deleteAbonnementById/:id',AbonnementController.deleteAbonnementById);
router.put('/updateAbonnement/:id',AbonnementController.updateAbonnement);
router.put('/affect',AbonnementController.affect);
router.put('/desaffect',AbonnementController.desaffect);


module.exports = router;