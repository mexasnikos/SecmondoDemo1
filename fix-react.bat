@echo off
echo Fixing React Development Environment...

cd /d "c:\Users\laptop-123\TravelInsurance_Demo_2"

echo Stopping any existing Node processes...
taskkill /F /IM node.exe 2>nul

echo Cleaning up corrupted dependencies...
rmdir /s /q node_modules 2>nul
del package-lock.json 2>nul

echo Installing dependencies with specific versions...
call npm install

echo Starting development server...
call npm start

pause
