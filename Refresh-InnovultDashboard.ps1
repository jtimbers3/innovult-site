$ErrorActionPreference = 'SilentlyContinue'

$dashboardPath = 'C:\Users\jtimb\.openclaw\workspace\Innovult-Recruiting-Dashboard.html'
$desktopDashboardPath = 'C:\Users\jtimb\Desktop\Innovult-Recruiting-Dashboard.html'

$generated = (Get-Date).ToString('yyyy-MM-dd h:mm tt') + ' ET'

$content = Get-Content $dashboardPath -Raw
$content = [regex]::Replace($content, 'Generated:\s*[^•<]+', "Generated: $generated")
Set-Content -Path $dashboardPath -Value $content -Encoding UTF8
Copy-Item $dashboardPath $desktopDashboardPath -Force
