var express = require('express');
var router = express.Router();
const SalleController=require('../controllers/SalleController');

router.post('/addsalle',SalleController.addSalle);
router.get("/getAllSalles", SalleController.getAllSalles);
router.get('/getSalleById/:id',SalleController.getSalleById);
router.put('/updateSalle/:id',SalleController.updateSalle);
router.delete('/deleteSalle/:id',SalleController.deleteSalle);
module.exports = router;