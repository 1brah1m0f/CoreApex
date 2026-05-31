import asyncio
from core.dependencies import get_async_supabase
async def run():
    supabase = await get_async_supabase()
    res = await supabase.table("tasks").select("*, reports(*)").execute()
    print(res.data)
asyncio.run(run())
