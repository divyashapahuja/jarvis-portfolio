"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { CSSProperties } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const FAB_STYLE: CSSProperties = {
  position: "fixed",
  bottom: "max(1.5rem, env(safe-area-inset-bottom, 0px))",
  right: "max(1.5rem, env(safe-area-inset-right, 0px))",
  zIndex: 999999,
  width: "3.5rem",
  height: "3.5rem",
  touchAction: "manipulation",
};

const PANEL_STYLE: CSSProperties = {
  position: "fixed",
  bottom: "max(6.5rem, calc(env(safe-area-inset-bottom, 0px) + 5rem))",
  right: "max(1.5rem, env(safe-area-inset-right, 0px))",
  zIndex: 999998,
  width: "min(360px, calc(100vw - 2rem))",
  maxHeight: "min(480px, calc(100vh - 7rem))",
  minHeight: "320px",
  display: "flex",
  flexDirection: "column",
};

/** Original HUD-style floating trigger icon (dashed orbit + core) */
function IconOriginalChatLogo() {
  return (
    <svg className="pointer-events-none" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="1.5" aria-hidden>
      <circle cx="12" cy="12" r="10" strokeDasharray="4 2" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" fill="var(--teal)" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg className="pointer-events-none" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="var(--teal)" strokeWidth="1.5" aria-hidden>
      <line x1="4" y1="4" x2="16" y2="16" />
      <line x1="16" y1="4" x2="4" y2="16" />
    </svg>
  );
}

function IconBot() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <rect x="4" y="8" width="16" height="12" rx="2" />
      <path d="M9 8V6a3 3 0 016 0v2" />
      <circle cx="9.5" cy="14" r="1" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="14" r="1" fill="currentColor" stroke="none" />
      <path d="M9 18h6" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20v-1a5 5 0 0110 0v1" />
    </svg>
  );
}

function IconSend() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M2 8h12M10 4l4 4-4 4" />
    </svg>
  );
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const toggle = useCallback(() => {
    setOpen((o) => !o);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
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
      <button
        type="button"
        data-lenis-prevent
        style={{
          ...FAB_STYLE,
          background: open ? "rgba(0,212,200,0.2)" : "rgba(0,212,200,0.1)",
          border: "1px solid rgba(0,212,200,0.4)",
          boxShadow: "0 0 20px rgba(0,212,200,0.2), 0 0 40px rgba(0,212,200,0.08)",
        }}
        className="rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110"
        aria-label={open ? "Close chat" : "Open chat assistant"}
        aria-expanded={open}
        onClick={toggle}
      >
        {open ? <IconClose /> : <IconOriginalChatLogo />}
      </button>

      <div
        data-lenis-prevent
        hidden={!open}
        className="holo-card holo-scanlines relative overflow-hidden rounded-lg flex"
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        aria-label="Portfolio assistant chat"
        style={{
          ...PANEL_STYLE,
          visibility: open ? "visible" : "hidden",
          pointerEvents: open ? "auto" : "none",
          backdropFilter: "blur(12px)",
          boxShadow: "var(--teal-glow), 0 25px 50px rgba(0,0,0,0.45)",
        }}
      >
        <span className="absolute top-0 left-0 w-3 h-3 border-l border-t pointer-events-none z-10" style={{ borderColor: "var(--teal)" }} />
        <span className="absolute top-0 right-0 w-3 h-3 border-r border-t pointer-events-none z-10" style={{ borderColor: "var(--teal)" }} />
        <span className="absolute bottom-0 left-0 w-3 h-3 border-l border-b pointer-events-none z-10" style={{ borderColor: "var(--teal)" }} />
        <span className="absolute bottom-0 right-0 w-3 h-3 border-r border-b pointer-events-none z-10" style={{ borderColor: "var(--teal)" }} />

        <div
          className="relative px-4 py-3 flex items-center gap-2 shrink-0"
          style={{ borderBottom: "1px solid rgba(0,212,200,0.15)" }}
        >
          <div
            className="w-2 h-2 rounded-full hud-blink shrink-0"
            style={{ background: "var(--teal)", boxShadow: "0 0 8px rgba(0,212,200,0.5)" }}
          />
          <span
            className="text-[11px] tracking-[0.2em] uppercase text-neon/70"
            style={{ fontFamily: "IBM Plex Mono, monospace" }}
          >
            Portfolio Assistant
          </span>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="min-h-[200px] max-h-[340px] flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
            {messages.length === 0 && !loading && (
              <p
                className="text-center text-white/25 text-xs mt-16 px-4"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
              >
                Ask me anything about Jane&apos;s portfolio
              </p>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 items-end ${msg.role === "user" ? "justify-end flex-row-reverse" : "justify-start"}`}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: "rgba(0,212,200,0.06)",
                    border: "1px solid rgba(0,212,200,0.25)",
                    color: "var(--teal)",
                  }}
                >
                  {msg.role === "assistant" ? <IconBot /> : <IconUser />}
                </div>
                <div
                  className="text-xs leading-relaxed max-w-[78%] px-3 py-2"
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
              <div className="flex gap-2 items-end">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: "rgba(0,212,200,0.06)",
                    border: "1px solid rgba(0,212,200,0.25)",
                    color: "var(--teal)",
                  }}
                >
                  <IconBot />
                </div>
                <div
                  className="px-3 py-2 text-xs flex items-center gap-1"
                  style={{
                    fontFamily: "IBM Plex Mono, monospace",
                    color: "var(--teal)",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <span className="animate-pulse">·</span>
                  <span className="animate-pulse" style={{ animationDelay: "0.2s" }}>
                    ·
                  </span>
                  <span className="animate-pulse" style={{ animationDelay: "0.4s" }}>
                    ·
                  </span>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div
            className="flex shrink-0 items-center gap-2 px-3 py-2"
            style={{ borderTop: "1px solid rgba(0,212,200,0.15)" }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Type a message..."
              className="flex-1 bg-transparent text-xs text-white/80 placeholder-white/20 outline-none rounded px-1 py-1 min-w-0"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
              disabled={loading}
            />
            <button
              type="button"
              onClick={send}
              disabled={loading || !input.trim()}
              className="text-neon/60 hover:text-neon transition-colors disabled:opacity-30 p-1 shrink-0"
              aria-label="Send message"
            >
              <IconSend />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
