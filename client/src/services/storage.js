// client/src/services/storage.js
//
// A tiny storage abstraction. Today it's backed by localStorage so the
// app works fully offline with no database. To move to Firebase/Supabase
// later, reimplement the functions in this file only — nothing else in
// the app needs to change.

const HISTORY_KEY = "sca_history_items";
const SETTINGS_KEY = "sca_settings";

function readAll() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(items) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
}

export function listHistory() {
  return readAll().sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function saveHistoryItem({ id, title, type, data }) {
  const items = readAll();
  const existingIndex = items.findIndex((i) => i.id === id);
  const item = {
    id: id || crypto.randomUUID(),
    title: title || "Untitled",
    type: type || "chat",
    date: new Date().toISOString(),
    data: data ?? null
  };
  if (existingIndex >= 0) {
    items[existingIndex] = { ...items[existingIndex], ...item };
  } else {
    items.push(item);
  }
  writeAll(items);
  return item;
}

export function renameHistoryItem(id, title) {
  const items = readAll();
  const idx = items.findIndex((i) => i.id === id);
  if (idx >= 0) {
    items[idx].title = title;
    writeAll(items);
  }
}

export function deleteHistoryItem(id) {
  writeAll(readAll().filter((i) => i.id !== id));
}

export function searchHistory(query) {
  const q = query.trim().toLowerCase();
  if (!q) return listHistory();
  return listHistory().filter(
    (i) => i.title.toLowerCase().includes(q) || i.type.toLowerCase().includes(q)
  );
}

export function getSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw
      ? JSON.parse(raw)
      : {
          theme: "dark",
          language: "English",
          voiceEnabled: true,
          aiProvider: "none"
        };
  } catch {
    return { theme: "dark", language: "English", voiceEnabled: true, aiProvider: "none" };
  }
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
