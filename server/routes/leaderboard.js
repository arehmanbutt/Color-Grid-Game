// routes/leaderboard.js
import express from "express";
import User from "../models/User.js";
import Match from "../models/Match.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ coins: -1 });

    const leaderboard = await Promise.all(
      users.map(async (user) => {
        const matches = await Match.find({
          $or: [{ player1: user.username }, { player2: user.username }],
        });

        let won = 0,
          lost = 0,
          draw = 0;

        matches.forEach((m) => {
          if (!m.winner) draw++;
          else if (m.winner === user.username) won++;
          else lost++;
        });

        return {
          username: user.username,
          coins: user.coins,
          won,
          lost,
          draw,
        };
      })
    );

    res.json(leaderboard);
  } catch (err) {
    console.error("Leaderboard error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
