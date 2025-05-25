const jwt = require("jsonwebtoken");
const userModel = require("../models/userSchema");

const requireAuthUser = (req, res, next) => {
  const token = req.cookies.jwt_token_9antra;

  if (token) {
    jwt.verify(token, "net secret pfe", async (err, decodedToken) => {
      if (err) {
        console.log("Erreur lors de la vérification du token :", err.message);
        req.session.user = null;
        return res.status(401).json({ message: "Token invalide" });
      } else {
        const user = await userModel.findById(decodedToken.id);
        if (!user) {
          req.session.user = null;
          return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        req.session.user = user;
        next();
      }
    });
  } else {
    req.session.user = null;
    return res.status(401).json({ message: "Utilisateur non authentifié" });
  }
};

module.exports = { requireAuthUser };