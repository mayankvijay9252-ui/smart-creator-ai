import { NavLink } from "react-router-dom";

const LINKS = [
  { to: "/", label: "Home", icon: "🏠", end: true },
  { to: "/chat", label: "Chat", icon: "💬" },
  { to: "/image", label: "Create", icon: "✨" },
  { to: "/history", label: "History", icon: "🕒" },
  { to: "/settings", label: "Settings", icon: "⚙" }
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Primary">
      {LINKS.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          className={({ isActive }) => "bottom-nav-link" + (isActive ? " active" : "")}
        >
          <span className="bottom-nav-icon">{link.icon}</span>
          <span className="bottom-nav-label">{link.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
