@echo off
echo Starting Abofra World School Website...
echo.

echo [1/2] Starting Backend API (port 5002)...
start "Abofra Backend" cmd /k "cd /d "%~dp0backend" && npm start"

timeout /t 2 /nobreak >nul

echo [2/2] Starting Frontend (port 3001)...
start "Abofra Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo Website is starting up!
echo   Frontend: http://localhost:3001
echo   Backend:  http://localhost:5002/api/health
echo.
pause
