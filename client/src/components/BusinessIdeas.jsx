import { useState } from "react";
import { generateBusinessIdea } from "../services/api.js";
import { saveHistoryItem } from "../services/storage.js";

export default function BusinessIdeas() {
  const [form, setForm] = useState({ budget: "", location: "", skills: "", mode: "Online", availableTime: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [idea, setIdea] = useState(null);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleGenerate() {
    if (!form.skills.trim() || loading) return;
    setLoading(true);
    setError(null);
    setIdea(null);
    try {
      const { idea: result } = await generateBusinessIdea(form);
      setIdea(result);
      saveHistoryItem({ title: result.businessName || "Business Idea", type: "business", data: result });
    } catch (err) {
      setError(err.message || "Failed to generate a business idea.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <h1>Business Idea Generator</h1>

      <label className="field-label">Budget</label>
      <input className="input" placeholder="e.g. $500" value={form.budget} onChange={(e) => update("budget", e.target.value)} />

      <label className="field-label">Location</label>
      <input className="input" placeholder="e.g. Mumbai, India" value={form.location} onChange={(e) => update("location", e.target.value)} />

      <label className="field-label">Skills</label>
      <input className="input" placeholder="e.g. cooking, design, sales" value={form.skills} onChange={(e) => update("skills", e.target.value)} />

      <label className="field-label">Online / Offline</label>
      <div className="chip-row">
        {["Online", "Offline", "Both"].map((m) => (
          <button key={m} className={`chip ${form.mode === m ? "active" : ""}`} onClick={() => update("mode", m)}>{m}</button>
        ))}
      </div>

      <label className="field-label">Available Time</label>
      <input className="input" placeholder="e.g. 2 hours/day" value={form.availableTime} onChange={(e) => update("availableTime", e.target.value)} />

      <div className="action-row">
        <button className="btn btn-primary" onClick={handleGenerate} disabled={loading || !form.skills.trim()}>
          {loading ? "Generating..." : "Generate Idea"}
        </button>
      </div>

      {error && <div className="notice notice-error">{error}</div>}

      {idea && (
        <div className="result-card">
          <h2>{idea.businessName}</h2>
          <p>{idea.description}</p>
          <dl className="detail-list">
            <dt>Starting cost</dt><dd>{idea.startingCost}</dd>
            <dt>Required skills</dt><dd>{(idea.requiredSkills || []).join(", ")}</dd>
            <dt>Target customers</dt><dd>{idea.targetCustomers}</dd>
            <dt>First customers strategy</dt><dd>{idea.firstCustomersStrategy}</dd>
            <dt>Revenue model</dt><dd>{idea.revenueModel}</dd>
          </dl>
          <h3>7-Day Action Plan</h3>
          <ol>
            {(idea.sevenDayActionPlan || []).map((step, i) => <li key={i}>{step}</li>)}
          </ol>
        </div>
      )}
    </div>
  );
}
