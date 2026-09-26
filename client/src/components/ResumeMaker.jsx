import { useState } from "react";
import { sendChatMessage } from "../services/api.js";
import { saveHistoryItem } from "../services/storage.js";

const FIELDS = [
  ["name", "Name"],
  ["phone", "Phone"],
  ["email", "Email"],
  ["education", "Education"],
  ["skills", "Skills"],
  ["experience", "Experience"],
  ["projects", "Projects"],
  ["certificates", "Certificates"],
  ["objective", "Career Objective"]
];

export default function ResumeMaker() {
  const [form, setForm] = useState(Object.fromEntries(FIELDS.map(([key]) => [key, ""])));
  const [resume, setResume] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleGenerate() {
    if (!form.name.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const prompt = `Create a clean, professional plain-text resume using this information:\n${FIELDS.map(
        ([key, label]) => `${label}: ${form[key] || "-"}`
      ).join("\n")}\n\nFormat it with clear section headings and bullet points, ready to copy into a document.`;
      const { reply } = await sendChatMessage(prompt, []);
      setResume(reply);
      saveHistoryItem({ title: `${form.name}'s Resume`, type: "resume", data: reply });
    } catch (err) {
      setError(err.message || "Failed to generate resume.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    navigator.clipboard?.writeText(resume);
  }

  function handleDownload() {
    const blob = new Blob([resume], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form.name || "resume"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleSave() {
    if (resume) saveHistoryItem({ title: `${form.name}'s Resume`, type: "resume", data: resume });
  }

  return (
    <div className="page">
      <h1>Resume Maker</h1>

      {FIELDS.map(([key, label]) => (
        <div key={key}>
          <label className="field-label">{label}</label>
          {key === "experience" || key === "projects" || key === "objective" ? (
            <textarea className="textarea" rows={2} value={form[key]} onChange={(e) => update(key, e.target.value)} />
          ) : (
            <input className="input" value={form[key]} onChange={(e) => update(key, e.target.value)} />
          )}
        </div>
      ))}

      <div className="action-row">
        <button className="btn btn-primary" onClick={handleGenerate} disabled={loading || !form.name.trim()}>
          {loading ? "Generating..." : "Generate"}
        </button>
        {resume && (
          <>
            <button className="btn btn-ghost" onClick={() => setEditing((e) => !e)}>{editing ? "Preview" : "Edit"}</button>
            <button className="btn btn-ghost" onClick={handleCopy}>Copy</button>
            <button className="btn btn-ghost" onClick={handleDownload}>Download</button>
            <button className="btn btn-ghost" onClick={handleSave}>Save</button>
          </>
        )}
      </div>

      {error && <div className="notice notice-error">{error}</div>}

      {resume && (
        editing ? (
          <textarea className="textarea resume-preview" rows={20} value={resume} onChange={(e) => setResume(e.target.value)} />
        ) : (
          <pre className="result-card resume-preview">{resume}</pre>
        )
      )}
    </div>
  );
}
