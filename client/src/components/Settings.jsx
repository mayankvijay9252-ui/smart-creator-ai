import { useState } from "react";
import { getSettings, saveSettings } from "../services/storage.js";

export default function Settings({ theme, onToggleTheme }) {
  const [settings, setSettings] = useState(getSettings());

  function update(field, value) {
    const next = { ...settings, [field]: value };
    setSettings(next);
    saveSettings(next);
  }

  return (
    <div className="page settings-page">
      <h1>Settings</h1>

      <section className="settings-section">
        <h2>Profile</h2>
        <input
          className="input"
          placeholder="Your name"
          value={settings.name || ""}
          onChange={(e) => update("name", e.target.value)}
        />
      </section>

      <section className="settings-section">
        <h2>Appearance</h2>
        <div className="setting-row">
          <span>Theme</span>
          <button className="btn btn-ghost" onClick={onToggleTheme}>
            {theme === "dark" ? "Switch to Light" : "Switch to Dark"}
          </button>
        </div>
      </section>

      <section className="settings-section">
        <h2>Language</h2>
        <input className="input" value={settings.language || ""} onChange={(e) => update("language", e.target.value)} />
      </section>

      <section className="settings-section">
        <h2>Voice Settings</h2>
        <label className="setting-row">
          <span>Enable voice replies</span>
          <input
            type="checkbox"
            checked={!!settings.voiceEnabled}
            onChange={(e) => update("voiceEnabled", e.target.checked)}
          />
        </label>
      </section>

      <section className="settings-section">
        <h2>AI Provider Settings</h2>
        <p className="empty-state">
          The active text provider is <strong>{settings.aiProvider || "none"}</strong>. Configure providers
          via the <code>AI_PROVIDER</code>, <code>IMAGE_PROVIDER</code> and <code>VIDEO_PROVIDER</code>
          variables in your server's <code>.env</code> file.
        </p>
      </section>

      <section className="settings-section">
        <h2>Usage / Credits</h2>
        <p className="empty-state">Usage tracking depends on your connected AI provider's dashboard.</p>
      </section>

      <section className="settings-section">
        <h2>Privacy</h2>
        <p className="empty-state">
          Chats and generated content are stored only in this browser's local storage until you connect a
          database.
        </p>
      </section>

      <section className="settings-section">
        <h2>Help &amp; About</h2>
        <p className="empty-state">Smart Creator AI — Chat. Create. Build. Grow.</p>
      </section>
    </div>
  );
}
