$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

$requiredFiles = @(
  'AGENTS.md',
  'SOUL.md',
  'USER.md',
  'IDENTITY.md',
  'TOOLS.md',
  'HEARTBEAT.md'
)

$missing = @()
foreach ($f in $requiredFiles) {
  if (-not (Test-Path $f)) { $missing += $f }
}

Write-Host '== OpenClaw Workspace Validation ==' -ForegroundColor Cyan
Write-Host "Root: $root"

if ($missing.Count -gt 0) {
  Write-Host "`nMissing required files:" -ForegroundColor Red
  $missing | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
  exit 1
}

Write-Host "`nRequired files: OK" -ForegroundColor Green

if (-not (Test-Path 'memory')) {
  Write-Host "memory/: missing (creating...)" -ForegroundColor Yellow
  New-Item -ItemType Directory -Path 'memory' | Out-Null
} else {
  Write-Host "memory/: OK" -ForegroundColor Green
}

$today = Get-Date -Format 'yyyy-MM-dd'
$todayFile = "memory/$today.md"
if (Test-Path $todayFile) {
  Write-Host "Today's memory file: OK ($todayFile)" -ForegroundColor Green
} else {
  Write-Host "Today's memory file: missing ($todayFile)" -ForegroundColor Yellow
}

if (Test-Path 'MEMORY.md') {
  Write-Host 'Long-term memory (MEMORY.md): OK' -ForegroundColor Green
} else {
  Write-Host 'Long-term memory (MEMORY.md): missing' -ForegroundColor Yellow
}

if (Test-Path 'BOOTSTRAP.md') {
  Write-Host 'BOOTSTRAP.md still present (onboarding may still be in progress).' -ForegroundColor Yellow
} else {
  Write-Host 'BOOTSTRAP.md removed (onboarding appears complete).' -ForegroundColor Green
}

Write-Host "`nValidation complete." -ForegroundColor Cyan
exit 0
