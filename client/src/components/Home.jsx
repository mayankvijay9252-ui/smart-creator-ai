import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { listHistory } from "../services/storage.js";

const FEATURES = [
  { to: "/chat", title: "AI Chat", desc: "Talk to your AI assistant", icon: "💬" },
  { to: "/image", title: "AI Image", desc: "Generate stunning visuals", icon: "🖼" },
  { to: "/video", title: "AI Video", desc: "Create short-form video", icon: "🎬" },
  { to: "/business", title: "Business Ideas", desc: "Find your next venture", icon: "💡" },
  { to: "/content", title: "Content Creator", desc: "Scripts, captions, hooks", icon: "📝" },
  { to: "/voice", title: "Voice Assistant", desc: "Speak, don't type", icon: "🎙" },
  { to: "/resume", title: "Resume Maker", desc: "Build a pro resume", icon: "📄" },
  { to: "/coding", title: "Coding Assistant", desc: "Write, fix, explain code", icon: "💻" }
];

export default function Home() {
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    setRecent(listHistory().slice(0, 5));
  }, []);

  return (
    <div className="page home-page">
      <section className="hero">
        <h1>Create anything with AI.</h1>
        <p>Chat, create images, generate content, build ideas and grow your business.</p>
      </section>

      <section className="feature-grid">
        {FEATURES.map((f) => (
          <Link to={f.to} className="feature-card" key={f.to}>
            <div className="feature-icon">{f.icon}</div>
            <div className="feature-title">{f.title}</div>
            <div className="feature-desc">{f.desc}</div>
          </Link>
        ))}
      </section>

      <section className="recent-projects">
        <h2>Recent Projects</h2>
        {recent.length === 0 ? (
          <p className="empty-state">Nothing yet — start with any tool above and it'll show up here.</p>
        ) : (
          <ul className="recent-list">
            {recent.map((item) => (
              <li key={item.id} className="recent-item">
                <span className="recent-title">{item.title}</span>
                <span className="recent-type">{item.type}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
