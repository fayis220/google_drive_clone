const express = require("express");
const router = express.Router();
const authController = require("../controller/auth");
const fileController = require("../controller/files");
const { userRequired } = require("../middleware/auth");
const { upload } = require("../supabase");

router.post("/api/login", authController.googleLogin);

router.post(
  "/api/file/upload",
  userRequired,
  upload.single("file"),
  fileController.fileUpload
);

module.exports = router;
