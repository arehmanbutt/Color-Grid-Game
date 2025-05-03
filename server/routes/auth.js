import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, password, profile_picture_url } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken." });
    }

    const user = new User({
      username,
      password,
      profile_picture_url,
      coins: 1000,
    });

    await user.save();
    return res.status(201).json({
      message: "Signup successful!",
      user: {
        username: user.username,
        coins: user.coins,
        profile_picture_url: user.profile_picture_url,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });

    if (!user) {
      return res.status(400).json({ message: "Invalid username or password." });
    }

    return res.status(200).json({
      message: "Login successful!",
      user: {
        username: user.username,
        coins: user.coins,
        profile_picture_url: user.profile_picture_url,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
});

router.get("/user/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      username: user.username,
      coins: user.coins,
      profile_picture_url: user.profile_picture_url,
    });
  } catch (err) {
    console.error("Error fetching user:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.put("/user/:username", async (req, res) => {
  try {
    const { username: currentUsername } = req.params;
    const { username, password, profile_picture_url } = req.body;

    const updates = {};
    if (username) updates.username = username;
    if (password) updates.password = password;
    if (profile_picture_url) updates.profile_picture_url = profile_picture_url;

    const updatedUser = await User.findOneAndUpdate(
      { username: currentUsername },
      updates,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({
      message: "Profile updated successfully",
      user: {
        username: updatedUser.username,
        coins: updatedUser.coins,
        profile_picture_url: updatedUser.profile_picture_url,
      },
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Server error." });
  }
});

export default router;
