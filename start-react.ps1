Write-Host "🚀 Starting TravelSafe React App..." -ForegroundColor Green
Write-Host "📂 Project Directory: c:\Users\laptop-123\TravelInsurance_Demo_2" -ForegroundColor Cyan

Set-Location "c:\Users\laptop-123\TravelInsurance_Demo_2"

Write-Host "🔧 Setting Node.js environment..." -ForegroundColor Yellow
$env:NODE_OPTIONS = "--openssl-legacy-provider"

Write-Host "▶️ Starting development server..." -ForegroundColor Green
Write-Host "   Your site will be available at: http://localhost:3000" -ForegroundColor White

npm start
