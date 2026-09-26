import { NavLink } from "react-router-dom";

const LINKS = [
  { to: "/", label: "Home", icon: "🏠", end: true },
  { to: "/chat", label: "AI Chat", icon: "💬" },
  { to: "/image", label: "AI Image", icon: "🖼" },
  { to: "/video", label: "AI Video", icon: "🎬" },
  { to: "/business", label: "Business Ideas", icon: "💡" },
  { to: "/content", label: "Content Creator", icon: "📝" },
  { to: "/voice", label: "Voice Assistant", icon: "🎙" },
  { to: "/resume", label: "Resume Maker", icon: "📄" },
  { to: "/coding", label: "Coding Assistant", icon: "💻" },
  { to: "/history", label: "History", icon: "🕒" },
  { to: "/settings", label: "Settings", icon: "⚙" }
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav>
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
          >
            <span className="sidebar-icon">{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
