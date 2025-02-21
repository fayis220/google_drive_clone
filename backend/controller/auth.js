const admin = require("firebase-admin");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body; // Get token from frontend

    if (!idToken) {
      return res.status(400).json({ message: "ID Token is required" });
    }

    // Verify Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    // Check if user exists in database (optional)
    // If user doesn't exist, create a new one in MongoDB
    let user = await User.findOne({ firebaseId: uid });
    if (!user) {
      user = new User({
        firebaseId: uid,
        name: name || "Unknown",
        email,
        profilePic: picture || "",
      });

      await user.save();
    }

    // Generate a JWT token for session handling
    const jwtToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Login successful", token: jwtToken, user });
  } catch (error) {
    console.error("Error verifying ID token:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = { googleLogin };
