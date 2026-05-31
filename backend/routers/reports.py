import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, Header
from typing import Optional
from supabase import Client

from core.dependencies import get_supabase
from models.schemas import ReportCreateRequest, AIClassifyRequest
from services.security import fetch_image, verify_image_authenticity
from services.groq_classifier import classify_and_route_image_llama

router = APIRouter(prefix="/reports", tags=["Reports"])

def get_current_user_id(authorization: Optional[str] = Header(None), supabase: Client = Depends(get_supabase)) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token tələb olunur")
    token = authorization.split(" ", 1)[1]
    try:
        resp = supabase.auth.get_user(token)
        if not resp.user:
            raise HTTPException(status_code=401, detail="Etibarsız token")
        return resp.user.id
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

CATEGORY_AGENCY = {
    "Yollar": "AAYDA",
    "Zibil": "MKTB",
    "Abadlıq": "Yaşıllaşdırma Təsərrüfatı",
    "Su kəməri": "Azərsu",
    "Elektrik": "Azərişıq",
}


# ── AI endpoints ────────────────────────────────────────────────────────────

@router.post("/classify-upload")
async def classify_from_upload(
    file: UploadFile = File(...),
    supabase: Client = Depends(get_supabase),
):
    image_bytes = await file.read()

    try:
        verify_image_authenticity(image_bytes)
    except ValueError:
        pass

    ai_result = classify_and_route_image_llama(image_bytes)

    photo_url = None
    try:
        ext = (file.filename or "image.jpg").rsplit(".", 1)[-1].lower()
        storage_path = f"reports/{uuid.uuid4()}.{ext}"
        supabase.storage.from_("report-photos").upload(
            storage_path,
            image_bytes,
            {"content-type": file.content_type or "image/jpeg"},
        )
        photo_url = supabase.storage.from_("report-photos").get_public_url(storage_path)
    except Exception:
        pass

    return {
        "photo_url": photo_url,
        "category": ai_result.get("category"),
        "title": ai_result.get("title") or ai_result.get("description", ""),
        "description": ai_result.get("description", ""),
        "assigned_agency": ai_result.get("assigned_agency"),
        "confidence": ai_result.get("confidence"),
    }


@router.post("/ai-classify")
async def ai_classify_report(request: AIClassifyRequest):
    try:
        image_bytes = await fetch_image(request.photo_url)
        verify_image_authenticity(image_bytes)
        ai_result = classify_and_route_image_llama(image_bytes)
        return {
            "category": ai_result.get("category"),
            "title": ai_result.get("title") or ai_result.get("description"),
            "description": ai_result.get("description"),
            "assigned_agency": ai_result.get("assigned_agency"),
            "confidence": ai_result.get("confidence"),
        }
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sistem xətası: {str(e)}")


# ── CRUD endpoints ──────────────────────────────────────────────────────────

@router.post("/")
async def create_report(
    request: ReportCreateRequest, 
    supabase: Client = Depends(get_supabase),
    user_id: str = Depends(get_current_user_id)
):
    report_id = f"MR-{str(uuid.uuid4())[:8].upper()}"

    assigned_agency = request.assigned_agency or CATEGORY_AGENCY.get(request.category, "Təyin edilməyib")

    data = {
        "id": report_id,
        "title": request.title,
        "category": request.category,
        "description": request.description,
        "address": request.address,
        "neighborhood": request.neighborhood,
        "lat": request.lat,
        "lng": request.lng,
        "photo_url": request.photo_url,
        "status": "pending",
        "assigned_agency": assigned_agency,
        "ai_routed": request.ai_routed,
        "created_at": datetime.utcnow().isoformat(),
        "citizen_id": user_id,
    }

    try:
        response = supabase.table("reports").insert(data).execute()
        return response.data[0] if response.data else data
    except Exception as e:
        # Table mövcud deyilsə aşağıdakı SQL-i Supabase Dashboard-da çalışdırın:
        # (backend/supabase_schema.sql faylına baxın)
        raise HTTPException(
            status_code=500,
            detail=f"Verilənlər bazası xətası: {str(e)}. Supabase-də 'reports' cədvəlini yaradın."
        )


@router.get("/mine")
async def get_my_reports(
    status: str = None, 
    supabase: Client = Depends(get_supabase),
    user_id: str = Depends(get_current_user_id)
):
    try:
        query = supabase.table("reports").select("*").eq("citizen_id", user_id).order("created_at", desc=True)
        if status:
            query = query.eq("status", status)
        response = query.execute()
        return response.data or []
    except Exception:
        return []


@router.get("/{report_id}")
async def get_report(report_id: str, supabase: Client = Depends(get_supabase)):
    try:
        response = supabase.table("reports").select("*").eq("id", report_id).single().execute()
        return response.data
    except Exception:
        raise HTTPException(status_code=404, detail="Müraciət tapılmadı")


@router.get("/")
async def get_reports(supabase: Client = Depends(get_supabase)):
    try:
        response = supabase.table("reports").select("*").order("created_at", desc=True).execute()
        return {"total": len(response.data), "results": response.data}
    except Exception:
        return {"total": 0, "results": []}
