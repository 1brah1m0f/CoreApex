import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from supabase import Client

from core.dependencies import get_supabase
from models.schemas import ReportCreateRequest, AIClassifyRequest
from services.security import fetch_image, verify_image_authenticity
from services.ai_classifier import classify_and_route_image

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.post("/ai-classify")
async def ai_classify_report(request: AIClassifyRequest):
    """
    1. Şəkli URL-dən yükləyir.
    2. İkiqat Təhlükəsizlik Süzgəcindən (Fake / AI) keçirir.
    3. MobileNetV2 (AI) ilə analiz edib müvafiq dövlət qurumuna / prioritetə map edir.
    """
    try:
        # Şəklin baytlarını alırıq
        image_bytes = await fetch_image(request.photo_url)
        
        # Süzgəcdən keçiririk (Error atarsa birbaşa except bloka düşəcək)
        verify_image_authenticity(image_bytes)
        
        # Süni intellekt analizi
        ai_result = classify_and_route_image(image_bytes)
        
        return ai_result
        
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sistem xətası: {str(e)}")


@router.post("/")
async def create_report(request: ReportCreateRequest, supabase: Client = Depends(get_supabase)):
    """
    Vətəndaş müraciətinin verilənlər bazasına (Supabase) yazılması.
    """
    # Normalda bu hissədə auth tokendən user id tapılır. Mock misalda:
    user_id = "mock-uuid-1234"
    report_id = f"MR-{str(uuid.uuid4())[:8].upper()}"
    
    # Əgər AI routing yoxdursa, default qurum təyin edirik
    assigned_agency = "Təyin edilməyib"
    if request.category == "road": assigned_agency = "AAYDA"
    elif request.category == "waste": assigned_agency = "MKTB"
    elif request.category == "water": assigned_agency = "Azərsu"
    
    data = {
        "id": report_id,
        "category": request.category,
        "description": request.description,
        "address": request.address,
        "lat": request.lat,
        "lng": request.lng,
        "photo_url": request.photo_url,
        "status": "pending",
        "assigned_agency": assigned_agency,
        "created_at": datetime.utcnow().isoformat(),
        "citizen_id": user_id
    }
    
    try:
        # Cədvəl "reports" adlanacağı təqdirdə:
        # response = supabase.table("reports").insert(data).execute()
        # return response.data[0]
        
        # Supabase mövcud olmadığı rejimdə (test üçün) datanı özünü qaytarırıq:
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Baza xətası: {str(e)}")

@router.get("/")
async def get_reports():
    """Bütün müraciətləri siyahı şəklində qaytarır."""
    return {"total": 0, "results": []}
