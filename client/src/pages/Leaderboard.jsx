import Navbar from "../components/Navbar";
import "../styles/leaderboard.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Leaderboard() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPlayers, setFilteredPlayers] = useState([]);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch("http://localhost:8000/api/leaderboard");
        const data = await res.json();
        setPlayers(data);
        setFilteredPlayers(data);
      } catch (err) {
        console.error("Failed to fetch leaderboard", err);
      }
    }
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    const filtered = players.filter((p) =>
      p.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPlayers(filtered);
  }, [searchTerm, players]);

  return (
    <div>
      <Navbar />
      <main className="leaderboard-container">
        <h1 className="leaderboard-title">Top Players</h1>
        <input
          type="text"
          placeholder="Search by username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <ul className="leaderboard-list">
          {filteredPlayers.map((player, index) => (
            <li key={index}>
              #{index + 1} {player.username} {player.won}/{player.lost}/
              {player.draw} — {player.coins} coins
            </li>
          ))}
        </ul>
        <button className="btn btn-secondary" onClick={() => navigate("/home")}>
          Back to Home
        </button>
      </main>
    </div>
  );
}
