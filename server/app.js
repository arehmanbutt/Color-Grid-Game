import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
export const app = express();
import { config } from "dotenv";
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
import mongoose from "mongoose";
config({
  path: "./config.env",
});
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));
app.use("/api", authRoutes);
import historyRoutes from "./routes/history.js";
app.use("/api/history", historyRoutes);

import userRoutes from "./routes/auth.js";
app.use("/api", userRoutes);
import leaderboardRoutes from "./routes/leaderboard.js";
app.use("/api/leaderboard", leaderboardRoutes);
