# Check Server Status Script
# This script checks if Backend, Frontend, and Proxy servers are running

Write-Host ""
Write-Host "📊 Travel Insurance Application - Server Status Check" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

$ports = @(
    @{Port=5002; Name="Backend API"; Url="http://localhost:5002/api/health"},
    @{Port=3000; Name="Frontend App"; Url="http://localhost:3000"},
    @{Port=3001; Name="Proxy Server"; Url="http://localhost:3001/health"}
)

$runningCount = 0
$totalServers = $ports.Length

foreach ($server in $ports) {
    $connection = Get-NetTCPConnection -LocalPort $server.Port -ErrorAction SilentlyContinue
    
    Write-Host "[$($server.Name)]" -ForegroundColor White -NoNewline
    Write-Host " (Port: $($server.Port))" -ForegroundColor Gray
    
    if ($connection) {
        $processId = $connection.OwningProcess
        Write-Host "  Status:  " -NoNewline
        Write-Host "✅ RUNNING" -ForegroundColor Green
        Write-Host "  PID:     $processId" -ForegroundColor Gray
        Write-Host "  URL:     $($server.Url)" -ForegroundColor Cyan
        $runningCount++
        
        # Try to ping health endpoint (except frontend)
        if ($server.Port -ne 3000) {
            try {
                $response = Invoke-WebRequest -Uri $server.Url -TimeoutSec 2 -ErrorAction SilentlyContinue
                if ($response.StatusCode -eq 200) {
                    Write-Host "  Health:  " -NoNewline
                    Write-Host "✅ OK" -ForegroundColor Green
                }
            } catch {
                Write-Host "  Health:  " -NoNewline
                Write-Host "⚠️  Unreachable" -ForegroundColor Yellow
            }
        }
    } else {
        Write-Host "  Status:  " -NoNewline
        Write-Host "❌ NOT RUNNING" -ForegroundColor Red
    }
    
    Write-Host ""
}

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "Summary: " -NoNewline -ForegroundColor White

if ($runningCount -eq $totalServers) {
    Write-Host "✅ All $totalServers servers are running!" -ForegroundColor Green
} elseif ($runningCount -gt 0) {
    Write-Host "⚠️  $runningCount of $totalServers servers are running" -ForegroundColor Yellow
} else {
    Write-Host "❌ No servers are running" -ForegroundColor Red
}

Write-Host ""

# Show detailed port usage
Write-Host "📡 Detailed Port Information:" -ForegroundColor Cyan
$netstat = netstat -ano | Select-String ":3000|:3001|:5002" | Select-Object -First 10
if ($netstat) {
    $netstat | ForEach-Object { Write-Host $_ -ForegroundColor Gray }
} else {
    Write-Host "  No servers detected on monitored ports." -ForegroundColor Gray
}

Write-Host ""

