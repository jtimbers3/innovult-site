$ErrorActionPreference = 'Continue'
$prefix = 'http://127.0.0.1:8765/'
$workspace = 'C:\Users\jtimb\.openclaw\workspace'
$dashboard = Join-Path $workspace 'Innovult-Recruiting-Dashboard.html'
$refreshScript = Join-Path $workspace 'Refresh-InnovultDashboard.ps1'
$logoPath = Join-Path $workspace 'public\innovult-logo.jpg'

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Host "Innovult refresh server listening on $prefix"

while ($listener.IsListening) {
  try {
    $ctx = $listener.GetContext()
    $path = $ctx.Request.Url.AbsolutePath.ToLowerInvariant()

    if ($path -eq '/refresh') {
      powershell -ExecutionPolicy Bypass -File $refreshScript | Out-Null
      $ctx.Response.StatusCode = 302
      $ctx.Response.RedirectLocation = '/dashboard'
      $ctx.Response.Close()
      continue
    }

    if ($path -eq '/innovult-logo.jpg') {
      if (Test-Path $logoPath) {
        $bytes = [System.IO.File]::ReadAllBytes($logoPath)
        $ctx.Response.ContentType = 'image/jpeg'
        $ctx.Response.AddHeader('Access-Control-Allow-Origin','*')
        $ctx.Response.ContentLength64 = $bytes.Length
        $ctx.Response.OutputStream.Write($bytes,0,$bytes.Length)
        $ctx.Response.OutputStream.Close()
      } else {
        $ctx.Response.StatusCode = 404
        $ctx.Response.Close()
      }
      continue
    }

    if ($path -eq '/dashboard' -or $path -eq '/') {
      $html = Get-Content $dashboard -Raw
      $bytes = [System.Text.Encoding]::UTF8.GetBytes($html)
      $ctx.Response.ContentType = 'text/html; charset=utf-8'
      $ctx.Response.AddHeader('Access-Control-Allow-Origin','*')
      $ctx.Response.ContentLength64 = $bytes.Length
      $ctx.Response.OutputStream.Write($bytes,0,$bytes.Length)
      $ctx.Response.OutputStream.Close()
      continue
    }

    $ctx.Response.StatusCode = 404
    $ctx.Response.Close()
  } catch {
    Start-Sleep -Milliseconds 200
  }
}
