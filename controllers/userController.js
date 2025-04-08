const userModel = require('../models/userSchema');

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
        const userListe = await userModel.find().populate("Car")

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
        const { email, username } = req.body;

        await userModel.findByIdAndUpdate(id, { $set: { email, username } });
        const updated = await userModel.findById(id);

        res.status(200).json({ updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
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

