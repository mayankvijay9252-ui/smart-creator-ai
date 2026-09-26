import { Router } from "express";
import { generateText, ProviderNotConfiguredError } from "../providers/aiProvider.js";

const router = Router();

// POST /api/chat
router.post("/", async (req, res) => {
  const { message, history } = req.body || {};

  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "A non-empty 'message' string is required." });
  }

  try {
    const reply = await generateText({
      prompt: message,
      system: "You are Smart Creator AI, a helpful, concise assistant inside a creator productivity app.",
      history: Array.isArray(history) ? history.slice(-20) : []
    });
    return res.json({ reply });
  } catch (err) {
    if (err instanceof ProviderNotConfiguredError) {
      return res.status(503).json({
        error: "not_configured",
        message: "AI chat provider is not configured yet. Add an API key in your .env file (see .env.example)."
      });
    }
    console.error("chat route error:", err);
    return res.status(500).json({ error: "server_error", message: "Failed to generate a reply. Please try again." });
  }
});

export default router;
