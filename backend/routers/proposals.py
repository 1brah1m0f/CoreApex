from fastapi import APIRouter
from typing import List, Optional

router = APIRouter(prefix="/proposals", tags=["Proposals"])

@router.get("/")
async def get_proposals(tag: Optional[str] = None):
    # Mock data for frontend
    return [
        {
            "id": "prop-1",
            "title": "Parkın yenidən qurulması",
            "description": "Ərazidəki köhnə parkın bərpası",
            "author": "İsmayıl A.",
            "date": "2026-05-30",
            "votes": 120,
            "voted_by_me": False,
            "tag": "infrastruktur"
        }
    ]

@router.post("/")
async def create_proposal(payload: dict):
    return {
        "id": "prop-new",
        "title": payload.get("title", ""),
        "votes": 0,
        "created_at": "2026-05-30T10:00:00Z"
    }

@router.post("/{id}/vote")
async def vote_proposal(id: str):
    return {"id": id, "votes": 121, "voted_by_me": True}