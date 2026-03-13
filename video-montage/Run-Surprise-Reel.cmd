@echo off
setlocal
cd /d "%~dp0"

echo ========================================
echo Surprise Reel Renderer (15s)
echo ========================================

where ffmpeg >nul 2>nul
if errorlevel 1 (
  echo.
  echo ffmpeg is not installed yet.
  echo Installing now with winget...
  winget install -e --id Gyan.FFmpeg
  echo.
  echo Re-open this launcher after installation finishes.
  pause
  exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0Make-Surprise-Reel.ps1"

echo.
echo Finished. If the video did not open, check this folder:
echo %~dp0
pause
