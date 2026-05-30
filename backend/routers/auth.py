from fastapi import APIRouter, Depends, HTTPException, status, Header
from typing import Optional
from supabase import Client
from core.dependencies import get_supabase
from models.schemas import StaffLoginRequest, CitizenLoginRequest, TokenResponse, RegisterRequest

router = APIRouter(prefix="/auth", tags=["Auth"])


def _build_response(user, session) -> dict:
    """Shared helper — builds the TokenResponse dict from a Supabase user + session."""
    role = user.user_metadata.get("role", "citizen")
    return {
        "access_token": session.access_token,
        "role": role,
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.user_metadata.get("full_name", "İstifadəçi"),
        },
    }


# ── Register (citizen only) ─────────────────────────────────────────────────

@router.post("/register", response_model=TokenResponse)
async def register_user(request: RegisterRequest, supabase: Client = Depends(get_supabase)):
    """
    Vətəndaş qeydiyyatı. Admin API ilə email avtomatik təsdiqlənir
    (SUPABASE_SERVICE_ROLE_KEY tələb olunur).
    """
    try:
        supabase.auth.admin.create_user({
            "email": request.email,
            "password": request.password,
            "email_confirm": True,
            "user_metadata": {"full_name": request.name, "role": "citizen"},
        })
        sign_in = supabase.auth.sign_in_with_password({
            "email": request.email,
            "password": request.password,
        })
        return _build_response(sign_in.user, sign_in.session)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Qeydiyyat xətası: {str(e)}")


# ── Unified login (all roles) ───────────────────────────────────────────────

@router.post("/login", response_model=TokenResponse)
async def login(request: CitizenLoginRequest, supabase: Client = Depends(get_supabase)):
    """
    Universal giriş — rol istifadəçi metadatasından oxunur.
    Vətəndaş, inspektor və icraçı hamısı bu endpoint-dən istifadə edir.
    """
    try:
        res = supabase.auth.sign_in_with_password({
            "email": request.email,
            "password": request.password,
        })
        return _build_response(res.user, res.session)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail=f"Giriş uğursuz oldu: {str(e)}")


# ── Legacy endpoints (backward compat) ─────────────────────────────────────

@router.post("/login/citizen", response_model=TokenResponse)
async def login_citizen(request: CitizenLoginRequest, supabase: Client = Depends(get_supabase)):
    try:
        res = supabase.auth.sign_in_with_password({
            "email": request.email, "password": request.password})
        return _build_response(res.user, res.session)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail=f"Giriş uğursuz oldu: {str(e)}")


@router.post("/login/staff", response_model=TokenResponse)
async def login_staff(request: StaffLoginRequest, supabase: Client = Depends(get_supabase)):
    try:
        res = supabase.auth.sign_in_with_password({
            "email": request.email, "password": request.password})
        return _build_response(res.user, res.session)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail=f"Giriş uğursuz oldu: {str(e)}")


# ── Current user ────────────────────────────────────────────────────────────

@router.get("/me")
async def get_me(
    authorization: Optional[str] = Header(None),
    supabase: Client = Depends(get_supabase),
):
    """Token-dən cari istifadəçi məlumatlarını qaytarır."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token tələb olunur")
    token = authorization.split(" ", 1)[1]
    try:
        resp = supabase.auth.get_user(token)
        user = resp.user
        if not user:
            raise HTTPException(status_code=401, detail="Etibarsız token")
        return {
            "id": user.id,
            "email": user.email,
            "full_name": user.user_metadata.get("full_name", "İstifadəçi"),
            "role": user.user_metadata.get("role", "citizen"),
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Token xətası: {str(e)}")
