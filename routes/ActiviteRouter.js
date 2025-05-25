var express = require('express');
var router = express.Router();

const ActiviteController = require('../controllers/ActiviteController');
const upload = require('../middlewares/upload');

router.post('/addActivite', upload.single("image"), ActiviteController.addActivite);
router.get('/getAllActivites', ActiviteController.getAllActivites);
router.get('/getActiviteById/:id', ActiviteController.getActiviteById);
router.put('/updateActivite/:id', upload.single("image"), ActiviteController.updateActivite);
router.delete('/deleteActiviteById/:id', ActiviteController.deleteActiviteById);
router.put('/affect', ActiviteController.affect);
router.put('/desaffect', ActiviteController.desaffect);

module.exports = router;