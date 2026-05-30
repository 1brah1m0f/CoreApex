import logging
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from routers import auth, reports, simulation, proposals, alerts, tasks, analytics

logging.basicConfig(level=logging.INFO)

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
app.include_router(proposals.router)
app.include_router(alerts.router)
app.include_router(tasks.router)
app.include_router(analytics.router)

@app.exception_handler(RequestValidationError)
async def validation_error_handler(request: Request, exc: RequestValidationError):
    body = await request.body()
    logging.error("422 Validation error | URL: %s | Body: %s | Errors: %s",
                  request.url, body.decode(), exc.errors())
    return JSONResponse(status_code=422, content={"detail": exc.errors()})


@app.get("/")
async def root():
    return {"message": "CoreApex Smart City API Running Successfully"}

# Lokal mühitdə işlətmək üçün aşağıdakı əmri terminalda yazın:
# uvicorn main:app --reload
