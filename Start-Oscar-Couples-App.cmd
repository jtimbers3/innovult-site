@echo off
setlocal

start "Oscar Couples App Dev" cmd /k "cd /d C:\Users\jtimb\.openclaw\workspace\oscar-couples-app && npm run dev -- -p 3002"
timeout /t 5 /nobreak >nul
start "" "http://localhost:3002"
