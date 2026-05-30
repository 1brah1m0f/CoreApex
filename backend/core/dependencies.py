import os
from pathlib import Path

from dotenv import load_dotenv
from supabase import Client, create_client


BACKEND_ROOT = Path(__file__).resolve().parent.parent


def get_supabase() -> Client:
    """
    Supabase client yaradır.
    Mühit dəyişənləri backend/.env və ya layihə kökündəki .env faylından oxunur.
    """
    load_dotenv(BACKEND_ROOT / ".env", override=True)
    load_dotenv(BACKEND_ROOT.parent / ".env", override=True)

    supabase_url = os.getenv("SUPABASE_URL", "")
    supabase_key = (
        os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
        or os.getenv("SUPABASE_ANON_KEY", "")
        or os.getenv("SUPABASE_KEY", "")
    )

    if not supabase_url or not supabase_key:
        raise RuntimeError(
            "SUPABASE_URL və SUPABASE_ANON_KEY/SUPABASE_SERVICE_ROLE_KEY tapılmadı. backend/.env faylını yaradın və doldurun."
        )

    if supabase_key.startswith("sb_publishable__"):
        raise RuntimeError(
            "Yanlış Supabase açarı istifadə olunur: sb_publishable__...\n"
            "Backend üçün Supabase Dashboard -> Project Settings -> API bölməsindən "
            "anon public JWT key və ya service_role key istifadə edin."
        )

    try:
        return create_client(supabase_url, supabase_key)
    except Exception as exc:
        raise RuntimeError(
            "Supabase client yaradıla bilmədi. URL və ya API key səhvdir. "
            "Backend üçün anon/service_role JWT açarından istifadə edin."
        ) from exc
