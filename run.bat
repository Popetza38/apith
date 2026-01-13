@echo off
title Dramabox API Server
echo.
echo ========================================
echo   Starting Dramabox API Server...
echo ========================================
echo.

:: Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    echo.
)

:: Run the server
npm run dev

pause
