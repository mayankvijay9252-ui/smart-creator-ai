import { useEffect, useState } from "react";
import { searchHistory, renameHistoryItem, deleteHistoryItem } from "../services/storage.js";

export default function History() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [openItem, setOpenItem] = useState(null);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  function refresh() {
    setItems(searchHistory(query));
  }

  useEffect(refresh, [query]);

  function handleDelete(id) {
    deleteHistoryItem(id);
    refresh();
    if (openItem?.id === id) setOpenItem(null);
  }

  function startRename(item) {
    setRenamingId(item.id);
    setRenameValue(item.title);
  }

  function confirmRename(id) {
    renameHistoryItem(id, renameValue.trim() || "Untitled");
    setRenamingId(null);
    refresh();
  }

  return (
    <div className="page">
      <h1>History</h1>

      <input
        className="input"
        placeholder="Search chats, content, projects..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {items.length === 0 ? (
        <p className="empty-state">No items found.</p>
      ) : (
        <ul className="history-list">
          {items.map((item) => (
            <li key={item.id} className="history-item">
              <div className="history-item-main" onClick={() => setOpenItem(item)}>
                {renamingId === item.id ? (
                  <input
                    className="input"
                    value={renameValue}
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={() => confirmRename(item.id)}
                    onKeyDown={(e) => e.key === "Enter" && confirmRename(item.id)}
                  />
                ) : (
                  <>
                    <span className="history-title">{item.title}</span>
                    <span className="history-meta">{item.type} · {new Date(item.date).toLocaleDateString()}</span>
                  </>
                )}
              </div>
              <div className="history-actions">
                <button className="link-btn" onClick={() => startRename(item)}>Rename</button>
                <button className="link-btn danger" onClick={() => handleDelete(item.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {openItem && (
        <div className="result-card">
          <h3>{openItem.title}</h3>
          <pre className="code-output">{JSON.stringify(openItem.data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
