import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv("backend/.env")
url = os.environ.get("SUPABASE_URL", "")
key = os.environ.get("SUPABASE_ANON_KEY", "") or os.environ.get("SUPABASE_KEY", "")

client = create_client(url, key)
try:
    print("signing up...")
    res = client.auth.sign_up({
        "email": "asdfasdf123@example.com",
        "password": "password123",
        "options": {
            "data": {"full_name": "Test User", "role": "citizen"}
        }
    })
    print(res)
except Exception as e:
    print("Error:", e)
