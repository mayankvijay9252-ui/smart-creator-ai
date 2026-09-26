import { useEffect, useRef, useState } from "react";
import { sendChatMessage } from "../services/api.js";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export default function VoiceAssistant() {
  const [supported] = useState(!!SpeechRecognition);
  const [listening, setListening] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);
  const lastResultRef = useRef(""); // guards against duplicate final results
  const processedIndexRef = useRef(0);

  useEffect(() => {
    if (!supported) return;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      // Only process NEW results since last processed index — avoids duplicates.
      for (let i = processedIndexRef.current; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          const transcript = result[0].transcript.trim();
          if (transcript && transcript !== lastResultRef.current) {
            lastResultRef.current = transcript;
            handleUserSpeech(transcript);
          }
        }
      }
      processedIndexRef.current = event.results.length;
    };

    recognition.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "permission-denied") {
        setPermissionDenied(true);
      }
      setListening(false);
    };

    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;

    return () => recognition.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supported]);

  async function handleUserSpeech(transcript) {
    // One spoken sentence -> exactly one user message + one AI reply.
    const userMessage = { id: crypto.randomUUID(), role: "user", content: transcript };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setError(null);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const { reply } = await sendChatMessage(transcript, history);
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", content: reply }]);
      speak(reply);
    } catch (err) {
      setError(err.message || "Failed to get a response.");
    } finally {
      setLoading(false);
    }
  }

  function speak(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  }

  function startListening() {
    if (!supported || listening) return;
    // Permission is requested only here, on explicit user press.
    processedIndexRef.current = 0;
    lastResultRef.current = "";
    try {
      recognitionRef.current.start();
      setListening(true);
      setPermissionDenied(false);
    } catch {
      // start() throws if already started — ignore.
    }
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setListening(false);
  }

  if (!supported) {
    return (
      <div className="page">
        <h1>Voice Assistant</h1>
        <div className="notice notice-warning">
          Your browser does not support speech recognition. Try Chrome on Android or desktop.
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Voice Assistant</h1>

      <div className="mic-area">
        <button
          className={`mic-button ${listening ? "listening" : ""}`}
          onClick={listening ? stopListening : startListening}
          aria-label={listening ? "Stop recording" : "Start recording"}
        >
          {listening ? "⏹" : "🎙"}
        </button>
        <p className="mic-hint">{listening ? "Listening... tap to stop" : "Tap the microphone to speak"}</p>
      </div>

      {permissionDenied && (
        <div className="notice notice-warning">
          Microphone access was denied. Please allow microphone permission for this site in your browser
          settings, then tap the microphone again.
        </div>
      )}

      {error && <div className="notice notice-error">{error}</div>}

      <div className="chat-messages voice-transcript">
        {messages.map((m) => (
          <div key={m.id} className={`chat-bubble ${m.role}`}>
            <div className="chat-bubble-content">{m.content}</div>
          </div>
        ))}
        {loading && (
          <div className="chat-bubble assistant">
            <div className="typing-indicator"><span /><span /><span /></div>
          </div>
        )}
      </div>
    </div>
  );
}
