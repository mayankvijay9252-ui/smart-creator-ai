import { Router } from "express";
import { generateText, ProviderNotConfiguredError } from "../providers/aiProvider.js";

const router = Router();

// POST /api/business-ideas
router.post("/", async (req, res) => {
  const { budget, location, skills, mode, availableTime } = req.body || {};

  if (!skills) {
    return res.status(400).json({ error: "'skills' is required." });
  }

  const prompt = `Generate ONE realistic small business idea as strict JSON (no markdown, no commentary) with this exact shape:
{
  "businessName": string,
  "description": string,
  "startingCost": string,
  "requiredSkills": string[],
  "targetCustomers": string,
  "firstCustomersStrategy": string,
  "revenueModel": string,
  "sevenDayActionPlan": string[7]
}
Constraints from the user:
- Budget: ${budget || "not specified"}
- Location: ${location || "not specified"}
- Skills: ${skills}
- Mode: ${mode || "either online or offline"}
- Available time per day: ${availableTime || "not specified"}`;

  try {
    const raw = await generateText({
      prompt,
      system: "You are a pragmatic small-business consultant. Always respond with valid JSON only."
    });
    let idea;
    try {
      idea = JSON.parse(raw.trim().replace(/^```json\s*|```$/g, ""));
    } catch {
      return res.status(502).json({ error: "parse_error", message: "The AI response could not be parsed.", raw });
    }
    return res.json({ idea });
  } catch (err) {
    if (err instanceof ProviderNotConfiguredError) {
      return res.status(503).json({ error: "not_configured", message: "AI provider is not configured yet." });
    }
    console.error("business route error:", err);
    return res.status(500).json({ error: "server_error", message: "Failed to generate a business idea." });
  }
});

export default router;
