// server/providers/aiProvider.js

class ProviderNotConfiguredError extends Error {
  constructor(capability) {
    super(`No ${capability} provider is configured. Set the required API key in your .env file.`);
    this.name = "ProviderNotConfiguredError";
    this.capability = capability;
  }
}

export async function generateText({ prompt, system, history = [] }) {
  const provider = process.env.AI_PROVIDER;
  if (!provider || provider === "none") {
    throw new ProviderNotConfiguredError("text generation");
  }
  if (provider === "gemini") {
    if (!process.env.GEMINI_API_KEY) throw new ProviderNotConfiguredError("text generation (Gemini key missing)");
    const contents = [
      ...history.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
      { role: "user", parts: [{ text: prompt }] }
    ];
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          systemInstruction: system ? { parts: [{ text: system }] } : undefined
        })
      }
    );
    if (!res.ok) throw new Error(`Gemini API error: ${res.status} ${await res.text()}`);
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ?? "";
  }
  if (provider === "openai") {
    if (!process.env.OPENAI_API_KEY) throw new ProviderNotConfiguredError("text generation (OpenAI key missing)");
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          ...(system ? [{ role: "system", content: system }] : []),
          ...history.map((m) => ({ role: m.role, content: m.content })),
          { role: "user", content: prompt }
        ]
      })
    });
    if (!res.ok) throw new Error(`OpenAI API error: ${res.status} ${await res.text()}`);
    const data = await res.json();
    return data?.choices?.[0]?.message?.content ?? "";
  }
  if (provider === "anthropic") {
    if (!process.env.ANTHROPIC_API_KEY) throw new ProviderNotConfiguredError("text generation (Anthropic key missing)");
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1500,
        system,
        messages: [...history.map((m) => ({ role: m.role, content: m.content })), { role: "user", content: prompt }]
      })
    });
    if (!res.ok) throw new Error(`Anthropic API error: ${res.status} ${await res.text()}`);
    const data = await res.json();
    return data?.content?.map((c) => c.text || "").join("") ?? "";
  }
  throw new ProviderNotConfiguredError(`text generation (unknown provider "${provider}")`);
}

const IMAGE_DIMENSIONS = {
  "1:1": { width: 1024, height: 1024 },
  "16:9": { width: 1280, height: 720 },
  "9:16": { width: 720, height: 1280 }
};

export async function generateImage({ prompt, aspectRatio, style }) {
  const provider = process.env.IMAGE_PROVIDER || "pollinations";
  if (provider === "pollinations") {
    const dims = IMAGE_DIMENSIONS[aspectRatio] || IMAGE_DIMENSIONS["1:1"];
    const width = dims.width;
    const height = dims.height;
    const fullPrompt = style ? `${prompt}, ${style} style` : prompt;
    const seed = Math.floor(Math.random() * 1000000);
    const url = "https://image.pollinations.ai/prompt/" + encodeURIComponent(fullPrompt) + "?width=" + width + "&height=" + height + "&seed=" + seed + "&nologo=true";
    return { url };
  }
  if (provider === "none") {
    throw new ProviderNotConfiguredError("image generation");
  }
  throw new Error(`Image provider "${provider}" is set but not yet implemented in aiProvider.js.`);
}

export async function generateVideo({ prompt, aspectRatio, duration, style }) {
  const provider = process.env.VIDEO_PROVIDER;
  if (!provider || provider === "none" || !process.env.VIDEO_API_KEY) {
    throw new ProviderNotConfiguredError("video generation");
  }
  throw new Error(`Video provider "${provider}" is set but not yet implemented in aiProvider.js.`);
}

export { ProviderNotConfiguredError };
