# Stop All Servers Script
# This script stops Backend, Frontend, and Proxy servers

Write-Host "🛑 Stopping Travel Insurance Application Servers..." -ForegroundColor Yellow
Write-Host ""

$ports = @(
    @{Port=5002; Name="Backend"},
    @{Port=3000; Name="Frontend"},
    @{Port=3001; Name="Proxy"}
)

$stoppedCount = 0

foreach ($server in $ports) {
    $connections = Get-NetTCPConnection -LocalPort $server.Port -ErrorAction SilentlyContinue
    
    if ($connections) {
        foreach ($conn in $connections) {
            $processId = $conn.OwningProcess
            Write-Host "🔄 Stopping $($server.Name) Server (Port: $($server.Port), PID: $processId)..." -ForegroundColor Cyan
            
            try {
                taskkill /F /PID $processId 2>$null | Out-Null
                Write-Host "✅ $($server.Name) Server stopped successfully" -ForegroundColor Green
                $stoppedCount++
            } catch {
                Write-Host "❌ Failed to stop $($server.Name) Server" -ForegroundColor Red
            }
        }
    } else {
        Write-Host "ℹ️  $($server.Name) Server is not running (Port: $($server.Port))" -ForegroundColor Gray
    }
}

Write-Host ""
if ($stoppedCount -gt 0) {
    Write-Host "✨ Stopped $stoppedCount server(s) successfully!" -ForegroundColor Green
} else {
    Write-Host "ℹ️  No servers were running." -ForegroundColor Gray
}

