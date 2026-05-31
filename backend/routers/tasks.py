from fastapi import APIRouter, File, UploadFile, Depends, Header, HTTPException
from supabase import AClient
from typing import Optional
from core.dependencies import get_async_supabase
import uuid
from datetime import datetime

router = APIRouter(prefix="/tasks", tags=["Tasks"])

async def get_current_user_id(authorization: Optional[str] = Header(None), supabase: AClient = Depends(get_async_supabase)) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token tələb olunur")
    token = authorization.split(" ", 1)[1]
    try:
        resp = await supabase.auth.get_user(token)
        if not resp.user:
            raise HTTPException(status_code=401, detail="Etibarsız token")
        return resp.user.id
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

@router.get("/mine")
async def get_my_tasks(supabase: AClient = Depends(get_async_supabase), user_id: str = Depends(get_current_user_id)):
    try:
        res = await supabase.table("tasks").select("*").eq("inspector_id", user_id).execute()
        return res.data
    except Exception:
        return []

@router.get("/{id}")
async def get_task_detail(id: str, supabase: AClient = Depends(get_async_supabase)):
    res = await supabase.table("tasks").select("*").eq("id", id).single().execute()
    return res.data

@router.patch("/{id}/status")
async def update_task_status(id: str, payload: dict, supabase: AClient = Depends(get_async_supabase)):
    res = await supabase.table("tasks").update({"status": payload.get("status")}).eq("id", id).execute()
    return {"id": id, "status": payload.get("status"), "resolved_at": datetime.now().isoformat()}

@router.post("/{id}/proof")
async def upload_task_proof(id: str, file: UploadFile = File(...), supabase: AClient = Depends(get_async_supabase)):
    # Very basic mock URL response for file unless we do actual storage
    return {"proof_photo_url": "https://generated.url/proof.jpg", "uploaded_at": datetime.now().isoformat()}

@router.post("/")
async def create_task(payload: dict, supabase: AClient = Depends(get_async_supabase)):
    data = {
        "id": str(uuid.uuid4()),
        "report_id": payload.get("report_id"),
        "inspector_id": payload.get("inspector_id"),
        "status": "pending",
        "deadline": payload.get("deadline", "2026-06-01T00:00:00Z")
    }
    res = await supabase.table("tasks").insert(data).execute()
    return res.data[0] if res.data else {}