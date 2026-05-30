from fastapi import APIRouter
from typing import Optional

router = APIRouter(prefix="/alerts", tags=["Alerts"])

@router.get("/")
async def get_alerts(type: Optional[str] = None):
    return [
        {
            "id": "alert-1",
            "title": "Su kəsilməsi xəbərdarlığı",
            "body": "Nizami rayonunda təmir işləri ilə əlaqədar su məhdudiyyəti olacaq.",
            "type": "warning",
            "district": "Nizami",
            "date": "2026-05-30",
            "time": "12:00"
        }
    ]

@router.post("/")
async def create_alert(payload: dict):
    return {"id": "alert-new", "created_at": "2026-05-30T10:00:00Z"}

@router.delete("/{id}")
async def delete_alert(id: str):
    return {"deleted": True}