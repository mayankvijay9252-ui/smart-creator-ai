import { Router } from "express";
import { generateImage, ProviderNotConfiguredError } from "../providers/aiProvider.js";

const router = Router();

// POST /api/image
router.post("/", async (req, res) => {
  const { prompt, aspectRatio, style } = req.body || {};

  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ error: "A non-empty 'prompt' string is required." });
  }

  try {
    const result = await generateImage({ prompt, aspectRatio, style });
    return res.json(result);
  } catch (err) {
    if (err instanceof ProviderNotConfiguredError) {
      return res.status(503).json({
        error: "not_configured",
        message: "Image generation API is not configured yet."
      });
    }
    console.error("image route error:", err);
    return res.status(500).json({ error: "server_error", message: "Image generation failed. Please try again." });
  }
});

export default router;
