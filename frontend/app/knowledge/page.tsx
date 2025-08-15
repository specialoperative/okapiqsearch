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

  return (
    <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      <h1 className="text-2xl font-bold">Knowledge Hub</h1>

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

      <form onSubmit={search} className="flex gap-2">
        <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search knowledge..." className="flex-1 border rounded px-3 py-2" />
        <button className="bg-black text-white rounded px-4">Search</button>
      </form>

      <section className="space-y-3">
        {loading ? <div>Searching...</div> : results.map((r) => (
          <a key={r.id} href={`/knowledge/${r.id}`} className="block p-3 border rounded hover:bg-gray-50">
            <div className="font-semibold">{r.title}</div>
            <div className="text-xs text-gray-500 truncate">{r.url}</div>
            <div className="text-sm text-gray-700 line-clamp-2">{r.snippet}</div>
          </a>
        ))}
      </section>
    </main>
  );
}


