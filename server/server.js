import { Socket, Server } from "socket.io";
import http from "http";
import { app } from "./app.js";
import { config } from "dotenv";
import { maxAreaOfIsland } from "./utils/maxAreaOfIsland.js";
import User from "./models/User.js";
import Match from "./models/Match.js";
config({ path: "./config.env" });

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: false,
  },
});

let waitingQueue = [];
const activeGames = new Set();

io.on("connection", (socket) => {
  console.log("USER CONNECTED:", socket.id);

  socket.on("find_match", (data) => {
    console.log(`[${socket.id}] Match request from: ${data.username}`);

    if (waitingQueue.length > 0) {
      const opponent = waitingQueue.shift();
      const roomId = `${opponent.socketId}_${socket.id}`;
      const matchData = {
        player1: opponent.username,
        player2: data.username,
        roomId,
        colors: {
          [opponent.username]: "rgb(0, 122, 255)",
          [data.username]: "rgb(255, 69, 58)",
        },
      };

      io.to(opponent.socketId).emit("match_found", matchData);
      socket.emit("match_found", matchData);
      console.log(`MATCH MADE: ${opponent.username} vs ${data.username}`);
    } else {
      waitingQueue.push({
        username: data.username,
        socketId: socket.id,
      });
      console.log(`⏳ ${data.username} added to waiting queue.`);
    }
  });

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on("make_move", ({ roomId, index, color }) => {
    socket.to(roomId).emit("opponent_move", { index, color });
  });

  socket.on(
    "request_game_end",
    async ({ roomId, grid, user, myColor, opponentColor }) => {
      try {
        if (activeGames.has(roomId)) return;
        activeGames.add(roomId);

        const matrix = Array.from({ length: 5 }, (_, i) =>
          grid
            .slice(i * 5, i * 5 + 5)
            .map((cell) =>
              cell === myColor ? 1 : cell === opponentColor ? 2 : 0
            )
        );

        const area1 = maxAreaOfIsland(
          matrix.map((row) => row.map((cell) => (cell === 1 ? 1 : 0)))
        );
        const area2 = maxAreaOfIsland(
          matrix.map((row) => row.map((cell) => (cell === 2 ? 1 : 0)))
        );

        const roomSockets = await io.in(roomId).fetchSockets();
        const usernames = roomSockets.map(
          (s) => s.handshake.query.username || s.data?.username
        );

        const player1 = usernames.find((u) => u === user);
        const player2 = usernames.find((u) => u !== user);

        if (!player1 || !player2) return;

        const player1Data = await User.findOne({ username: player1 });
        const player2Data = await User.findOne({ username: player2 });

        if (!player1Data || !player2Data) return;

        let winner = null;
        let draw = false;

        if (area1 > area2) winner = player1;
        else if (area2 > area1) winner = player2;
        else draw = true;

        const coinUpdates = {};
        if (draw) {
          coinUpdates[player1] = player1Data.coins;
          coinUpdates[player2] = player2Data.coins;
        } else {
          coinUpdates[player1] =
            player1 === winner
              ? player1Data.coins + 200
              : Math.max(0, player1Data.coins - 200);
          coinUpdates[player2] =
            player2 === winner
              ? player2Data.coins + 200
              : Math.max(0, player2Data.coins - 200);
        }
        const match = await Match.create({
          player1,
          player2,
          winner: draw ? null : winner,
          grid,
        });
        await User.updateOne(
          { username: player1 },
          { coins: coinUpdates[player1] }
        );
        await User.updateOne(
          { username: player2 },
          { coins: coinUpdates[player2] }
        );

        io.to(roomId).emit("game_end", {
          winner: draw ? "draw" : winner,
          draw,
          coins: coinUpdates,
        });
      } catch (err) {
        console.error("Error in request_game_end:", err);
      }
    }
  );

  socket.on("forfeit_game", async ({ roomId, winner, loser, grid }) => {
    try {
      if (activeGames.has(roomId)) return;
      activeGames.add(roomId);

      const winnerData = await User.findOne({ username: winner });
      const loserData = await User.findOne({ username: loser });

      const updatedWinnerCoins = winnerData.coins + 200;
      const updatedLoserCoins = Math.max(0, loserData.coins - 200);

      await User.updateOne({ username: winner }, { coins: updatedWinnerCoins });
      await User.updateOne({ username: loser }, { coins: updatedLoserCoins });

      await Match.create({
        player1: winner,
        player2: loser,
        winner,
        grid, 
      });

      io.to(roomId).emit("game_end", {
        winner,
        draw: false,
        coins: {
          [winner]: updatedWinnerCoins,
          [loser]: updatedLoserCoins,
        },
      });

      console.log(`Game forfeited. ${winner} wins`);
    } catch (err) {
      console.error("Forfeit game error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED:", socket.id);
    waitingQueue = waitingQueue.filter((p) => p.socketId !== socket.id);
    console.log("🧹 Cleaned up disconnected user from waiting queue");
  });
});

server.listen(8000, () => {
  console.log("Server is running on port 8000");
});
