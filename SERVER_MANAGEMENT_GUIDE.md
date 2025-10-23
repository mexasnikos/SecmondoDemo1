# Server Management Guide

Complete guide to start, stop, and check the status of Frontend, Backend, and Proxy servers.

---

## 🚀 Starting the Servers

### Option 1: Start All Servers at Once (Recommended for Development)

```powershell
# From the project root directory
# Start backend (runs in background)
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd backend; npm start"

# Start frontend (runs in background)
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "npm start"

# Start proxy server (runs in background)
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "npm run proxy-server"
```

### Option 2: Start Each Server Individually

#### 1. Backend Server (Port 5002)
```powershell
# Navigate to backend directory and start
cd backend
npm start

# Or from root directory:
cd backend && npm start
```
**Expected Output:**
```
🚀 Travel Insurance API server running on port 5002
📊 Health check: http://localhost:5002/api/health
🗄️  Database test: http://localhost:5002/api/db-test
🌐 Server accessible from: http://0.0.0.0:5002
```

#### 2. Frontend Server (Port 3000)
```powershell
# From project root directory
npm start
```
**Expected Output:**
```
Compiled successfully!
You can now view travel-insurance-demo in the browser.
  Local:            http://localhost:3000
  On Your Network:  http://192.168.1.x:3000
```

#### 3. Proxy Server (Port 3001)
```powershell
# From project root directory
npm run proxy-server
```
**Expected Output:**
```
🚀 Terracotta Proxy Server running on http://localhost:3001
📡 Proxying requests to: https://www.asuaonline.com/ws/integratedquote.asmx
🔗 Health check: http://localhost:3001/health
📊 SOAP Logs: http://localhost:3001/api/soap-logs
```

---

## 🔍 Checking Server Status

### Method 1: Check All Ports at Once
```powershell
netstat -ano | findstr ":3000 :3001 :5002"
```

**Expected Output (All Running):**
```
TCP    0.0.0.0:3000           0.0.0.0:0              LISTENING       <PID>
TCP    0.0.0.0:3001           0.0.0.0:0              LISTENING       <PID>
TCP    0.0.0.0:5002           0.0.0.0:0              LISTENING       <PID>
```

### Method 2: Check Individual Ports
```powershell
# Check Frontend (Port 3000)
netstat -ano | findstr ":3000"

# Check Proxy (Port 3001)
netstat -ano | findstr ":3001"

# Check Backend (Port 5002)
netstat -ano | findstr ":5002"
```

### Method 3: Test Health Endpoints
```powershell
# Test Backend Health
curl http://localhost:5002/api/health

# Test Proxy Health
curl http://localhost:3001/health

# Test Frontend (should return HTML)
curl http://localhost:3000
```

### Method 4: Using PowerShell to Get Nice Output
```powershell
# Check all three servers with detailed info
$ports = @(3000, 3001, 5002)
$services = @("Frontend", "Proxy", "Backend")

for ($i = 0; $i -lt $ports.Length; $i++) {
    $port = $ports[$i]
    $service = $services[$i]
    $connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    
    if ($connection) {
        Write-Host "✅ $service is RUNNING on port $port (PID: $($connection.OwningProcess))" -ForegroundColor Green
    } else {
        Write-Host "❌ $service is NOT running on port $port" -ForegroundColor Red
    }
}
```

---

## 🛑 Stopping/Killing the Servers

### Method 1: Stop by Port Number (Recommended)

#### Kill All Servers at Once
```powershell
# Find and kill all three servers
$ports = @(3000, 3001, 5002)
foreach ($port in $ports) {
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connections) {
        foreach ($conn in $connections) {
            $pid = $conn.OwningProcess
            Write-Host "Killing process on port $port (PID: $pid)"
            taskkill /F /PID $pid
        }
    }
}
```

#### Kill Individual Servers by Port
```powershell
# Kill Frontend (Port 3000)
$conn = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($conn) { taskkill /F /PID $conn.OwningProcess }

# Kill Proxy (Port 3001)
$conn = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
if ($conn) { taskkill /F /PID $conn.OwningProcess }

# Kill Backend (Port 5002)
$conn = Get-NetTCPConnection -LocalPort 5002 -ErrorAction SilentlyContinue
if ($conn) { taskkill /F /PID $conn.OwningProcess }
```

### Method 2: Stop by Process ID (PID)
```powershell
# First, find the PID using netstat
netstat -ano | findstr ":5002"

# Then kill using the PID (replace <PID> with actual number)
taskkill /F /PID <PID>

# Example:
taskkill /F /PID 15464
```

### Method 3: Using Ctrl+C
If you started the servers in terminal windows, you can:
1. Switch to the terminal window running the server
2. Press `Ctrl + C` to gracefully stop the server
3. If it doesn't stop, press `Ctrl + C` again

### Method 4: Kill All Node Processes (Nuclear Option - Use with Caution!)
```powershell
# This will kill ALL Node.js processes
taskkill /F /IM node.exe

# Warning: This will kill ALL Node applications running on your system!
```

---

## 🔄 Complete Restart Workflow

### Full Restart with Status Check

```powershell
# 1. Kill all servers
Write-Host "Stopping all servers..." -ForegroundColor Yellow
$ports = @(3000, 3001, 5002)
foreach ($port in $ports) {
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connections) {
        foreach ($conn in $connections) {
            taskkill /F /PID $conn.OwningProcess 2>$null
        }
    }
}

# 2. Wait for ports to be freed
Start-Sleep -Seconds 2

# 3. Start Backend
Write-Host "Starting Backend..." -ForegroundColor Cyan
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd backend; npm start"

# 4. Wait for backend to initialize
Start-Sleep -Seconds 3

# 5. Start Frontend
Write-Host "Starting Frontend..." -ForegroundColor Cyan
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "npm start"

# 6. Start Proxy
Write-Host "Starting Proxy..." -ForegroundColor Cyan
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "npm run proxy-server"

# 7. Wait for all to start
Start-Sleep -Seconds 5

# 8. Check status
Write-Host "`nChecking server status..." -ForegroundColor Green
netstat -ano | findstr ":3000 :3001 :5002"
```

---

## 🐛 Troubleshooting

### Problem: Port Already in Use
**Error:** `Error: listen EADDRINUSE: address already in use 0.0.0.0:XXXX`

**Solution:**
```powershell
# Find what's using the port
netstat -ano | findstr ":XXXX"

# Kill the process
taskkill /F /PID <PID>
```

### Problem: Missing Dependencies
**Error:** `Error: Cannot find module 'pg'` or similar

**Solution:**
```powershell
# For root dependencies (Frontend & Proxy)
npm install

# For backend dependencies
cd backend
npm install
```

### Problem: Database Connection Failed
**Error:** `password authentication failed for user "postgres"`

**Solution:**
Check your `.env` file or environment variables for correct database credentials:
```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=travel_insurance
DB_PASSWORD=your_password
DB_PORT=5432
```

### Problem: Frontend Won't Start
**Error:** `Something is already running on port 3000`

**Options:**
1. Kill the existing process:
   ```powershell
   $conn = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
   if ($conn) { taskkill /F /PID $conn.OwningProcess }
   ```
2. Or run on a different port (not recommended for consistency)

---

## 📋 Quick Reference Commands

### Check if running:
```powershell
netstat -ano | findstr ":3000 :3001 :5002"
```

### Start all (separate windows):
```powershell
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd backend; npm start"
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "npm start"
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "npm run proxy-server"
```

### Kill all:
```powershell
Get-NetTCPConnection -LocalPort 3000,3001,5002 -ErrorAction SilentlyContinue | ForEach-Object { taskkill /F /PID $_.OwningProcess }
```

### Test health:
```powershell
curl http://localhost:5002/api/health
curl http://localhost:3001/health
curl http://localhost:3000
```

---

## 🌐 Server URLs Reference

| Service | Port | URL | Health Check |
|---------|------|-----|--------------|
| Frontend | 3000 | http://localhost:3000 | http://localhost:3000 |
| Proxy | 3001 | http://localhost:3001 | http://localhost:3001/health |
| Backend | 5002 | http://localhost:5002 | http://localhost:5002/api/health |

---

## 💡 Pro Tips

1. **Always start Backend first** - Frontend and Proxy depend on it
2. **Use separate terminal windows** - Easier to monitor logs
3. **Save restart scripts** - Create `.ps1` files for common operations
4. **Check logs** - Each server outputs useful debugging information
5. **Database must be running** - Ensure PostgreSQL is running before starting Backend

---

## 🔗 Additional Resources

- Backend API Documentation: `backend/README.md`
- SOAP Audit Guide: `backend/SOAP_AUDIT_QUICKSTART.md`
- Database Setup: `DATABASE_SETUP_GUIDE.md`
- Quick Start: `QUICK_START.md`

