import Navbar from "../components/Navbar";
import "../styles/waiting.css";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
export default function Waiting() {
  const navigate = useNavigate();

  useEffect(() => {
    const socket = io("http://localhost:8000");

    const user = JSON.parse(localStorage.getItem("user"));
    socket.emit("find_match", { username: user.username });
    socket.on("match_found", (matchData) => {
      console.log("Match found!", matchData);
      localStorage.setItem("match", JSON.stringify(matchData));
      navigate("/matchfound");
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <div>
      <Navbar />
      <main className="waiting-container">
        <h1 className="waiting-title">Waiting for Opponent…</h1>
        <p className="waiting-subtitle">Matchmaking in progress</p>
        <a href="./home">
          <button id="cancelBtn" className="btn btn-secondary">
            Cancel
          </button>
        </a>
      </main>
    </div>
  );
}
