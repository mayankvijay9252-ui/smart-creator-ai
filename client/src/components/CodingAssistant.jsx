import { useState } from "react";
import { runCodeAssistant } from "../services/api.js";
import { saveHistoryItem } from "../services/storage.js";

const ACTIONS = ["generate", "explain", "fix", "improve"];
const LANGUAGES = ["JavaScript", "Python", "HTML", "CSS", "Java", "Kotlin", "C++", "SQL"];

export default function CodingAssistant() {
  const [action, setAction] = useState("generate");
  const [language, setLanguage] = useState("JavaScript");
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleRun() {
    if (!input.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult("");
    try {
      const { result: output } = await runCodeAssistant({ action, language, input });
      setResult(output);
      saveHistoryItem({ title: `${action} (${language})`, type: "code", data: output });
    } catch (err) {
      setError(err.message || "Request failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <h1>Coding Assistant</h1>

      <label className="field-label">Action</label>
      <div className="chip-row">
        {ACTIONS.map((a) => (
          <button key={a} className={`chip ${action === a ? "active" : ""}`} onClick={() => setAction(a)}>
            {a[0].toUpperCase() + a.slice(1)}
          </button>
        ))}
      </div>

      <label className="field-label">Language</label>
      <div className="chip-row">
        {LANGUAGES.map((l) => (
          <button key={l} className={`chip ${language === l ? "active" : ""}`} onClick={() => setLanguage(l)}>{l}</button>
        ))}
      </div>

      <label className="field-label">
        {action === "generate" ? "Describe what to build" : "Paste your code"}
      </label>
      <textarea className="textarea code-textarea" rows={8} value={input} onChange={(e) => setInput(e.target.value)} />

      <div className="action-row">
        <button className="btn btn-primary" onClick={handleRun} disabled={loading || !input.trim()}>
          {loading ? "Working..." : "Run"}
        </button>
      </div>

      {error && <div className="notice notice-error">{error}</div>}

      {result && <pre className="result-card code-output">{result}</pre>}
    </div>
  );
}
