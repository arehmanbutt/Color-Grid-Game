import "../styles/Signup.css";
import { useState } from "react";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevents page from reloading

    try {
      const res = await fetch("http://localhost:8000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          profile_picture_url: profilePic,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Signup successful!");
      } else {
        alert(data.message || "Signup failed.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <main className="auth-container">
      <h1 className="auth-title">Sign Up</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label htmlFor="profilePic">Profile Picture URL (optional)</label>
        <input
          id="profilePic"
          name="profilePic"
          type="url"
          value={profilePic}
          onChange={(e) => setProfilePic(e.target.value)}
        />

        <button type="submit" className="btn btn-primary">
          Create Account
        </button>
      </form>

      <p className="auth-footer">
        Already have an account? <a href="/login">Log In</a>
      </p>
    </main>
  );
}
