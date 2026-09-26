import { useEffect, useRef, useState } from "react";
import { sendChatMessage } from "../services/api.js";
import { saveHistoryItem } from "../services/storage.js";

function makeId() {
  return crypto.randomUUID();
}

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatId] = useState(() => makeId());
  const abortRef = useRef(null);
  const scrollRef = useRef(null);
  const lastUserMessageRef = useRef("");

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function runAssistant(historyForApi) {
    setLoading(true);
    setError(null);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const { reply } = await sendChatMessage(lastUserMessageRef.current, historyForApi, controller.signal);
      const aiMessage = { id: makeId(), role: "assistant", content: reply };
      setMessages((prev) => {
        const updated = [...prev, aiMessage];
        saveHistoryItem({
          id: chatId,
          title: prev[0]?.content?.slice(0, 40) || "New Chat",
          type: "chat",
          data: updated
        });
        return updated;
      });
    } catch (err) {
      if (err.name === "AbortError") {
        setError(null);
      } else {
        setError(err.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }

  function handleSend(e) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMessage = { id: makeId(), role: "user", content: text };
    const historyForApi = messages.map((m) => ({ role: m.role, content: m.content }));
    lastUserMessageRef.current = text;

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    runAssistant(historyForApi);
  }

  function handleRegenerate() {
    if (loading) return;
    const lastUserIdx = [...messages].reverse().findIndex((m) => m.role === "user");
    if (lastUserIdx === -1) return;
    const idx = messages.length - 1 - lastUserIdx;
    const trimmed = messages.slice(0, idx + 1);
    lastUserMessageRef.current = messages[idx].content;
    setMessages(trimmed);
    runAssistant(trimmed.slice(0, -1).map((m) => ({ role: m.role, content: m.content })));
  }

  function handleStop() {
    abortRef.current?.abort();
  }

  function handleCopy(content) {
    navigator.clipboard?.writeText(content);
  }

  function handleNewChat() {
    setMessages([]);
    setInput("");
    setError(null);
  }

  return (
    <div className="page chat-page">
      <div className="chat-header">
        <h1>AI Chat</h1>
        <button className="btn btn-ghost" onClick={handleNewChat}>New Chat</button>
      </div>

      <div className="chat-messages" ref={scrollRef}>
        {messages.length === 0 && !loading && (
          <p className="empty-state">Send a message to start chatting with Smart Creator AI.</p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`chat-bubble ${m.role}`}>
            <div className="chat-bubble-content">{m.content}</div>
            {m.role === "assistant" && (
              <div className="chat-bubble-actions">
                <button className="link-btn" onClick={() => handleCopy(m.content)}>Copy</button>
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="chat-bubble assistant">
            <div className="typing-indicator"><span /><span /><span /></div>
          </div>
        )}
        {error && (
          <div className="chat-error">
            <span>{error}</span>
            <button className="link-btn" onClick={handleRegenerate}>Retry</button>
          </div>
        )}
      </div>

      <form className="chat-input-bar" onSubmit={handleSend}>
        <input
          type="text"
          value={input}
          placeholder="Message Smart Creator AI..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) handleSend(e);
          }}
          disabled={loading}
        />
        {loading ? (
          <button type="button" className="btn btn-secondary" onClick={handleStop}>Stop</button>
        ) : (
          <button type="submit" className="btn btn-primary" disabled={!input.trim()}>Send</button>
        )}
        {!loading && messages.some((m) => m.role === "assistant") && (
          <button type="button" className="btn btn-ghost" onClick={handleRegenerate}>Regenerate</button>
        )}
      </form>
    </div>
  );
}
