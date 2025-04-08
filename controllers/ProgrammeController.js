
const programmemodel = require("../models/ProgrammeSchema");
const usermodel = require("../models/userSchema");

module.exports.addProgramme = async (req, res) => {
    try {
        const { nom, description, duree } = req.body;
        const Programme = await programmemodel.create({
            nom, description, duree
        });
        res.status(200).json({Programme});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports.getAllProgrammes = async (req, res) => {
    try {
        const programmes = await programmemodel.find();
        res.status(200).json({programmes});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports.getProgrammeById = async (req, res) => {
    try {
        const {id}=req.params;
        const programme= await programmemodel.findById(id);
        res.status(200).json({programme});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports.updateProgramme = async (req, res) => {
    try {
      const id = req.params.id;
      const { nom, description, duree } = req.body;
      const programmeById = await programmemodel.findById(id);
      if (!programmeById) {
        throw new Error("Programme introuvable");
      }
      if (!nom & !description & !duree) {
        throw new Error("Erreur data ");
      }
      await programmemodel.findByIdAndUpdate(id, {
        $set: { nom, description, duree },
      });
      const updatedProgramme = await programmemodel.findById(id);
      res.status(200).json({ updatedProgramme });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  module.exports.deleteProgrammeById= async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProgramme = await programmemodel.findByIdAndDelete(id);
        if (!deletedProgramme) {
            throw new Error("programme introuvable");
        }
        await programmemodel.findByIdAndDelete(id);
        res.status(200).json("deleted");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports.affect = async (req, res) => {
    try {
        const { userId, programmeId, role } = req.body;

        const programmeById = await programmemodel.findById(programmeId);
        if (!programmeById) {
            throw new Error("Programme introuvable");
        }

        const checkIfUserExists = await usermodel.findById(userId);
        if (!checkIfUserExists) {
            throw new Error("User not found");
        }

        if (role === "coach") {
            if (programmeById.coach) {
                throw new Error("Un coach est déjà affecté à ce programme");
            }
            await programmemodel.findByIdAndUpdate(programmeId, {
                $set: { coach: userId }
            });
        } else if (role === "client") {
            if (programmeById.clients.includes(userId)) {
                throw new Error("L'utilisateur est déjà un client de ce programme");
            }
            await programmemodel.findByIdAndUpdate(programmeId, {
                $push: { clients: userId }
            });
        } else {
            throw new Error("Role invalide");
        }

        await usermodel.findByIdAndUpdate(userId, {
            $push: { programmes: programmeId }
        });

        res.status(200).json('Affectation réussie');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
