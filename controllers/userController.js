const userModel = require('../models/userSchema');


const jwt = require('jsonwebtoken');

const maxTime = 24 *60 * 60 //24H
//const maxTime = 1 * 60 //1min
const createToken = (id) => {
    return jwt.sign({id},'net secret pfe', {expiresIn: maxTime })
}





module.exports.addUserClient = async (req, res) => {
    try {
        const { username, email, password} = req.body;
        const roleClient = 'client';  
        
        
        const user = await userModel.create({
            username, email, password, role: roleClient
        });
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.addUserClientWithImg = async (req, res) => {
    try {
        console.log("Raw Body:", req.body); // Debug raw body
        console.log("File Details:", req.file); // Debug file

        const { username, email, password } = req.body;
        const roleClient = 'client';  
        const { filename } = req.file || {};

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Champs manquants" });
        }

        const user = await userModel.create({
            username,
            email,
            password,
            role: roleClient,
            user_image: filename
        });

        res.status(200).json({ user });
    } catch (error) {
        console.error("Error:", error); // Log the error
        res.status(500).json({ message: error.message });
    }
};





module.exports.addUserAdmin = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const roleAdmin = 'admin';
        
        const user = await userModel.create({
            username, email, password, role: roleAdmin
        });

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}





module.exports.addUserCoach = async (req, res) => {
    try {
        const { username, email, password, specialite } = req.body;
        const roleCoach = "coach"; 

        const user = await userModel.create({
            username,
            email,
            password,
            role: roleCoach,
            specialite 
            
        });

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.getAllUsers= async (req,res) => {
    try {
        const userListe = await userModel.find()
        .populate("abonnement")
            .populate("notifications")
            .populate("factures")
            .populate("avis")
            .populate("reservations")
            .populate("seances");

        res.status(200).json({userListe});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports.getUsersById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id);
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
module.exports.deleteUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const checkIfUserExists = await userModel.findById(id);
        if (!checkIfUserExists) {
            throw new Error("User not found");
        }

        await userModel.findByIdAndDelete(id);
        res.status(200).json("deleted");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



module.exports.updateuserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, username, specialite } = req.body;

    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Préparer les champs à mettre à jour
    const updateFields = { email, username };

    // Si c'est un coach, on met à jour aussi la spécialité
    if (user.role === "coach" && specialite) {
      updateFields.specialite = specialite;
    }

    await userModel.findByIdAndUpdate(id, { $set: updateFields });

    const updated = await userModel.findById(id);
    res.status(200).json({ updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports.searchUserByUsername = async (req, res) => {
    try {
        const { username } = req.query;
        if (!username) {
            throw new Error("Veuillez fournir un nom pour la recherche.");
        }

        const userListe = await userModel.find({
            username: { $regex: username, $options: "i" }
        });

        const count = userListe.length;
        res.status(200).json({ userListe, count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.login= async (req,res) => {
    try {
        const { email , password } = req.body;
        const user = await userModel.login(email, password)
        const token = createToken(user._id)
        res.cookie("jwt_token_9antra", token, {httpOnly:false,maxAge:maxTime * 1000})
        res.status(200).json({user})
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}
module.exports.logout= async (req,res) => {
    try {
  
        res.cookie("jwt_token_9antra", "", {httpOnly:false,maxAge:1})
        res.status(200).json("logged")
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}
module.exports.getAllCoachs = async (req, res) => {
  try {
    const coachs = await userModel.find({ role: 'coach' });
    res.status(200).json({ coachs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


