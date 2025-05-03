import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Welcome from "./pages/Welcome";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Leaderboard from "./pages/Leaderboard";
import UpdateProfile from "./pages/UpdateProfile";
import Gameplay from "./pages/Gameplay";
import History from "./pages/History";
import MatchFound from "./pages/MatchFound";
import History101 from "./pages/History101"; // this is actually the dynamic page
import Waiting from "./pages/Waiting";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={<Home />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/update-profile" element={<UpdateProfile />} />
      <Route path="/gameplay" element={<Gameplay />} />
      <Route path="/history" element={<History />} />
      <Route path="/history/game/:game_id" element={<History101 />} />{" "}
      {/* ✅ Correct route */}
      <Route path="/matchfound" element={<MatchFound />} />
      <Route path="/waiting" element={<Waiting />} />
      <Route path="/newgame/:gameId" element={<Gameplay />} />
    </Routes>
  );
}

export default App;
