@echo off
setlocal
cd /d "%~dp0"

echo ===================================================
echo          CoreApex / Nərimanov SmartOps
echo               STARTING SERVICES
echo ===================================================

echo.
echo [1/2] Starting FastAPI Backend on port 8000...
cd /d "%~dp0..\backend"
start "CoreApex Backend" cmd /k "title CoreApex Backend && uvicorn main:app --reload --port 8000"

echo [2/2] Starting React/Vite Frontend on port 5173...
cd /d "%~dp0..\frontend"
start "CoreApex Frontend" cmd /k "title CoreApex Frontend && npm run dev"

echo.
echo Waiting for services to start...
timeout /t 4 /nobreak >nul

echo Opening browser...
start http://localhost:5173/

echo.
echo Services are starting in separate background windows.
echo To stop them, run the stop.bat script.
echo.
pause
