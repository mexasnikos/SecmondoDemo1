Set-Location "c:\Users\laptop-123\TravelInsurance_Demo_2"
Write-Host "Starting HTTP server on port 3000..."
Write-Host "Access your site at: http://localhost:3000"
Write-Host "Press Ctrl+C to stop the server"
& http-server build -p 3000 -o
