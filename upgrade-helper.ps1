# Upgrade Helper Script for TravelInsurance Demo
# Run this in PowerShell to help with version upgrades

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("check", "backup", "clean", "node18", "node20", "upgrade-router", "test", "rollback")]
    [string]$Action = "check"
)

$ProjectRoot = "C:\Users\laptop-123\TravelInsurance_Demo_2"
Set-Location $ProjectRoot

Write-Host "=== TravelInsurance Upgrade Helper ===" -ForegroundColor Cyan
Write-Host ""

switch ($Action) {
    "check" {
        Write-Host "📊 Current Environment Status:" -ForegroundColor Green
        Write-Host ""
        
        # Check Node version
        Write-Host "Node.js Version:" -ForegroundColor Yellow
        node --version
        
        # Check npm version
        Write-Host "`nnpm Version:" -ForegroundColor Yellow
        npm --version
        
        # Check if NVM is installed
        Write-Host "`nNVM Status:" -ForegroundColor Yellow
        try {
            nvm version
            Write-Host "✅ NVM is installed" -ForegroundColor Green
        } catch {
            Write-Host "❌ NVM is NOT installed" -ForegroundColor Red
            Write-Host "   Install from: https://github.com/coreybutler/nvm-windows/releases" -ForegroundColor Yellow
        }
        
        # Check current dependencies
        Write-Host "`nKey Dependencies:" -ForegroundColor Yellow
        npm list react-router-dom react react-dom --depth=0
        
        # Check for running Node processes
        Write-Host "`nRunning Node Processes:" -ForegroundColor Yellow
        $nodeProcesses = Get-Process | Where-Object { $_.ProcessName -like "*node*" }
        if ($nodeProcesses) {
            $nodeProcesses | Format-Table ProcessName, Id, StartTime -AutoSize
            Write-Host "⚠️  Warning: Node processes are running" -ForegroundColor Yellow
        } else {
            Write-Host "✅ No Node processes running" -ForegroundColor Green
        }
        
        # Check git status
        Write-Host "`nGit Status:" -ForegroundColor Yellow
        git status --short | Select-Object -First 10
        
        Write-Host "`n✅ Check complete!" -ForegroundColor Green
    }
    
    "backup" {
        Write-Host "💾 Creating Backup..." -ForegroundColor Green
        Write-Host ""
        
        # Create backup branch
        $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
        $branchName = "backup-$timestamp"
        
        Write-Host "Creating backup branch: $branchName" -ForegroundColor Yellow
        git checkout -b $branchName
        
        # Save current dependencies
        Write-Host "`nSaving current dependency list..." -ForegroundColor Yellow
        npm list --depth=0 > "backup-dependencies-$timestamp.txt"
        
        # Save current versions
        $versions = @{
            node = (node --version)
            npm = (npm --version)
            timestamp = $timestamp
        }
        $versions | ConvertTo-Json | Out-File "backup-versions-$timestamp.json"
        
        Write-Host "`n✅ Backup created successfully!" -ForegroundColor Green
        Write-Host "   Branch: $branchName" -ForegroundColor Cyan
        Write-Host "   Files: backup-dependencies-$timestamp.txt" -ForegroundColor Cyan
        Write-Host "          backup-versions-$timestamp.json" -ForegroundColor Cyan
    }
    
    "clean" {
        Write-Host "🧹 Cleaning Project..." -ForegroundColor Green
        Write-Host ""
        
        # Stop Node processes
        Write-Host "Stopping Node processes..." -ForegroundColor Yellow
        Get-Process | Where-Object { $_.ProcessName -like "*node*" } | Stop-Process -Force
        Start-Sleep -Seconds 2
        
        # Clear npm cache
        Write-Host "`nClearing npm cache..." -ForegroundColor Yellow
        npm cache clean --force
        
        # Remove node_modules
        Write-Host "`nRemoving node_modules..." -ForegroundColor Yellow
        if (Test-Path "node_modules") {
            Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
        }
        
        # Remove package-lock.json
        Write-Host "`nRemoving package-lock.json..." -ForegroundColor Yellow
        if (Test-Path "package-lock.json") {
            Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
        }
        
        # Remove build cache
        Write-Host "`nRemoving build cache..." -ForegroundColor Yellow
        if (Test-Path "build") {
            Remove-Item -Recurse -Force build -ErrorAction SilentlyContinue
        }
        
        Write-Host "`n✅ Project cleaned!" -ForegroundColor Green
        Write-Host "   Run: npm install" -ForegroundColor Cyan
    }
    
    "node18" {
        Write-Host "📦 Switching to Node 18..." -ForegroundColor Green
        Write-Host ""
        
        try {
            nvm use 18
            Write-Host "`n✅ Switched to Node 18" -ForegroundColor Green
            node --version
        } catch {
            Write-Host "❌ Failed to switch Node version" -ForegroundColor Red
            Write-Host "   Make sure NVM is installed" -ForegroundColor Yellow
        }
    }
    
    "node20" {
        Write-Host "📦 Switching to Node 20..." -ForegroundColor Green
        Write-Host ""
        
        try {
            # Check if Node 20 is installed
            $installed = nvm list | Select-String "20"
            if (!$installed) {
                Write-Host "Node 20 not found. Installing..." -ForegroundColor Yellow
                nvm install 20
            }
            
            nvm use 20
            Write-Host "`n✅ Switched to Node 20" -ForegroundColor Green
            node --version
            
            Write-Host "`n⚠️  Next steps:" -ForegroundColor Yellow
            Write-Host "   1. Run: npm install" -ForegroundColor Cyan
            Write-Host "   2. Test the application" -ForegroundColor Cyan
        } catch {
            Write-Host "❌ Failed to switch Node version" -ForegroundColor Red
            Write-Host "   Make sure NVM is installed" -ForegroundColor Yellow
        }
    }
    
    "upgrade-router" {
        Write-Host "🔄 Upgrading React Router to v7..." -ForegroundColor Green
        Write-Host ""
        
        # Check Node version
        $nodeVersion = node --version
        if ($nodeVersion -match "v1[0-9]\.") {
            Write-Host "❌ Error: React Router 7 requires Node 20+" -ForegroundColor Red
            Write-Host "   Current version: $nodeVersion" -ForegroundColor Yellow
            Write-Host "   Run: .\upgrade-helper.ps1 -Action node20" -ForegroundColor Cyan
            exit 1
        }
        
        Write-Host "Updating package.json..." -ForegroundColor Yellow
        
        # Update package.json
        $packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
        $packageJson.dependencies.'react-router-dom' = "^7.9.2"
        $packageJson.engines.node = ">=20.0.0"
        $packageJson | ConvertTo-Json -Depth 10 | Set-Content "package.json"
        
        Write-Host "`nInstalling React Router 7..." -ForegroundColor Yellow
        npm install react-router-dom@latest
        
        Write-Host "`n✅ React Router upgraded!" -ForegroundColor Green
        Write-Host "   ⚠️  Review breaking changes in UPGRADE_GUIDE.md" -ForegroundColor Yellow
    }
    
    "test" {
        Write-Host "🧪 Starting Test Server..." -ForegroundColor Green
        Write-Host ""
        
        Write-Host "Setting environment variables..." -ForegroundColor Yellow
        $env:NODE_OPTIONS = "--openssl-legacy-provider"
        
        Write-Host "`nStarting React app..." -ForegroundColor Yellow
        Write-Host "   URL: http://localhost:3000" -ForegroundColor Cyan
        Write-Host "   Press Ctrl+C to stop" -ForegroundColor Cyan
        Write-Host ""
        
        npm start
    }
    
    "rollback" {
        Write-Host "⏮️  Rolling Back..." -ForegroundColor Green
        Write-Host ""
        
        # Find backup branches
        Write-Host "Available backup branches:" -ForegroundColor Yellow
        git branch | Select-String "backup"
        
        Write-Host "`n⚠️  To rollback:" -ForegroundColor Yellow
        Write-Host "   1. Choose a backup branch from above" -ForegroundColor Cyan
        Write-Host "   2. Run: git checkout <backup-branch-name>" -ForegroundColor Cyan
        Write-Host "   3. Run: .\upgrade-helper.ps1 -Action clean" -ForegroundColor Cyan
        Write-Host "   4. Run: npm install" -ForegroundColor Cyan
    }
}

Write-Host ""
Write-Host "For more information, see UPGRADE_GUIDE.md" -ForegroundColor Gray



