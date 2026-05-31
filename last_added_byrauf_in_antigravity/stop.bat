@echo off
echo ===================================================
echo          CoreApex / Nərimanov SmartOps
echo               STOPPING SERVICES
echo ===================================================

echo.
echo Stopping Backend (Port 8000)...
FOR /F "tokens=5" %%T IN ('netstat -a -n -o ^| findstr :8000') DO (
  taskkill /F /PID %%T >nul 2>&1
)

echo Stopping Frontend (Port 5173)...
FOR /F "tokens=5" %%T IN ('netstat -a -n -o ^| findstr :5173') DO (
  taskkill /F /PID %%T >nul 2>&1
)

:: Just in case the old ones were on 5174, 5175
FOR /F "tokens=5" %%T IN ('netstat -a -n -o ^| findstr :5174') DO (
  taskkill /F /PID %%T >nul 2>&1
)
FOR /F "tokens=5" %%T IN ('netstat -a -n -o ^| findstr :5175') DO (
  taskkill /F /PID %%T >nul 2>&1
)

echo.
echo All CoreApex services have been safely stopped.
echo.
pause
