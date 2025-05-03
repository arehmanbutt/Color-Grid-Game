import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    player1: String,
    player2: String,
    winner: { type: String, default: null },
    grid: [String], 
  },
  { timestamps: true }
);

export default mongoose.model("Match", matchSchema);
