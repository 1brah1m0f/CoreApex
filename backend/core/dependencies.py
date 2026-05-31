import os
from pathlib import Path

from dotenv import load_dotenv
from supabase import Client, create_client


BACKEND_ROOT = Path(__file__).resolve().parent.parent


def get_supabase() -> Client | None:
    """
    Supabase client yaradır.
    Mühit dəyişənləri backend/.env və ya layihə kökündəki .env faylından oxunur.
    Əgər tapılmazsa lokal inkişaf (mock) üçün None qaytarır.
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
        print("DIQQET: Supabase açarları tapılmadı. Sistem lokal MOCK rejimində işləyəcək.")
        return None

    try:
        return create_client(supabase_url, supabase_key)
    except Exception as exc:
        print("DIQQET: Supabase bağlantısı uğursuz oldu. Sistem lokal MOCK rejimində işləyəcək.", exc)
        return None
