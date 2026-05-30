from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# --- Auth Schemas ---
class StaffLoginRequest(BaseModel):
    email: str
    password: str

class CitizenLoginRequest(BaseModel):
    # Prototip üçün email və password istifadə edirik
    email: str
    password: str
    provider: Optional[str] = "email"

class TokenResponse(BaseModel):
    access_token: str
    role: str
    user: dict

# --- Report Schemas ---
class ReportCreateRequest(BaseModel):
    category: str
    description: str = Field(..., min_length=5)
    address: str
    lat: float
    lng: float
    photo_url: Optional[str] = None
    ai_routed: Optional[bool] = False

class AIClassifyRequest(BaseModel):
    photo_url: str

# --- Simulation Schemas ---
class SimulationRunRequest(BaseModel):
    task_id: str
    active_layers: List[str]
    lat: float
    lng: float

class RiskAssessRequest(BaseModel):
    task_id: str
