"use client";

import React from "react";

export default function KnowledgePage() {
  const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, "");
  const [q, setQ] = React.useState("");
  const [results, setResults] = React.useState<any[]>([]);
  const [ingestUrl, setIngestUrl] = React.useState("");
  const [ingestRepo, setIngestRepo] = React.useState("");
  const [ingestWiki, setIngestWiki] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const search = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!q) return;
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/knowledge/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data);
    } finally {
      setLoading(false);
    }
  };

  const doIngest = async (type: 'web'|'github'|'wiki') => {
    let url = '';
    let options: RequestInit = { method: 'POST' } as any;
    if (type === 'web' && ingestUrl) {
      url = `${apiBase}/knowledge/ingest/web?url=${encodeURIComponent(ingestUrl)}`;
    } else if (type === 'github' && ingestRepo) {
      url = `${apiBase}/knowledge/ingest/github-readme?repo=${encodeURIComponent(ingestRepo)}`;
    } else if (type === 'wiki' && ingestWiki) {
      url = `${apiBase}/knowledge/ingest/wikipedia?title=${encodeURIComponent(ingestWiki)}`;
    } else {
      return;
    }
    await fetch(url, options);
    await search();
  };

  const [chat, setChat] = React.useState<{role:'user'|'assistant', content:string}[]>([
    { role: 'assistant', content: 'Hi! I can search your ingested knowledge and answer questions. Paste a URL/README/Wikipedia title to ingest, then ask me anything.' }
  ]);
  const [input, setInput] = React.useState("");

  const send = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    const next = [...chat, { role: 'user', content: input.trim() }];
    setChat(next);
    setInput("");
    const res = await fetch(`${apiBase}/knowledge/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: next })
    });
    const data = await res.json();
    setChat([...next, { role: 'assistant', content: data.reply }]);
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
      <h1 className="text-2xl font-bold">Knowledge Chat</h1>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded p-4">
          <div className="font-semibold mb-2">Ingest Web Page</div>
          <input value={ingestUrl} onChange={(e)=>setIngestUrl(e.target.value)} placeholder="https://..." className="w-full border rounded px-3 py-2 mb-2" />
          <button onClick={()=>doIngest('web')} className="bg-emerald-600 text-white rounded px-3 py-2">Ingest</button>
        </div>
        <div className="border rounded p-4">
          <div className="font-semibold mb-2">Ingest GitHub README</div>
          <input value={ingestRepo} onChange={(e)=>setIngestRepo(e.target.value)} placeholder="owner/repo" className="w-full border rounded px-3 py-2 mb-2" />
          <button onClick={()=>doIngest('github')} className="bg-emerald-600 text-white rounded px-3 py-2">Ingest</button>
        </div>
        <div className="border rounded p-4">
          <div className="font-semibold mb-2">Ingest Wikipedia</div>
          <input value={ingestWiki} onChange={(e)=>setIngestWiki(e.target.value)} placeholder="ChatGPT" className="w-full border rounded px-3 py-2 mb-2" />
          <button onClick={()=>doIngest('wiki')} className="bg-emerald-600 text-white rounded px-3 py-2">Ingest</button>
        </div>
      </section>

      <div className="border rounded p-4 bg-white h-[60vh] overflow-y-auto space-y-3">
        {chat.map((m, i) => (
          <div key={i} className={m.role==='assistant'? 'text-gray-900' : 'text-gray-800'}>
            <div className="text-xs uppercase tracking-wide text-gray-400">{m.role}</div>
            <div className="whitespace-pre-wrap">{m.content}</div>
          </div>
        ))}
      </div>

      <form onSubmit={send} className="flex gap-2">
        <input value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Ask anything about your knowledge..." className="flex-1 border rounded px-3 py-2" />
        <button className="bg-black text-white rounded px-4">Send</button>
      </form>
    </main>
  );
}


