import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user"));
  });

  useEffect(() => {
    const syncUser = () => {
      const updatedUser = JSON.parse(localStorage.getItem("user"));
      setUser(updatedUser);
      console.log("Navbar user:", user);
    };
    window.addEventListener("userUpdated", syncUser);
    syncUser();

    return () => {
      window.removeEventListener("userUpdated", syncUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="navbar">
      <a href="./home" className="nav-logo">
        🎨 ColorGrid
      </a>
      {user && (
        <div className="nav-right">
          <span className="coins">
            💰 <span id="coinBalance">{user.coins}</span>
          </span>
          <div className="profile-dropdown">
            <img
              src={
                user.profile_picture_url ||
                "https://th.bing.com/th/id/OIP.eMLmzmhAqRMxUZad3zXE5QHaHa"
              }
              alt="Profile"
              className="profile-pic"
            />
            <span className="username">{user.username}</span>
            <div className="dropdown-menu">
              <a href="./update-profile">Update Profile</a>
              <a href="./welcome" onClick={handleLogout}>
                Logout
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
