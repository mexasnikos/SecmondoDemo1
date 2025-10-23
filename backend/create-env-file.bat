@echo off
REM Create .env file for TravelInsurance project

echo.
echo ╔════════════════════════════════════════════════════╗
echo ║         Creating .env Configuration File          ║
echo ╚════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0\.."

echo Creating .env file in: %CD%
echo.

REM Create .env file with default configuration
(
echo DB_USER=postgres
echo DB_PASSWORD=password
echo DB_HOST=localhost
echo DB_PORT=5432
echo DB_NAME=travel_insurance
) > .env

echo ✅ .env file created successfully!
echo.
echo ⚠️  IMPORTANT: You need to update the DB_PASSWORD!
echo.
echo 📝 Next steps:
echo    1. Open .env file in the project root
echo    2. Change DB_PASSWORD=password to your actual PostgreSQL password
echo    3. Save the file
echo    4. Restart the proxy server
echo.
echo 🔍 Common PostgreSQL passwords to try:
echo    - password
echo    - postgres
echo    - admin
echo    - [your Windows password]
echo    - [empty - remove the password value entirely]
echo.
echo 📍 File location: %CD%\.env
echo.

pause

