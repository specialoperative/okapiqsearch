from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional, List
import httpx
from bs4 import BeautifulSoup

from app.core.database import get_db, Document
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


