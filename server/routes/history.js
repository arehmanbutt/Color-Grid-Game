import express from "express";
import Match from "../models/Match.js";

const router = express.Router();

router.get("/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const matches = await Match.find({
      $or: [{ player1: username }, { player2: username }],
    }).sort({ createdAt: -1 });

    const history = matches.map((match) => {
      const opponent =
        match.player1 === username ? match.player2 : match.player1;
      let result = "Draw";
      if (match.winner === username) result = "Won";
      else if (match.winner && match.winner !== username) result = "Lost";

      return {
        id: match._id,
        opponent,
        result,
        date: match.createdAt,
      };
    });

    res.json(history);
  } catch (err) {
    console.error("Failed to fetch match history:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/game/:id", async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    console.log(match);
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }
    res.json(match);
  } catch (err) {
    console.error("Error fetching match:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
