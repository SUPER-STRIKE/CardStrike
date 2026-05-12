$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $root

Write-Host "Project: $root" -ForegroundColor Cyan

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Host "Node.js is not installed or not on PATH." -ForegroundColor Red
  Write-Host "Install LTS from https://nodejs.org then close and reopen this terminal." -ForegroundColor Yellow
  exit 1
}

Write-Host "node $(node -v)" -ForegroundColor Green

# Use npm.cmd so this works when ExecutionPolicy blocks npm.ps1
$npm = if (Get-Command npm.cmd -ErrorAction SilentlyContinue) { "npm.cmd" } else { "npm" }
& $npm -v
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

& $npm install
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Done. Run: $npm run build:meta" -ForegroundColor Green
Write-Host "      then: $npm run test:cards" -ForegroundColor Green
