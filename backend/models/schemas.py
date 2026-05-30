from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# --- Auth Schemas ---
class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

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
    title: str
    category: str
    description: str
    address: Optional[str] = ""
    neighborhood: Optional[str] = None
    lat: Optional[float] = 0.0
    lng: Optional[float] = 0.0
    photo_url: Optional[str] = None
    assigned_agency: Optional[str] = None
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
