const express = require("express");
const router = express.Router();
const authController = require("../controller/auth");

router.post("/api/login", authController.googleLogin);
// router.post("/banner", commonController.bannerDetails);

module.exports = router;
