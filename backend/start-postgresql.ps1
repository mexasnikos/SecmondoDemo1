# Start PostgreSQL Server Script
Write-Host "🚀 Starting Travel Insurance PostgreSQL Server..." -ForegroundColor Green
Write-Host "📊 Setting up environment..." -ForegroundColor Cyan

# Add PostgreSQL to PATH
$env:PATH += ";C:\Program Files\PostgreSQL\17\bin"

# Change to backend directory
Set-Location -Path (Join-Path $PSScriptRoot ".")

# Start the server
Write-Host "🗄️  Starting server on port 5000..." -ForegroundColor Yellow
node server.js
