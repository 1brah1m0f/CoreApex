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
        # User istəyir ki, bütün vətəndaş müraciətləri avtomatik olaraq Müfəttişin "Tapşırıqlar" panelinə düşsün.
        # Buna görə də "tasks" cədvəli əvəzinə birbaşa "reports" cədvəlini çəkib task kimi formatlayırıq.
        res = await supabase.table("reports").select(
            "id,title,description,category,address,status,created_at,lat,lng,assigned_agency"
        ).order("created_at", desc=True).execute()
        reports = res.data or []

        tasks_list = []
        for rep in reports:
            raw_lat = rep.get("lat")
            raw_lng = rep.get("lng")
            try:
                map_x = float(raw_lat) if raw_lat is not None and float(raw_lat) != 0.0 else None
                map_y = float(raw_lng) if raw_lng is not None and float(raw_lng) != 0.0 else None
            except (TypeError, ValueError):
                map_x = None
                map_y = None

            tasks_list.append({
                "id": rep.get("id"),
                "status": rep.get("status") if rep.get("status") in ["pending", "inprogress", "resolved", "overdue"] else "pending",
                "address": rep.get("address") or "Naməlum ünvan",
                "category": rep.get("category") or "Digər",
                "priority": "Yüksək",
                "title": rep.get("title") or "Tapşırıq başlığı yoxdur",
                "description": rep.get("description") or "",
                "date": rep.get("created_at")[:10] if rep.get("created_at") else "",
                "report_id": rep.get("id"),
                "agency_requirements": [],
                "map_x": map_x,
                "map_y": map_y,
            })
        return tasks_list
    except Exception as e:
        print(f"ERROR tasks/mine: {e}")
        return []

@router.get("/{id}")
async def get_task_detail(id: str, supabase: AClient = Depends(get_async_supabase)):
    try:
        res = await supabase.table("reports").select("*").eq("id", id).single().execute()
        return res.data
    except Exception:
        return {}

@router.patch("/{id}/status")
async def update_task_status(id: str, payload: dict, supabase: AClient = Depends(get_async_supabase)):
    # Tasks endpoint-i vasitəsilə göndərilən status dəyişikliyini birbaşa reports cədvəlinə tətbiq edirik
    await supabase.table("reports").update({"status": payload.get("status")}).eq("id", id).execute()
    # Ehtiyat üçün əgər köhnə tasks varsa orda da update edirik
    try:
        await supabase.table("tasks").update({"status": payload.get("status")}).eq("id", id).execute()
    except Exception:
        pass
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