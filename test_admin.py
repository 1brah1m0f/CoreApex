import os
import asyncio
from dotenv import load_dotenv
from supabase import create_client

load_dotenv("backend/.env")
url = os.environ.get("SUPABASE_URL", "")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

client = create_client(url, key)
try:
    print("admin create user...")
    res = client.auth.admin.create_user({
        "email": "testadmin3@example.com",
        "password": "password123",
        "email_confirm": True,
        "user_metadata": {
            "full_name": "Test User", "role": "citizen"
        }
    })
    print("RES:", res)
except Exception as e:
    print("Error:", e)
