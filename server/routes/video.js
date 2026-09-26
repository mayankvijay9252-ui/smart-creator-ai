import { Router } from "express";
import { generateVideo, ProviderNotConfiguredError } from "../providers/aiProvider.js";

const router = Router();

// POST /api/video
router.post("/", async (req, res) => {
  const { prompt, aspectRatio, duration, style } = req.body || {};

  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ error: "A non-empty 'prompt' string is required." });
  }

  try {
    const result = await generateVideo({ prompt, aspectRatio, duration, style });
    return res.json(result);
  } catch (err) {
    if (err instanceof ProviderNotConfiguredError) {
      return res.status(503).json({
        error: "not_configured",
        message: "A video-generation provider must be connected before videos can be created. Add VIDEO_PROVIDER and VIDEO_API_KEY in your .env file."
      });
    }
    console.error("video route error:", err);
    return res.status(500).json({ error: "server_error", message: "Video generation failed. Please try again." });
  }
});

export default router;
