$workspace = "C:\Users\jtimb\.openclaw\workspace"

$apps = @(
  Join-Path $workspace "App-Launcher-Hub.html",
  Join-Path $workspace "Innovult-Recruiting-Dashboard.html",
  Join-Path $workspace "Innovult-Subagents.html",
  Join-Path $workspace "ussgl-helper\index.html",
  Join-Path $workspace "apfs_forecast.html",
  Join-Path $workspace "federal-accounting-treatment-manual.xls"
)

foreach ($app in $apps) {
  if (Test-Path $app) {
    Start-Process $app
  }
}

# Localhost app shortcuts (open if already running)
Start-Process "http://localhost:3000"
Start-Process "http://localhost:3001"
Start-Process "http://localhost:3002"
