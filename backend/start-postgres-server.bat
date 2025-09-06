@echo off
echo Setting up PostgreSQL environment...
set PATH=%PATH%;C:\Program Files\PostgreSQL\17\bin
echo Starting Travel Insurance PostgreSQL Server...
cd /d "%~dp0"
node server.js
pause
