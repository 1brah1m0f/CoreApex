from fastapi import APIRouter, Depends, HTTPException, status
from supabase import Client
from core.dependencies import get_supabase
from models.schemas import StaffLoginRequest, CitizenLoginRequest, TokenResponse

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/login/citizen", response_model=TokenResponse)
async def login_citizen(request: CitizenLoginRequest, supabase: Client = Depends(get_supabase)):
    """
    Vətəndaş girişi.
    Hackathon üçün 'sima', 'asan' yerinə sadələşdirilmiş Email/Password istifadə edirik.
    """
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
async def login_staff(request: StaffLoginRequest, supabase: Client = Depends(get_supabase)):
    """
    İşçi (İnspektor/İcraçı) girişi.
    """
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

@router.post("/otp/send")
async def send_otp(phone: dict):
    # Mock edilmiş OTP göndərilməsi
    return {"otp_sent": True, "expires_in_seconds": 120}

@router.post("/otp/verify")
async def verify_otp(payload: dict):
    # Mock edilmiş OTP yoxlanışı
    return {"access_token": "mock_token_for_otp", "role": "citizen", "user": {"id": "123", "full_name": "OTP User"}}
