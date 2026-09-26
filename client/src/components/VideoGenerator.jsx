import { useState } from "react";
import { generateVideo } from "../services/api.js";
import { saveHistoryItem } from "../services/storage.js";

const ASPECT_RATIOS = ["9:16", "16:9", "1:1"];
const DURATIONS = ["5 seconds", "10 seconds", "15 seconds"];
const STYLES = ["Realistic", "Cinematic", "Animation", "Product Advertisement", "Social Media Reel"];

export default function VideoGenerator() {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("9:16");
  const [duration, setDuration] = useState("5 seconds");
  const [style, setStyle] = useState("Realistic");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  async function handleGenerate() {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await generateVideo({ prompt, aspectRatio, duration, style });
      setResult(data);
    } catch (err) {
      setError(err.message || "Video generation failed.");
    } finally {
      setLoading(false);
    }
  }

  function handleSave() {
    if (result) saveHistoryItem({ title: prompt.slice(0, 40), type: "video", data: result });
  }

  function handleDownload() {
    if (!result?.url) return;
    const a = document.createElement("a");
    a.href = result.url;
    a.download = "smart-creator-ai-video";
    a.click();
  }

  return (
    <div className="page">
      <h1>AI Video Generator</h1>

      <label className="field-label">Prompt</label>
      <textarea
        className="textarea"
        rows={3}
        placeholder="Describe the video you want to create..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <label className="field-label">Aspect Ratio</label>
      <div className="chip-row">
        {ASPECT_RATIOS.map((r) => (
          <button key={r} className={`chip ${aspectRatio === r ? "active" : ""}`} onClick={() => setAspectRatio(r)}>{r}</button>
        ))}
      </div>

      <label className="field-label">Duration</label>
      <div className="chip-row">
        {DURATIONS.map((d) => (
          <button key={d} className={`chip ${duration === d ? "active" : ""}`} onClick={() => setDuration(d)}>{d}</button>
        ))}
      </div>

      <label className="field-label">Style</label>
      <div className="chip-row">
        {STYLES.map((s) => (
          <button key={s} className={`chip ${style === s ? "active" : ""}`} onClick={() => setStyle(s)}>{s}</button>
        ))}
      </div>

      <div className="action-row">
        <button className="btn btn-primary" onClick={handleGenerate} disabled={loading || !prompt.trim()}>
          {loading ? "Generating..." : "Generate"}
        </button>
        {result && (
          <>
            <button className="btn btn-ghost" onClick={handleDownload}>Download</button>
            <button className="btn btn-ghost" onClick={handleSave}>Save</button>
          </>
        )}
      </div>

      {error && (
        <div className="notice notice-warning">
          <strong>Video generation is not available yet.</strong>
          <p>{error}</p>
        </div>
      )}

      {result?.url && (
        <div className="result-preview">
          <video src={result.url} controls />
        </div>
      )}
    </div>
  );
}
