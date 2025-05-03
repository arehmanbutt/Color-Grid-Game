import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/update-profile.css";

export default function UpdateProfile() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [username, setUsername] = useState(currentUser.username);
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState(currentUser.profile_picture_url);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updates = {};
    if (username !== currentUser.username) updates.username = username;
    if (password) updates.password = password;
    if (profilePic !== currentUser.profile_picture_url)
      updates.profile_picture_url = profilePic;

    try {
      const res = await fetch(
        `http://localhost:8000/api/user/${currentUser.username}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        }
      );

      if (res.ok) {
        const updatedUser = await res.json();
        localStorage.setItem("user", JSON.stringify(updatedUser));
        window.dispatchEvent(new Event("userUpdated"));
        alert("Profile updated!");
        navigate("/home");
      } else {
        const data = await res.json();
        alert(data.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while updating profile.");
    }
  };

  return (
    <div>
      <Navbar />
      <main className="update-container">
        <h1 className="update-title">Update Profile</h1>
        <form className="update-form" onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label htmlFor="password">New Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Leave blank to keep old password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <label htmlFor="profilePic">Profile Picture URL</label>
          <input
            id="profilePic"
            name="profilePic"
            type="url"
            value={profilePic}
            onChange={(e) => setProfilePic(e.target.value)}
          />

          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
        </form>
      </main>
    </div>
  );
}
