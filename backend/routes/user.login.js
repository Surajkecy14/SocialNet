const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const verifyToken = require("../middleware/auth");
// Create user route
router.post("/create", async (req, res) => {
  const { username, email, password, age, gender } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      password: hashedPassword,
      gender,
      age,
    });

    res.status(201).json({ message: "User created successfully ✅" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server side error ❌" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json("User not found ❌");

    const isSuccess = await bcrypt.compare(password, user.password);

    if (!isSuccess) {
      return res.status(401).json("User not found ❌");
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
    });

    res.status(200).json("Login successful ✅");
  } catch (error) {
    console.error(error);
    res.status(500).json("Server error ❌");
  }
});

router.post("/logout", (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully ✅" });
  } catch (error) {
    res.status(404).json("server side error!");
  }
});
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
