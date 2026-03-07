@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"

echo ==========================================
echo   Google Photos Best-Of Video Launcher
echo ==========================================

echo.
set /p ALBUM=Google Photos album name (example: Video - Mom): 
if "%ALBUM%"=="" (
  echo Album name is required.
  pause
  exit /b 1
)

echo.
set /p START=Start date [optional, YYYY-MM-DD]: 
set /p END=End date   [optional, YYYY-MM-DD]: 

echo.
set /p MAX_ITEMS=Max items [default 90]: 
if "%MAX_ITEMS%"=="" set MAX_ITEMS=90

set /p KEEP_PERCENT=Keep percent 0-1 [default 0.35]: 
if "%KEEP_PERCENT%"=="" set KEEP_PERCENT=0.35

echo.
set /p OUTFILE=Output file name [default output\highlight.mp4]: 
if "%OUTFILE%"=="" set OUTFILE=output\highlight.mp4

set /p MUSIC=Music path [optional, example assets\song.mp3]: 

echo.
echo Running build...

set CMD=python make_video.py --album "%ALBUM%" --max-items %MAX_ITEMS% --keep-percent %KEEP_PERCENT% --out "%OUTFILE%"

if not "%START%"=="" set CMD=!CMD! --start "%START%"
if not "%END%"=="" set CMD=!CMD! --end "%END%"
if not "%MUSIC%"=="" set CMD=!CMD! --music "%MUSIC%"

echo.
echo !CMD!
call !CMD!
if errorlevel 1 (
  echo.
  echo Failed. Common fixes:
  echo - Install Python and ensure "python" works in Command Prompt
  echo - Install requirements: pip install -r requirements.txt
  echo - Install FFmpeg and ensure ffmpeg is in PATH
  echo - Add secrets\client_secret.json
  pause
  exit /b 1
)

echo.
echo Done! Output should be at:
echo   %OUTFILE%
pause
