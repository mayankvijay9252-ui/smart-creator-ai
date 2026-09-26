import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import BottomNav from "./components/BottomNav.jsx";
import Home from "./components/Home.jsx";
import Chat from "./components/Chat.jsx";
import ImageGenerator from "./components/ImageGenerator.jsx";
import VideoGenerator from "./components/VideoGenerator.jsx";
import BusinessIdeas from "./components/BusinessIdeas.jsx";
import ContentCreator from "./components/ContentCreator.jsx";
import VoiceAssistant from "./components/VoiceAssistant.jsx";
import ResumeMaker from "./components/ResumeMaker.jsx";
import CodingAssistant from "./components/CodingAssistant.jsx";
import History from "./components/History.jsx";
import Settings from "./components/Settings.jsx";
import { getSettings, saveSettings } from "./services/storage.js";

export default function App() {
  const [theme, setTheme] = useState(() => getSettings().theme || "dark");
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    const settings = getSettings();
    saveSettings({ ...settings, theme });
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <div className="app-shell">
      <Navbar
        onNewChat={() => navigate("/chat")}
        onSettings={() => navigate("/settings")}
      />
      <div className="app-body">
        <Sidebar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/image" element={<ImageGenerator />} />
            <Route path="/video" element={<VideoGenerator />} />
            <Route path="/business" element={<BusinessIdeas />} />
            <Route path="/content" element={<ContentCreator />} />
            <Route path="/voice" element={<VoiceAssistant />} />
            <Route path="/resume" element={<ResumeMaker />} />
            <Route path="/coding" element={<CodingAssistant />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings theme={theme} onToggleTheme={toggleTheme} />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
