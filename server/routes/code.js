import { Router } from "express";
import { generateText, ProviderNotConfiguredError } from "../providers/aiProvider.js";

const router = Router();

const ACTIONS = {
  generate: (language, input) => `Write ${language} code for the following request:\n${input}\n\nReturn the code in a single fenced code block, with a short explanation after it.`,
  explain: (language, input) => `Explain what the following ${language} code does, step by step:\n\n${input}`,
  fix: (language, input) => `Find and fix the bug(s) in this ${language} code. Return the corrected code in a fenced code block, then list what was wrong:\n\n${input}`,
  improve: (language, input) => `Improve and refactor this ${language} code for readability and performance. Return the improved code in a fenced code block, then list the changes made:\n\n${input}`
};

// POST /api/code
router.post("/", async (req, res) => {
  const { action, language, input } = req.body || {};

  if (!action || !ACTIONS[action]) {
    return res.status(400).json({ error: `'action' must be one of: ${Object.keys(ACTIONS).join(", ")}` });
  }
  if (!input || !input.trim()) {
    return res.status(400).json({ error: "'input' is required." });
  }

  try {
    const result = await generateText({
      prompt: ACTIONS[action](language || "JavaScript", input),
      system: "You are an expert software engineer and coding assistant."
    });
    return res.json({ result });
  } catch (err) {
    if (err instanceof ProviderNotConfiguredError) {
      return res.status(503).json({ error: "not_configured", message: "AI provider is not configured yet." });
    }
    console.error("code route error:", err);
    return res.status(500).json({ error: "server_error", message: "Failed to process the code request." });
  }
});

export default router;
