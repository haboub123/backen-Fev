const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { requireAuthUser } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");



router.post("/addUserClient", userController.addUserClient);
router.post("/addUserClientWithImg", upload.single("image_user"), userController.addUserClientWithImg);
router.post("/addUserAdmin", userController.addUserAdmin);
router.post("/addUserCoach", userController.addUserCoach);
router.post("/addCoachWithImg", upload.single("user_image"), userController.addUserCoachWithImg);
router.put("/updateCoachProfile/:id", upload.single("user_image"), userController.updateCoachProfile);
router.get("/getAllUsers", requireAuthUser, userController.getAllUsers);
router.get("/getUserById/:id", userController.getUsersById);
router.delete("/deleteUserById/:id", userController.deleteUserById);
router.put("/updateUserById/:id", userController.updateUserById);
router.get("/searchUserByUsername", userController.searchUserByUsername);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/coachs", userController.getAllCoachs);
router.get("/getUserAbonnements/:id", userController.getUserAbonnements);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);

module.exports = router;