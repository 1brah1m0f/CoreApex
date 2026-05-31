import asyncio
from core.dependencies import get_async_supabase
async def run():
    supabase = await get_async_supabase()
    res = await supabase.table("reports").select("id").limit(1).execute()
    print("Reports OK:", res.data)
asyncio.run(run())
