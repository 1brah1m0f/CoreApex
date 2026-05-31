import os
from pathlib import Path

from dotenv import load_dotenv
from supabase import Client, create_client, acreate_client, AClient


BACKEND_ROOT = Path(__file__).resolve().parent.parent


def get_supabase() -> Client:
    """
    Supabase sync client yaradır.
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
        raise RuntimeError("SUPABASE_URL və KEY tapılmadı.")
    try:
        return create_client(supabase_url, supabase_key)
    except Exception as exc:
        raise RuntimeError("Supabase sync client yaradıla bilmədi.") from exc

async def get_async_supabase() -> AClient:
    """
    Supabase async client yaradır.
    Auth xətalarının (blocklanmaların) qarşısını almaq üçün lazımdır.
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
        raise RuntimeError("SUPABASE_URL və KEY tapılmadı.")
    try:
        return await acreate_client(supabase_url, supabase_key)
    except Exception as exc:
        raise RuntimeError("Supabase async client yaradıla bilmədi.") from exc
