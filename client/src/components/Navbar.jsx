import { Link } from "react-router-dom";

export default function Navbar({ onNewChat, onSettings }) {
  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <span className="brand-mark">✦</span>
        <span className="brand-name">Smart Creator AI</span>
      </Link>
      <div className="navbar-actions">
        <button className="btn btn-ghost" onClick={onNewChat}>
          + New Chat
        </button>
        <button className="btn btn-icon" onClick={onSettings} aria-label="Settings">
          ⚙
        </button>
      </div>
    </header>
  );
}
