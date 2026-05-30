from fastapi import APIRouter, File, UploadFile

router = APIRouter(prefix="/tasks", tags=["Tasks"])

@router.get("/mine")
async def get_my_tasks():
    return [
        {
            "id": "task-1",
            "title": "Boru Partlaması",
            "address": "Nizami metrosu yanı",
            "category": "Su kəməri",
            "priority": "high",
            "status": "pending",
            "citizen": {"name": "Vətəndaş", "phone": "+994500000000"},
            "date": "2026-05-30",
            "description": "Böyük bir su sızması var.",
            "agency_requirements": ["Qazıntı icazəsi", "Ağır texnika"],
            "map_x": 40.380,
            "map_y": 49.830
        }
    ]

@router.get("/{id}")
async def get_task_detail(id: str):
    return {
        "id": id,
        "title": "Boru Partlaması",
        "address": "Nizami metrosu yanı",
        "category": "Su kəməri",
        "priority": "high",
        "status": "pending",
        "citizen": {"name": "Vətəndaş", "phone": "+994500000000"},
        "description": "Böyük bir su sızması var.",
        "agency_body": "Azərsu",
        "agency_requirements": ["Qazıntı icazəsi"],
        "proof_photo_url": None,
        "deadline": "2026-06-01T10:00:00Z",
        "map_x": 40.380,
        "map_y": 49.830
    }

@router.patch("/{id}/status")
async def update_task_status(id: str, payload: dict):
    return {"id": id, "status": payload.get("status"), "resolved_at": "2026-05-30T15:00:00Z"}

@router.post("/{id}/proof")
async def upload_task_proof(id: str, file: UploadFile = File(...)):
    return {"proof_photo_url": "https://mock.url/proof.jpg", "uploaded_at": "2026-05-30T15:00:00Z"}

@router.post("/")
async def create_task(payload: dict):
    return {"id": "task-new", "created_at": "2026-05-30T15:00:00Z"}