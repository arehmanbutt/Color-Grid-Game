import "../styles/history-detail.css";
import Navbar from "../components/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function HistoryDetail() {
  const { game_id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [match, setMatch] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
      return;
    }
    setUser(storedUser);
  }, [navigate]);

  useEffect(() => {
    fetch(`http://localhost:8000/api/history/game/${game_id}`)
      .then((res) => res.json())
      .then((data) => setMatch(data))
      .catch((err) => {
        console.error("Failed to load match:", err);
        navigate("/history");
      });
  }, [game_id, navigate]);

  if (!user || !match) return <p>Loading game snapshot...</p>;

  const opponent =
    match.player1 === user.username ? match.player2 : match.player1;

  let result = "Draw";
  if (match.winner === user.username) result = "You Won!";
  else if (match.winner && match.winner !== user.username) result = "You Lost.";

  return (
    <div>
      <Navbar />
      <main className="snapshot-container">
        <h1 className="snapshot-title">
          Game #{match._id.slice(-4)} Result:{" "}
          <span
            className={`result ${
              result.includes("Won")
                ? "won"
                : result.includes("Lost")
                ? "lost"
                : "draw"
            }`}
          >
            {result}
          </span>
        </h1>
        <div className="grid">
          {match.grid?.map((cell, i) => (
            <div
              key={i}
              className="cell"
              style={{
                backgroundColor: cell || "white",
              }}
            />
          ))}
        </div>
        <a href="/history" className="btn btn-secondary">
          Back to History
        </a>
      </main>
    </div>
  );
}
