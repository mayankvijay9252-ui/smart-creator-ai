import { Router } from "express";
import { generateText, ProviderNotConfiguredError } from "../providers/aiProvider.js";

const router = Router();

// POST /api/content
router.post("/", async (req, res) => {
  const { platform, topic, audience, tone, language } = req.body || {};

  if (!platform || !topic) {
    return res.status(400).json({ error: "'platform' and 'topic' are required." });
  }

  const prompt = `Create content for a "${platform}" post as strict JSON (no markdown, no commentary) with this exact shape:
{
  "hook": string,
  "script": string,
  "caption": string,
  "hashtags": string[],
  "callToAction": string
}
Topic: ${topic}
Audience: ${audience || "general audience"}
Tone: ${tone || "engaging"}
Language: ${language || "English"}`;

  try {
    const raw = await generateText({
      prompt,
      system: "You are a professional social media content strategist. Always respond with valid JSON only."
    });
    let content;
    try {
      content = JSON.parse(raw.trim().replace(/^```json\s*|```$/g, ""));
    } catch {
      return res.status(502).json({ error: "parse_error", message: "The AI response could not be parsed.", raw });
    }
    return res.json({ content });
  } catch (err) {
    if (err instanceof ProviderNotConfiguredError) {
      return res.status(503).json({ error: "not_configured", message: "AI provider is not configured yet." });
    }
    console.error("content route error:", err);
    return res.status(500).json({ error: "server_error", message: "Failed to generate content." });
  }
});

export default router;
