const multer = require("multer");
const path = require("path");
const fs = require("fs");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'public/files'; // Dossier où les images seront stockées

    // Crée le dossier s'il n'existe pas
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const originalName = file.originalname;
    const fileExtension = path.extname(originalName);
    let fileName = originalName;

    // Vérifie si le fichier existe déjà, sinon renomme le fichier
    let fileIndex = 1;
    while (fs.existsSync(path.join('public/files', fileName))) {
      const baseName = path.basename(originalName, fileExtension);
      fileName = `${baseName}_${fileIndex}${fileExtension}`;
      fileIndex++;
    }

    cb(null, fileName); // Nom final du fichier
  }
});

var upload = multer({ storage: storage });

module.exports = upload;
