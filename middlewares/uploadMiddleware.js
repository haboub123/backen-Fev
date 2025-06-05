const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "..", "uploads"); // Utilise "uploads/" comme dossier
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "-" + file.originalname.replace(ext, "") + ext;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } }); // Limite de 2 Mo

module.exports = upload;