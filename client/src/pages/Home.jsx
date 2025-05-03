import "../styles/home.css";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
export default function Home() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <Navbar />
      <main className="home-container">
        <h1 className="home-title">Main Dashboard</h1>

        <div className="home-buttons">
          <a href="./waiting" className="btn btn-primary">
            Play
          </a>
          <a href="./leaderboard" className="btn btn-secondary">
            Leaderboard
          </a>
          <a href="./history" className="btn btn-secondary">
            History
          </a>
        </div>
      </main>
    </div>
  );
}

// import "../styles/home.css";
// import Navbar from "../components/Navbar";
// import { useEffect, useState } from "react";

// export default function Home() {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   if (!user) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <div>
//       <Navbar />
//       <main className="home-container">
//         <h1 className="home-title">Main Dashboard</h1>
//         <p>Welcome, {user.username} 🎉</p>
//         <p>💰 Coins: {user.coins}</p>
//         {user.profile_picture_url && (
//           <img
//             src={user.profile_picture_url}
//             alt="Profile"
//             style={{
//               width: "100px",
//               borderRadius: "50%",
//               marginTop: "10px",
//             }}
//           />
//         )}
//         <div className="home-buttons">
//           <a href="/waiting" className="btn btn-primary">
//             Play
//           </a>
//           <a href="/leaderboard" className="btn btn-secondary">
//             Leaderboard
//           </a>
//           <a href="/history" className="btn btn-secondary">
//             History
//           </a>
//         </div>
//       </main>
//     </div>
//   );
// }
