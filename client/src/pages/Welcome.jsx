import "../styles/welcome.css";
export default function Welcome() {
  return (
    <main className="welcome-container">
      <h1 className="welcome-title">Welcome to ColorGrid</h1>
      <p className="welcome-subtitle">
        A real-time, multiplayer grid conquest game.
      </p>
      <div className="welcome-buttons">
        <a href="/login" className="btn btn-primary">
          Login
        </a>
        <a href="/signup" className="btn btn-secondary">
          Sign Up
        </a>
      </div>
    </main>
  );
}
