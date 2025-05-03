import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/matchfound.css";

export default function MatchFound() {
  const [opponentData, setOpponentData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const match = JSON.parse(localStorage.getItem("match"));

    if (user && match) {
      const opponentName =
        match.player1 === user.username ? match.player2 : match.player1;

      fetch(`http://localhost:8000/api/user/${opponentName}`)
        .then((res) => res.json())
        .then((data) => setOpponentData(data));

      const timer = setTimeout(() => {
        navigate("/gameplay");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [navigate]);

  return (
    <div>
      <Navbar />
      <main className="found-container">
        <h1 className="found-title">Match Found!</h1>
        <div className="opponent-info">
          <img
            src={
              opponentData?.profile_picture_url ||
              "https://th.bing.com/th/id/OIP.eMLmzmhAqRMxUZad3zXE5QHaHa"
            }
            alt="Opponent Pic"
          />
          <p className="opponent-name">
            {opponentData?.username || "Loading..."}
          </p>
        </div>
        <p className="found-subtitle">Game is about to start…</p>
      </main>
    </div>
  );
}
