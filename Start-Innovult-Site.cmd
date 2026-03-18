@echo off
setlocal

start "Innovult Site Dev" cmd /k "cd /d C:\Users\jtimb\.openclaw\workspace\innovult-site && npm run dev"
timeout /t 5 /nobreak >nul
start "" "http://localhost:3000"
