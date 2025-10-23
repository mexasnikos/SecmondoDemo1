# Start All Servers Script
# This script starts Backend, Frontend, and Proxy servers in separate windows

Write-Host "🚀 Starting Travel Insurance Application Servers..." -ForegroundColor Cyan
Write-Host ""

# Start Backend Server
Write-Host "📦 Starting Backend Server (Port 5002)..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm start"
Start-Sleep -Seconds 2

# Start Frontend Server
Write-Host "🎨 Starting Frontend Server (Port 3000)..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; npm start"
Start-Sleep -Seconds 2

# Start Proxy Server
Write-Host "🔄 Starting Proxy Server (Port 3001)..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; npm run proxy-server"

# Wait for servers to start
Write-Host ""
Write-Host "⏳ Waiting for servers to initialize..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

# Check server status
Write-Host ""
Write-Host "📊 Checking Server Status..." -ForegroundColor Green
Write-Host ""

$ports = @(
    @{Port=5002; Name="Backend"; Color="Blue"},
    @{Port=3000; Name="Frontend"; Color="Green"},
    @{Port=3001; Name="Proxy"; Color="Magenta"}
)

foreach ($server in $ports) {
    $connection = Get-NetTCPConnection -LocalPort $server.Port -ErrorAction SilentlyContinue
    
    if ($connection) {
        Write-Host "✅ $($server.Name) Server is RUNNING on port $($server.Port)" -ForegroundColor $server.Color
    } else {
        Write-Host "❌ $($server.Name) Server FAILED to start on port $($server.Port)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🌐 Application URLs:" -ForegroundColor Cyan
Write-Host "   Frontend:  http://localhost:3000" -ForegroundColor White
Write-Host "   Backend:   http://localhost:5002/api/health" -ForegroundColor White
Write-Host "   Proxy:     http://localhost:3001/health" -ForegroundColor White
Write-Host ""
Write-Host "✨ All servers started! Check the separate terminal windows for logs." -ForegroundColor Green

