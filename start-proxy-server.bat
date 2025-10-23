@echo off
REM Start Terracotta Proxy Server with SOAP Logging

echo.
echo ╔════════════════════════════════════════════════════╗
echo ║    Starting Terracotta Proxy Server (Port 3001)   ║
echo ╚════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0\server"

echo 🚀 Starting proxy server...
echo 📊 SOAP logs will be automatically saved to database
echo 🔗 Dashboard: %~dp0backend\soap-monitor-dashboard.html
echo.
echo Press Ctrl+C to stop the server
echo.

node proxy-server.js

pause

