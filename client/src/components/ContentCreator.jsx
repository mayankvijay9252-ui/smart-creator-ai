import { useState } from "react";
import { generateContent } from "../services/api.js";
import { saveHistoryItem } from "../services/storage.js";

const PLATFORMS = [
  "Instagram Reel",
  "YouTube Video",
  "YouTube Short",
  "Facebook Post",
  "WhatsApp Advertisement",
  "Product Advertisement"
];

export default function ContentCreator() {
  const [platform, setPlatform] = useState(PLATFORMS[0]);
  const [form, setForm] = useState({ topic: "", audience: "", tone: "", language: "English" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [content, setContent] = useState(null);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleGenerate() {
    if (!form.topic.trim() || loading) return;
    setLoading(true);
    setError(null);
    setContent(null);
    try {
      const { content: result } = await generateContent({ platform, ...form });
      setContent(result);
      saveHistoryItem({ title: form.topic.slice(0, 40), type: "content", data: result });
    } catch (err) {
      setError(err.message || "Failed to generate content.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <h1>Content Creator</h1>

      <label className="field-label">Platform</label>
      <div className="chip-row">
        {PLATFORMS.map((p) => (
          <button key={p} className={`chip ${platform === p ? "active" : ""}`} onClick={() => setPlatform(p)}>{p}</button>
        ))}
      </div>

      <label className="field-label">Topic</label>
      <input className="input" placeholder="What's this about?" value={form.topic} onChange={(e) => update("topic", e.target.value)} />

      <label className="field-label">Audience</label>
      <input className="input" placeholder="e.g. young professionals" value={form.audience} onChange={(e) => update("audience", e.target.value)} />

      <label className="field-label">Tone</label>
      <input className="input" placeholder="e.g. fun, professional, bold" value={form.tone} onChange={(e) => update("tone", e.target.value)} />

      <label className="field-label">Language</label>
      <input className="input" value={form.language} onChange={(e) => update("language", e.target.value)} />

      <div className="action-row">
        <button className="btn btn-primary" onClick={handleGenerate} disabled={loading || !form.topic.trim()}>
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {error && <div className="notice notice-error">{error}</div>}

      {content && (
        <div className="result-card">
          <h3>Hook</h3><p>{content.hook}</p>
          <h3>Script</h3><p style={{ whiteSpace: "pre-wrap" }}>{content.script}</p>
          <h3>Caption</h3><p>{content.caption}</p>
          <h3>Hashtags</h3><p>{(content.hashtags || []).join(" ")}</p>
          <h3>Call to Action</h3><p>{content.callToAction}</p>
        </div>
      )}
    </div>
  );
}
