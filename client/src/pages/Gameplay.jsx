import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/gameplay.css";
import Navbar from "../components/Navbar";
import socket from "../utils/socket";

export default function Gameplay() {
  const [user, setUser] = useState(null);
  const [match, setMatch] = useState(null);
  const [grid, setGrid] = useState(Array(25).fill(null));
  const [myColor, setMyColor] = useState("");
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [selectedCells, setSelectedCells] = useState(new Set());
  const [status, setStatus] = useState("Waiting...");
  const [opponentUsername, setOpponentUsername] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [opponentData, setOpponentData] = useState(null);
  const [showPlayAgain, setShowPlayAgain] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedMatch = JSON.parse(localStorage.getItem("match"));

    if (storedUser && storedMatch) {
      const { username } = storedUser;
      const { player1, player2, colors, roomId } = storedMatch;

      const opponentName = player1 === username ? player2 : player1;

      setUser(storedUser);
      setMatch(storedMatch);
      setMyColor(colors[username]);
      setOpponentUsername(opponentName);

      fetch(`http://localhost:8000/api/user/${opponentName}`)
        .then((res) => res.json())
        .then((data) => {
          setOpponentData(data);
        });

      setIsMyTurn(player1 === username);
      setStatus(player1 === username ? "Your Turn" : "Opponent's Turn");

      socket.emit("join_room", roomId);

      socket.on("opponent_move", ({ index, color }) => {
        setGrid((prev) => {
          const newGrid = [...prev];
          newGrid[index] = color;
          return newGrid;
        });
        setSelectedCells((prev) => new Set(prev).add(index));
        setIsMyTurn(true);
        setStatus("Your Turn");
      });

      let autoRedirectTimer;

      socket.on("game_end", ({ winner, draw, coins }) => {
        setGameOver(true);

        if (draw) {
          setStatus("Draw");
        } else if (winner === username) {
          setStatus("You Won (+200 coins)");
        } else {
          setStatus("You Lost (-200 coins)");
        }

        const updatedUser = {
          ...storedUser,
          coins: coins[storedUser.username],
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        window.dispatchEvent(new Event("userUpdated"));
        setUser(updatedUser);
        setShowPlayAgain(true);

        autoRedirectTimer = setTimeout(() => {
          navigate("/home");
        }, 5000);
      });

      return () => {
        socket.off("opponent_move");
        socket.off("game_end");
        clearTimeout(autoRedirectTimer);
      };
    }

    return () => {
      socket.off("opponent_move");
    };
  }, [navigate]);
  const handleCellClick = (index) => {
    if (!isMyTurn || selectedCells.has(index) || gameOver) return;

    const newGrid = [...grid];
    newGrid[index] = myColor;
    const newSelected = new Set(selectedCells);
    newSelected.add(index);

    setGrid(newGrid);
    setSelectedCells(newSelected);
    setIsMyTurn(false);
    setStatus("Opponent's Turn");

    socket.emit("make_move", {
      roomId: match.roomId,
      index,
      color: myColor,
    });

    if (
      newSelected.size === 25 &&
      user &&
      match &&
      myColor &&
      opponentUsername
    ) {
      console.log("Submitting final grid to backend:", newGrid);
      socket.emit("request_game_end", {
        roomId: match.roomId,
        grid: newGrid,
        user: user.username,
        myColor,
        opponentColor: match.colors[opponentUsername],
      });
    }
  };

  const handleForfeit = () => {
    if (gameOver) return;

    const opponent =
      match.player1 === user.username ? match.player2 : match.player1;

    setGameOver(true);
    socket.emit("forfeit_game", {
      roomId: match.roomId,
      winner: opponent,
      loser: user.username,
      grid: grid, 
    });
    setStatus("You Lost (Forfeited!) (-200 coins)");

    localStorage.removeItem("match");
  };

  if (!user || !match || !opponentData) return <p>Loading...</p>;

  return (
    <div>
      <Navbar />
      <main className="game-container">
        <div className="players-header">
          <div className="player">
            <img
              src={
                user.profile_picture_url ||
                "https://th.bing.com/th/id/OIP.eMLmzmhAqRMxUZad3zXE5QHaHa"
              }
              alt="You"
              style={{ width: 100, height: 100 }}
            />
            <span>{user.username}</span>
          </div>
          <span className="vs">VS</span>
          <div className="player">
            <img
              src={
                opponentData?.profile_picture_url ||
                "https://th.bing.com/th/id/OIP.eMLmzmhAqRMxUZad3zXE5QHaHa"
              }
              alt="Opponent"
              style={{ width: 100, height: 100 }}
            />
            <span>{opponentUsername}</span>
          </div>
        </div>

        <div className="grid">
          {grid.map((color, index) => (
            <div
              key={index}
              className="cell"
              style={{
                backgroundColor: color || "white",
                cursor:
                  isMyTurn && !selectedCells.has(index)
                    ? "pointer"
                    : "not-allowed",
              }}
              onClick={() => handleCellClick(index)}
            />
          ))}
        </div>

        <div className="status-area">
          <p>
            Status: <span>{status}</span>
          </p>
          <button className="btn btn-secondary" onClick={handleForfeit}>
            Forfeit
          </button>
          {showPlayAgain && (
            <button
              className="btn btn-primary"
              onClick={() => {
                clearTimeout();
                localStorage.removeItem("match");
                navigate("/waiting");
              }}
            >
              Play Again
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
