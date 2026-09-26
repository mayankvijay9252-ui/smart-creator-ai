const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

async function request(path, options = {}) {
  const res = await fetch(API_BASE + "/api" + path, {
    headers: { "Content-Type": "application/json" },
    ...options
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no JSON body
  }

  if (!res.ok) {
    const message = data?.message || data?.error || `Request failed with status ${res.status}`;
    const error = new Error(message);
    error.status = res.status;
    error.code = data?.error;
    throw error;
  }

  return data;
}

export function sendChatMessage(message, history = [], signal) {
  return request("/chat", { method: "POST", body: JSON.stringify({ message, history }), signal });
}

export function generateImage({ prompt, aspectRatio, style }) {
  return request("/image", { method: "POST", body: JSON.stringify({ prompt, aspectRatio, style }) });
}

export function generateVideo({ prompt, aspectRatio, duration, style }) {
  return request("/video", { method: "POST", body: JSON.stringify({ prompt, aspectRatio, duration, style }) });
}

export function generateBusinessIdea(payload) {
  return request("/business-ideas", { method: "POST", body: JSON.stringify(payload) });
}

export function generateContent(payload) {
  return request("/content", { method: "POST", body: JSON.stringify(payload) });
}

export function runCodeAssistant(payload) {
  return request("/code", { method: "POST", body: JSON.stringify(payload) });
}
