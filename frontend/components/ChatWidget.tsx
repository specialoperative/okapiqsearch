"use client";

import React, { useEffect, useRef, useState } from "react";

type ChatMessage = { id: string; role: "user" | "assistant"; content: string };

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "m0", role: "assistant", content: "Hi! Ask me to scan a market (e.g. 'scan San Francisco HVAC') or any Okapiq question." },
  ]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function sendMessage(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    const id = `u_${Date.now()}`;
    setMessages((m) => [...m, { id, role: "user", content: text }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { id: `a_${Date.now()}`, role: "assistant", content: data.reply || "(no reply)" }]);
    } catch (err) {
      setMessages((m) => [...m, { id: `a_err_${Date.now()}`, role: "assistant", content: "Sorry, something went wrong." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open && (
        <div className="mb-3 w-[320px] md:w-[380px] bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-4 py-3 bg-[#402f23] text-white flex items-center justify-between">
            <span className="font-semibold">Okapiq Assistant</span>
            <button aria-label="Close chat" onClick={() => setOpen(false)} className="text-white/80 hover:text-white">✕</button>
          </div>
          <div ref={listRef} className="max-h-[360px] overflow-auto p-3 space-y-2 bg-gray-50">
            {messages.map((m) => (
              <div key={m.id} className={`text-sm ${m.role === "user" ? "text-right" : "text-left"}`}>
                <div className={`inline-block px-3 py-2 rounded-lg ${m.role === "user" ? "bg-emerald-600 text-white" : "bg-white border"}`}>{m.content}</div>
              </div>
            ))}
            {loading && <div className="text-xs text-gray-500">Thinking…</div>}
          </div>
          <form onSubmit={sendMessage} className="p-3 border-t bg-white flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything…"
              className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Send</button>
          </form>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className="h-12 w-12 rounded-full shadow-lg bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700"
        aria-label="Open chat"
        title="Chat with Okapiq Assistant"
      >
        💬
      </button>
    </div>
  );
}


