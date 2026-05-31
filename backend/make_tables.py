import asyncio
import os
from dotenv import load_dotenv
from supabase import acreate_client

load_dotenv()
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

async def run():
    client = await acreate_client(url, key)
    print("WARNING: Creating tables via RPC or Supabase Dashboard is required!")
    print("Since we don't have postgres access, I created a schema file.")

asyncio.run(run())
