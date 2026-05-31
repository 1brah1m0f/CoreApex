import uvicorn
from fastapi import FastAPI
from supabase import acreate_client
import os
import asyncio
from dotenv import load_dotenv

load_dotenv("backend/.env")
app = FastAPI()

url = os.environ.get("SUPABASE_URL", "")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

@app.post("/register")
async def register():
    client = await acreate_client(url, key)
    res = await client.auth.admin.create_user({
        "email": "testfast2@example.com",
        "password": "password123",
        "email_confirm": True
    })
    return {"id": res.user.id}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8001)
