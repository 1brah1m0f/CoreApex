import random
from typing import List
from fastapi import APIRouter
from models.schemas import SimulationRunRequest, RiskAssessRequest

router = APIRouter(prefix="/simulation", tags=["Simulation"])

@router.get("/layers")
async def get_simulation_layers(lat: float, lng: float, radius_m: int = 200):
    """
    Verilmiş lat/lng koordinatlarına əsasən random geo-layer datası yaradır.
    Xarici API-siz, arxa fonda imitasiya generatoru.
    """
    layers = ["water", "traffic", "wind", "noise", "soil"]
    levels = ["low", "medium", "high"]
    
    # Koordinata bağlı stabil random nəticə almaq üçün seed qoyuruq (istəyə görə)
    random.seed(int(lat * 1000) + int(lng * 1000))
    
    results = []
    for layer in layers:
        risk = random.choice(levels)
        results.append({
            "key": layer,
            "label": f"{layer.capitalize()} Təhlili",
            "risk_level": risk,
            "risk_label": "Yüksək Risk" if risk == "high" else "Normal",
            "details": [{"k": "Baza Dəyəri", "v": str(random.randint(10, 99))}],
            "warning": "Kritik vəziyyət müşahidə olundu" if risk == "high" else None
        })
    return results

@router.post("/run")
async def run_simulation(request: SimulationRunRequest):
    """
    Tam Simulyasiya başlatır. Nəticələri imitasiya edir.
    """
    # Active layer sayına əsasən impact hesablanması imitasiyası
    base_impact = len(request.active_layers) * 10
    impact_score = min(100, base_impact + random.randint(10, 40))
    
    if impact_score > 75:
        risk_level = "high"
    elif impact_score > 40:
        risk_level = "medium"
    else:
        risk_level = "low"
        
    return {
        "impact_score": impact_score,
        "risk_level": risk_level,
        "recommendations": [
            "Boru kəmərlərində təzyiqi yoxlayın.",
            "Trafiki alternativ yollara yönləndirin."
        ],
        "run_at": "2024-05-30T10:00:00Z" # Mock data üçün
    }

@router.post("/risk-assess")
async def risk_assess(request: RiskAssessRequest):
    """
    AI ilə riskin detalı qiymətləndirilməsi.
    """
    score = random.randint(20, 95)
    return {
        "task_id": request.task_id,
        "criteria": {
            "soil": random.choice([True, False]),
            "road": random.choice([True, False]),
            "traffic": random.choice([True, False]),
            "utilities": random.choice([True, False]),
            "weather": random.choice([True, False]),
            "population": random.choice([True, False])
        },
        "risk_score": score,
        "risk_level": "high" if score > 75 else ("medium" if score > 50 else "low")
    }
