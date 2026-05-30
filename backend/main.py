from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import auth, reports, simulation

app = FastAPI(
    title="CoreApex API",
    description="Smart City Backend with AI Computer Vision & Simulation Modules",
    version="1.0.0"
)

# CORS Sazlanması (Frontend ilə problemsiz əlaqə üçün)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # İstehsat (production) mühitində tənzimlənməlidir
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routerlərin tətbiqə əlavə olunması
app.include_router(auth.router)
app.include_router(reports.router)
app.include_router(simulation.router)

@app.get("/")
async def root():
    return {"message": "CoreApex Smart City API Running Successfully"}

# Lokal mühitdə işlətmək üçün aşağıdakı əmri terminalda yazın:
# uvicorn main:app --reload
