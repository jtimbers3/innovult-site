$workspace = "C:\Users\jtimb\.openclaw\workspace"
$apps = @(
  Join-Path $workspace "App-Launcher-Hub.html",
  Join-Path $workspace "Innovult-Recruiting-Dashboard.html",
  Join-Path $workspace "Innovult-Subagents.html",
  Join-Path $workspace "ussgl-helper\index.html",
  Join-Path $workspace "apfs_forecast.html"
)

foreach ($app in $apps) {
  if (Test-Path $app) {
    Start-Process $app
  }
}
