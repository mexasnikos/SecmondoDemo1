@echo off
echo ========================================
echo Setting up addons_cover table
echo ========================================
echo.

cd /d "%~dp0"

node setup-addons-cover.js

echo.
echo ========================================
echo Setup complete!
echo ========================================
pause









