# Restart All Servers Script
# This script stops all running servers and starts them fresh

Write-Host ""
Write-Host "🔄 Restarting Travel Insurance Application Servers..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Stop all servers
Write-Host "1️⃣  Stopping existing servers..." -ForegroundColor Yellow
Write-Host ""

$ports = @(5002, 3000, 3001)
$names = @("Backend", "Frontend", "Proxy")

for ($i = 0; $i -lt $ports.Length; $i++) {
    $port = $ports[$i]
    $name = $names[$i]
    
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    
    if ($connections) {
        foreach ($conn in $connections) {
            $processId = $conn.OwningProcess
            Write-Host "   Stopping $name (PID: $processId)..." -ForegroundColor Gray
            taskkill /F /PID $processId 2>$null | Out-Null
        }
    }
}

# Step 2: Wait for ports to be freed
Write-Host ""
Write-Host "2️⃣  Waiting for ports to be freed..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Step 3: Start Backend
Write-Host ""
Write-Host "3️⃣  Starting Backend Server..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm start"
Start-Sleep -Seconds 3

# Step 4: Start Frontend
Write-Host ""
Write-Host "4️⃣  Starting Frontend Server..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; npm start"
Start-Sleep -Seconds 2

# Step 5: Start Proxy
Write-Host ""
Write-Host "5️⃣  Starting Proxy Server..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; npm run proxy-server"

# Step 6: Wait for all servers to initialize
Write-Host ""
Write-Host "6️⃣  Waiting for servers to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Step 7: Check status
Write-Host ""
Write-Host "7️⃣  Checking server status..." -ForegroundColor Yellow
Write-Host ""

$ports = @(
    @{Port=5002; Name="Backend"},
    @{Port=3000; Name="Frontend"},
    @{Port=3001; Name="Proxy"}
)

$allRunning = $true

foreach ($server in $ports) {
    $connection = Get-NetTCPConnection -LocalPort $server.Port -ErrorAction SilentlyContinue
    
    if ($connection) {
        Write-Host "   ✅ $($server.Name) is running on port $($server.Port)" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $($server.Name) failed to start on port $($server.Port)" -ForegroundColor Red
        $allRunning = $false
    }
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

if ($allRunning) {
    Write-Host "✨ All servers restarted successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Application URLs:" -ForegroundColor Cyan
    Write-Host "   Frontend:  http://localhost:3000" -ForegroundColor White
    Write-Host "   Backend:   http://localhost:5002/api/health" -ForegroundColor White
    Write-Host "   Proxy:     http://localhost:3001/health" -ForegroundColor White
} else {
    Write-Host "⚠️  Some servers failed to start. Check the terminal windows for errors." -ForegroundColor Yellow
}

Write-Host ""

