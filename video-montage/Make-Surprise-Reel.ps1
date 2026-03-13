$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$input = Join-Path $root 'source.jpg'
$output = Join-Path $root 'surprise-reel-15s-1080x1920.mp4'

if (-not (Test-Path $input)) {
  Write-Host "Source image not found: $input" -ForegroundColor Red
  exit 1
}

$ffmpeg = Get-Command ffmpeg -ErrorAction SilentlyContinue
if (-not $ffmpeg) {
  Write-Host "ffmpeg is required but not installed or not on PATH." -ForegroundColor Yellow
  Write-Host "Install quickly with: winget install -e --id Gyan.FFmpeg" -ForegroundColor Cyan
  exit 1
}

# 15s vertical cinematic reel (surprise style: film + neon tint + gentle motion)
# Input is scaled/cropped to 1080x1920, then animated with slow zoom/pan and grade.
$vf = @(
  "scale=1080:1920:force_original_aspect_ratio=increase",
  "crop=1080:1920",
  "zoompan=z='min(1.0+0.0009*on,1.14)':x='iw/2-(iw/zoom/2)+sin(on/45)*18':y='ih/2-(ih/zoom/2)+cos(on/55)*24':d=1:s=1080x1920:fps=30",
  "eq=contrast=1.07:brightness=0.015:saturation=1.20",
  "colorbalance=rs=0.03:gs=0.01:bs=0.02",
  "vignette=PI/5",
  "unsharp=5:5:0.6:3:3:0.0",
  "format=yuv420p"
) -join ','

& ffmpeg -y -loop 1 -i $input -t 15 `
  -vf $vf `
  -r 30 -c:v libx264 -pix_fmt yuv420p -movflags +faststart $output

if (Test-Path $output) {
  Write-Host "Done: $output" -ForegroundColor Green
  Start-Process $output
} else {
  Write-Host "Render failed." -ForegroundColor Red
  exit 1
}
