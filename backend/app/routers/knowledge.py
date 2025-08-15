from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional, List
import httpx
from bs4 import BeautifulSoup

from app.core.database import get_db, Document
from app.core.config import settings
from sqlalchemy.orm import Session

router = APIRouter()

def _clean_html_to_text(html: str) -> str:
    soup = BeautifulSoup(html, "html.parser")
    # remove script/style
    for tag in soup(["script","style","noscript"]):
        tag.decompose()
    return "\n".join([line.strip() for line in soup.get_text("\n").splitlines() if line.strip()])

@router.post("/ingest/web")
async def ingest_web(url: str, db: Session = Depends(get_db)):
    try:
        async with httpx.AsyncClient(timeout=20) as client:
            r = await client.get(url)
            r.raise_for_status()
        text = _clean_html_to_text(r.text)
        title = url
        doc = Document(source_type="web", source_id=url, title=title, url=url, content=text)
        db.add(doc)
        db.commit()
        db.refresh(doc)
        return {"id": doc.id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/ingest/github-readme")
async def ingest_github_readme(repo: str = Query(..., description="owner/repo"), db: Session = Depends(get_db)):
    try:
        raw = f"https://raw.githubusercontent.com/{repo}/HEAD/README.md"
        async with httpx.AsyncClient(timeout=20) as client:
            r = await client.get(raw)
            r.raise_for_status()
        text = r.text
        doc = Document(source_type="github_readme", source_id=repo, title=f"README - {repo}", url=f"https://github.com/{repo}", content=text)
        db.add(doc)
        db.commit()
        db.refresh(doc)
        return {"id": doc.id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/ingest/wikipedia")
async def ingest_wikipedia(title: str, db: Session = Depends(get_db)):
    try:
        api = "https://en.wikipedia.org/api/rest_v1/page/plain/" + httpx.utils.quote(title)
        async with httpx.AsyncClient(timeout=20) as client:
            r = await client.get(api)
            r.raise_for_status()
        text = r.text
        url = f"https://en.wikipedia.org/wiki/{title.replace(' ', '_')}"
        doc = Document(source_type="wikipedia", source_id=title, title=title, url=url, content=text)
        db.add(doc)
        db.commit()
        db.refresh(doc)
        return {"id": doc.id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/search")
def search(q: str, limit: int = 20, db: Session = Depends(get_db)):
    q_like = f"%{q.lower()}%"
    # naive LIKE search across title/content
    results = db.query(Document).filter((Document.title.ilike(q_like)) | (Document.content.ilike(q_like))).limit(limit).all()
    return [
        {"id": d.id, "title": d.title, "url": d.url, "snippet": (d.content[:240] + "...") if d.content and len(d.content) > 240 else d.content}
        for d in results
    ]

@router.get("/doc/{doc_id}")
def get_doc(doc_id: int, db: Session = Depends(get_db)):
    d = db.query(Document).filter(Document.id == doc_id).first()
    if not d:
        raise HTTPException(status_code=404, detail="Not found")
    return {"id": d.id, "title": d.title, "url": d.url, "content": d.content, "source_type": d.source_type}

@router.post("/chat")
async def chat(messages: List[dict], db: Session = Depends(get_db)):
    """
    LLM chat with lightweight retrieval over stored documents.
    Request: { messages: [{role:'user'|'assistant'|'system', content:'...'}] }
    """
    try:
        user_messages = [m for m in messages if m.get("role") == "user"]
        query = user_messages[-1]["content"] if user_messages else ""

        # Retrieve top documents using naive LIKE search
        context_blocks: List[str] = []
        citations: List[dict] = []
        if query:
            q_like = f"%{query.lower()}%"
            hits = (
                db.query(Document)
                .filter((Document.title.ilike(q_like)) | (Document.content.ilike(q_like)))
                .limit(5)
                .all()
            )
            for h in hits:
                snippet = (h.content or "")[:1200]
                context_blocks.append(f"[Source: {h.title}]\n{snippet}")
                citations.append({"id": h.id, "title": h.title, "url": h.url})

        system_prompt = (
            "You are Okapiq Knowledge Assistant. Answer clearly and concisely. "
            "Use the provided context snippets if relevant and cite sources in brackets using their titles."
        )
        context_text = "\n\n".join(context_blocks) if context_blocks else "(no context)"

        if settings.OPENAI_API_KEY:
            payload = {
                "model": os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
                "temperature": 0.2,
                "max_tokens": 600,
                "messages": [
                    {"role": "system", "content": f"{system_prompt}\n\nContext:\n{context_text}"}
                ] + messages,
            }
            try:
                async with httpx.AsyncClient(timeout=30) as client:
                    r = await client.post(
                        "https://api.openai.com/v1/chat/completions",
                        headers={
                            "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
                            "Content-Type": "application/json",
                        },
                        json=payload,
                    )
                r.raise_for_status()
                data = r.json()
                reply = data["choices"][0]["message"]["content"]
                return {"reply": reply, "citations": citations}
            except Exception as e:
                # Fallback to heuristic answer
                fallback = (
                    f"(LLM unavailable) Context considered:\n{context_text[:800]}\n\nQuestion: {query}\n\n"
                    "Provide a concise, factual answer based on the above context."
                )
                return {"reply": fallback, "citations": citations}
        else:
            # No API key; return context summary prompt for the frontend to display
            summary = (
                f"(Dev mode; set OPENAI_API_KEY for full answers)\n\nContext snippets:\n{context_text[:800]}\n\n"
                f"User: {query}\n\nRespond succinctly using the context."
            )
            return {"reply": summary, "citations": citations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


