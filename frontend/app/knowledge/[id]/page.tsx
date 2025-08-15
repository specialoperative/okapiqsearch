"use client";

import React from "react";

export default function KnowledgeDetail({ params }: { params: { id: string } }) {
  const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, "");
  const [doc, setDoc] = React.useState<any>(null);

  React.useEffect(() => {
    (async () => {
      const res = await fetch(`${apiBase}/knowledge/doc/${params.id}`);
      if (res.ok) setDoc(await res.json());
    })();
  }, [apiBase, params.id]);

  if (!doc) return <main className="max-w-3xl mx-auto px-6 py-10">Loading…</main>;
  return (
    <main className="max-w-3xl mx-auto px-6 py-10 space-y-4">
      <h1 className="text-2xl font-bold">{doc.title}</h1>
      {doc.url && <a href={doc.url} className="text-emerald-700 text-sm" target="_blank" rel="noreferrer">Source</a>}
      <pre className="whitespace-pre-wrap text-sm bg-white border rounded p-4">{doc.content}</pre>
    </main>
  );
}


