var express = require('express');
var router = express.Router();

const ProgrammeController=require('../controllers/ProgrammeController');
router.post('/addProgramme',ProgrammeController.addProgramme);
router.get('/getAllProgrammes',ProgrammeController.getAllProgrammes);
router.get('/getProgrammeById/:id',ProgrammeController.getProgrammeById);
router.put('/updateProgramme/:id',ProgrammeController.updateProgramme);
router.delete('/deleteProgrammeById/:id',ProgrammeController.deleteProgrammeById);
router.put('/affect',ProgrammeController.affect);

module.exports = router;