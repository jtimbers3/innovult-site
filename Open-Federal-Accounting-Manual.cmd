@echo off
set "FILE=C:\Users\jtimb\.openclaw\workspace\federal-accounting-treatment-manual.xml"

if not exist "%FILE%" (
  echo File not found: %FILE%
  pause
  exit /b 1
)

start "" excel "%FILE%"
