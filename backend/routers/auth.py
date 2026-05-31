from fastapi import APIRouter, Depends, HTTPException, status
from supabase import Client
from typing import Optional
from core.dependencies import get_supabase
from models.schemas import StaffLoginRequest, CitizenLoginRequest, RegisterRequest, TokenResponse

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/login/citizen", response_model=TokenResponse)
async def login_citizen(request: CitizenLoginRequest, supabase: Optional[Client] = Depends(get_supabase)):
    """
    Vətəndaş girişi.
    Hackathon üçün 'sima', 'asan' yerinə sadələşdirilmiş Email/Password istifadə edirik.
    """
    if supabase is None:
        # Mock rejim
        return {
            "access_token": "mock_citizen_token",
            "role": "citizen",
            "user": {
                "id": "mock_cit_123",
                "email": request.email,
                "full_name": "Vətəndaş (Mock)"
            }
        }
    try:
        res = supabase.auth.sign_in_with_password({
            "email": request.email,
            "password": request.password
        })
        user = res.user
        return {
            "access_token": res.session.access_token,
            "role": "citizen",
            "user": {
                "id": user.id,
                "email": user.email,
                "full_name": user.user_metadata.get("full_name", "Vətəndaş")
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Giriş uğursuz oldu: {str(e)}"
        )

@router.post("/login/staff", response_model=TokenResponse)
async def login_staff(request: StaffLoginRequest, supabase: Optional[Client] = Depends(get_supabase)):
    """
    İşçi (İnspektor/İcraçı) girişi.
    """
    if supabase is None:
        # Mock rejim: Emailə görə rol təyin edirik
        role = "executive" if "exec" in request.email.lower() else "inspector"
        return {
            "access_token": f"mock_{role}_token",
            "role": role,
            "user": {
                "id": f"mock_staff_{role}",
                "email": request.email,
                "full_name": f"{role.capitalize()} (Mock)"
            }
        }
    try:
        res = supabase.auth.sign_in_with_password({
            "email": request.email,
            "password": request.password
        })
        user = res.user
        # Role metadata içindən və ya default olaraq 'inspector' kimi qeyd edilə bilər
        role = user.user_metadata.get("role", "inspector")
        return {
            "access_token": res.session.access_token,
            "role": role,
            "user": {
                "id": user.id,
                "email": user.email,
                "full_name": user.user_metadata.get("full_name", "İşçi")
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Giriş uğursuz oldu: {str(e)}"
        )

@router.post("/register", response_model=TokenResponse)
async def register_user(request: RegisterRequest, supabase: Optional[Client] = Depends(get_supabase)):
    """
    Yeni vətəndaşın qeydiyyatı.
    """
    if supabase is None:
        # Mock rejim
        return {
            "access_token": "mock_register_token",
            "role": "citizen",
            "user": {
                "id": "mock_new_user",
                "email": request.email,
                "full_name": request.name or "Yeni Vətəndaş"
            }
        }
    try:
        # Həqiqi Supabase Qeydiyyatı
        res = supabase.auth.sign_up({
            "email": request.email,
            "password": request.password,
            "options": {
                "data": {
                    "full_name": request.name,
                    "role": "citizen"
                }
            }
        })
        user = res.user
        if not user:
            raise Exception("İstifadəçi yaradıla bilmədi.")
            
        return {
            "access_token": res.session.access_token if res.session else "mock_session_token",
            "role": "citizen",
            "user": {
                "id": user.id,
                "email": user.email,
                "full_name": request.name
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Qeydiyyat xətası: {str(e)}"
        )

@router.post("/otp/send")
async def send_otp(phone: dict):
    # Mock edilmiş OTP göndərilməsi
    return {"otp_sent": True, "expires_in_seconds": 120}

@router.post("/otp/verify")
async def verify_otp(payload: dict):
    # Mock edilmiş OTP yoxlanışı
    return {"access_token": "mock_token_for_otp", "role": "citizen", "user": {"id": "123", "full_name": "OTP User"}}
