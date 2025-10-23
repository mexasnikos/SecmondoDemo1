@echo off
REM Setup SOAP Audit Table for TravelInsurance
REM This script creates the database table and all associated views/functions

echo.
echo ╔════════════════════════════════════════════════════╗
echo ║     SOAP Audit Table Setup for TravelInsurance    ║
echo ╚════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

echo 🔄 Running setup script...
echo.

node setup-soap-audit.js

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ═══════════════════════════════════════════════════════
    echo ✅ Setup completed successfully!
    echo ═══════════════════════════════════════════════════════
    echo.
    echo You can now start the proxy server with:
    echo    cd ..\server
    echo    node proxy-server.js
    echo.
) else (
    echo.
    echo ═══════════════════════════════════════════════════════
    echo ❌ Setup failed. Please check the error messages above.
    echo ═══════════════════════════════════════════════════════
    echo.
)

pause

