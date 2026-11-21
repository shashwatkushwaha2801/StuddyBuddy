@echo off
title StudyBuddy - Smart Student Collaboration Platform
echo.
echo  ========================================
echo   StudyBuddy - Starting Application...
echo  ========================================
echo.

set PATH=C:\Program Files\nodejs;%PATH%

echo [1/2] Starting Backend API Server (port 5000)...
start "StudyBuddy Backend" cmd /k "cd /d "%~dp0server" && set PATH=C:\Program Files\nodejs;%PATH% && node server.js"

timeout /t 2 /nobreak >nul

echo [2/2] Starting Frontend Dev Server (port 5173)...
start "StudyBuddy Frontend" cmd /k "cd /d "%~dp0client" && set PATH=C:\Program Files\nodejs;%PATH% && npx vite --port 5173 --host"

timeout /t 3 /nobreak >nul

echo.
echo  ========================================
echo   StudyBuddy is LIVE!
echo.
echo   Open in browser: http://localhost:5173
echo  ========================================
echo.

start "" http://localhost:5173

echo Press any key to close this window (servers will keep running)...
pause >nul
