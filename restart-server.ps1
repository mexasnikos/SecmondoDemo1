Write-Host "🔄 Stopping any existing processes..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -like "*node*" -or $_.ProcessName -like "*cmd*"} | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host "🧹 Cleaning up..." -ForegroundColor Cyan
Start-Sleep -Seconds 2

Write-Host "🚀 Starting TravelSafe server on port 3001..." -ForegroundColor Green
Set-Location "c:\Users\laptop-123\TravelInsurance_Demo_2"
$env:PORT = "3001"
node dev-server.js
