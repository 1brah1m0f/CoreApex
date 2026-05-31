from fastapi import APIRouter, Depends
from typing import List, Optional
import uuid
from datetime import datetime
from supabase import AClient
from core.dependencies import get_async_supabase

router = APIRouter(prefix="/proposals", tags=["Proposals"])

@router.get("/")
async def get_proposals(tag: Optional[str] = None, supabase: AClient = Depends(get_async_supabase)):
    try:
        query = supabase.table("proposals").select("*")
        if tag:
            query = query.eq("tag", tag)
        res = await query.execute()
        return res.data
    except Exception:
        return []

@router.post("/")
async def create_proposal(payload: dict, supabase: AClient = Depends(get_async_supabase)):
    data = {
        "id": str(uuid.uuid4()),
        "title": payload.get("title", ""),
        "description": payload.get("description", ""),
        "author": "Vətəndaş",
        "date": datetime.now().strftime("%Y-%m-%d"),
        "votes": 0,
        "tag": payload.get("tag", "digər")
    }
    res = await supabase.table("proposals").insert(data).execute()
    return res.data[0] if res.data else {}

@router.post("/{id}/vote")
async def vote_proposal(id: str, supabase: AClient = Depends(get_async_supabase)):
    # Very simple mock-like vote increment. For production, use RPC.
    prop = await supabase.table("proposals").select("votes").eq("id", id).single().execute()
    new_votes = (prop.data.get("votes", 0) + 1) if prop.data else 1
    await supabase.table("proposals").update({"votes": new_votes}).eq("id", id).execute()
    return {"id": id, "votes": new_votes, "voted_by_me": True}