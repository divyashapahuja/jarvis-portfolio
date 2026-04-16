"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated }),
      });
      const data = await res.json();
      if (data.error) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.error }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Connection error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
        style={{
          background: open
            ? "rgba(0,212,200,0.2)"
            : "rgba(0,212,200,0.1)",
          border: "1px solid rgba(0,212,200,0.4)",
          boxShadow: "0 0 20px rgba(0,212,200,0.15)",
        }}
        aria-label={open ? "Close chat" : "Open chat assistant"}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="var(--teal)" strokeWidth="1.5">
            <line x1="4" y1="4" x2="16" y2="16" />
            <line x1="16" y1="4" x2="4" y2="16" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" strokeDasharray="4 2" />
            <circle cx="12" cy="12" r="5" />
            <circle cx="12" cy="12" r="1.5" fill="var(--teal)" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[360px] max-h-[480px] flex flex-col"
          style={{
            background: "rgba(5,5,8,0.95)",
            border: "1px solid rgba(0,212,200,0.2)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Corner brackets */}
          <span className="absolute top-0 left-0 w-3 h-3 border-l border-t" style={{ borderColor: "var(--teal)" }} />
          <span className="absolute top-0 right-0 w-3 h-3 border-r border-t" style={{ borderColor: "var(--teal)" }} />
          <span className="absolute bottom-0 left-0 w-3 h-3 border-l border-b" style={{ borderColor: "var(--teal)" }} />
          <span className="absolute bottom-0 right-0 w-3 h-3 border-r border-b" style={{ borderColor: "var(--teal)" }} />

          {/* Header */}
          <div
            className="px-4 py-3 flex items-center gap-2"
            style={{ borderBottom: "1px solid rgba(0,212,200,0.15)" }}
          >
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: "var(--teal)", boxShadow: "0 0 8px rgba(0,212,200,0.5)" }}
            />
            <span
              className="text-[11px] tracking-[0.2em] uppercase text-neon/70"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              Portfolio Assistant
            </span>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[280px] max-h-[340px]">
            {messages.length === 0 && (
              <p
                className="text-center text-white/20 text-xs mt-16"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
              >
                Ask me anything about Jane&apos;s portfolio
              </p>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="max-w-[80%] px-3 py-2 text-xs leading-relaxed"
                  style={{
                    fontFamily: "IBM Plex Mono, monospace",
                    background:
                      msg.role === "user"
                        ? "rgba(0,212,200,0.12)"
                        : "rgba(255,255,255,0.04)",
                    border:
                      msg.role === "user"
                        ? "1px solid rgba(0,212,200,0.25)"
                        : "1px solid rgba(255,255,255,0.08)",
                    color: msg.role === "user" ? "var(--teal)" : "rgba(255,255,255,0.7)",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div
                  className="px-3 py-2 text-xs flex items-center gap-1"
                  style={{
                    fontFamily: "IBM Plex Mono, monospace",
                    color: "var(--teal)",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <span className="animate-pulse">●</span>
                  <span className="animate-pulse" style={{ animationDelay: "0.2s" }}>●</span>
                  <span className="animate-pulse" style={{ animationDelay: "0.4s" }}>●</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div
            className="flex items-center gap-2 px-3 py-2"
            style={{ borderTop: "1px solid rgba(0,212,200,0.15)" }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Type a message..."
              className="flex-1 bg-transparent text-xs text-white/80 placeholder-white/20 outline-none"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
              disabled={loading}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="text-neon/50 hover:text-neon transition-colors disabled:opacity-30"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 8h12M10 4l4 4-4 4" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
