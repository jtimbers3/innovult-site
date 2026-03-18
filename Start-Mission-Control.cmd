@echo off
setlocal

start "Mission Control Dev" cmd /k "cd /d C:\Users\jtimb\.openclaw\workspace\mission-control && npm run dev -- -p 3001"
timeout /t 5 /nobreak >nul
start "" "http://localhost:3001"
