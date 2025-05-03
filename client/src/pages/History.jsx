import "../styles/history.css";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function History() {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    fetch(`http://localhost:8000/api/history/${user.username}`)
      .then((res) => res.json())
      .then((data) => setHistory(data))
      .catch((err) => console.error("Failed to fetch history:", err))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <p>Loading history...</p>;
  if (!user) return null;

  return (
    <div className="history-wrapper">
      <Navbar />
      <main className="history-container">
        <h1 className="history-title">Your Game History</h1>
        <ul className="history-list">
          {history.length === 0 && <li>No past games found.</li>}
          {history.map((match) => (
            <li key={match.id} className="history-item">
              <Link to={`/history/game/${match.id}`}>
                Game #{match.id.slice(-4)} — {match.opponent} — {match.result}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
