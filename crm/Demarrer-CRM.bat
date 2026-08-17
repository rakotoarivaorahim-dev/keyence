@echo off
cd /d "%~dp0"
if not exist node_modules (
  echo Installation des dependances (premiere fois, ca peut prendre une minute)...
  call npm install
)
call npm run launch
pause
