from fastapi import APIRouter, Depends
from typing import Optional
import uuid
from datetime import datetime
from supabase import AClient
from core.dependencies import get_async_supabase

router = APIRouter(prefix="/alerts", tags=["Alerts"])

@router.get("/")
async def get_alerts(type: Optional[str] = None, supabase: AClient = Depends(get_async_supabase)):
    try:
        query = supabase.table("alerts").select("*")
        if type:
            query = query.eq("type", type)
        res = await query.execute()
        return res.data
    except Exception:
        return []

@router.post("/")
async def create_alert(payload: dict, supabase: AClient = Depends(get_async_supabase)):
    data = {
        "id": str(uuid.uuid4()),
        "title": payload.get("title"),
        "body": payload.get("body"),
        "type": payload.get("type"),
        "district": payload.get("district"),
        "date": payload.get("date", datetime.now().strftime("%Y-%m-%d")),
        "time": payload.get("time", datetime.now().strftime("%H:%M"))
    }
    res = await supabase.table("alerts").insert(data).execute()
    return res.data[0] if res.data else {}

@router.delete("/{id}")
async def delete_alert(id: str, supabase: AClient = Depends(get_async_supabase)):
    await supabase.table("alerts").delete().eq("id", id).execute()
    return {"deleted": True}