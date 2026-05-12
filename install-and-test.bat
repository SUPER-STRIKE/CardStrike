@echo off
set "ROOT=%~dp0"
cd /d "%ROOT%"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js not found. Install from https://nodejs.org and reopen this window.
  pause
  exit /b 1
)
call npm install
if errorlevel 1 (
  echo npm install failed. See messages above.
  pause
  exit /b 1
)
call npm run build:meta
call npm run test:cards
pause
