$ErrorActionPreference = 'Stop'

$workspace = 'C:\Users\jtimb\.openclaw\workspace'
$dashboardPath = Join-Path $workspace 'Innovult-Recruiting-Dashboard.html'
$desktopDashboardPath = 'C:\Users\jtimb\Desktop\Innovult-Recruiting-Dashboard.html'
$subagentsPath = Join-Path $workspace 'Innovult-Subagents.html'
$refreshTrackerScript = Join-Path $workspace 'refresh-pursuit-tracker.ps1'
$syncMissionControlScript = Join-Path $workspace 'sync-mission-control.ps1'

# Always run refresh pipelines first (even if external data is unchanged)
if (Test-Path $refreshTrackerScript) {
  & powershell -NoProfile -ExecutionPolicy Bypass -File $refreshTrackerScript | Out-Null
}
if (Test-Path $syncMissionControlScript) {
  & powershell -NoProfile -ExecutionPolicy Bypass -File $syncMissionControlScript -Workspace $workspace | Out-Null
}

$now = Get-Date
$generated = $now.ToString('yyyy-MM-dd h:mm tt') + ' ET'
$refreshStamp = $now.ToString('yyyy-MM-dd HH:mm:ss zzz')
$runId = [DateTimeOffset]::Now.ToUnixTimeSeconds()

# Update main dashboard metadata every run so refresh is visible any day
$content = Get-Content $dashboardPath -Raw
$content = [regex]::Replace($content, 'Generated:\s*[^<\r\n]+', "Generated: $generated")

if ($content -match 'Last Refresh Run:') {
  $content = [regex]::Replace($content, 'Last Refresh Run:\s*[^<\r\n]+', "Last Refresh Run: #$runId at $refreshStamp")
} else {
  $content = $content -replace '(</div>\s*\r?\n\s*<div class="card">)', "</div>`r`n  <div class=`"muted`">Last Refresh Run: #$runId at $refreshStamp</div>`r`n`r`n  <div class=`"card`">"
}

Set-Content -Path $dashboardPath -Value $content -Encoding UTF8
Copy-Item $dashboardPath $desktopDashboardPath -Force

# Touch sub-dashboard artifacts too so all windows reflect current refresh cycle
if (Test-Path $subagentsPath) {
  $sub = Get-Content $subagentsPath -Raw
  if ($sub -match 'Last Refresh Run:') {
    $sub = [regex]::Replace($sub, 'Last Refresh Run:\s*[^<\r\n]+', "Last Refresh Run: #$runId at $refreshStamp")
  } else {
    $sub = $sub -replace '(</h1>)', "</h1><p>Last Refresh Run: #$runId at $refreshStamp</p>"
  }
  Set-Content -Path $subagentsPath -Value $sub -Encoding UTF8
}

Write-Host "Refresh complete. Run #$runId at $refreshStamp"
