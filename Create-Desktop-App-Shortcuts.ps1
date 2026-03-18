$ErrorActionPreference = 'Stop'

$desk = [Environment]::GetFolderPath('Desktop')
$ws = 'C:\Users\jtimb\.openclaw\workspace'
$w = New-Object -ComObject WScript.Shell

function New-Shortcut {
  param(
    [string]$Name,
    [string]$Target,
    [string]$Arguments = '',
    [string]$WorkingDirectory = $ws
  )
  $path = Join-Path $desk ($Name + '.lnk')
  $s = $w.CreateShortcut($path)
  $s.TargetPath = $Target
  if ($Arguments) { $s.Arguments = $Arguments }
  $s.WorkingDirectory = $WorkingDirectory
  $s.Save()
  Write-Host "Created: $path"
}

New-Shortcut -Name 'App Launcher Hub' -Target 'C:\Windows\System32\mshta.exe' -Arguments '"C:\Users\jtimb\.openclaw\workspace\App-Launcher-Hub.hta"'
New-Shortcut -Name 'Open Federal Accounting Manual (Excel)' -Target (Join-Path $ws 'Open-Federal-Accounting-Manual.cmd')
