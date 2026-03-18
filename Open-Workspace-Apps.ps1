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

# Start local dev apps and open URLs
$startupScripts = @(
  Join-Path $workspace "Start-Innovult-Site.cmd",
  Join-Path $workspace "Start-Mission-Control.cmd",
  Join-Path $workspace "Start-Oscar-Couples-App.cmd"
)

foreach ($script in $startupScripts) {
  if (Test-Path $script) {
    Start-Process $script
  }
}
