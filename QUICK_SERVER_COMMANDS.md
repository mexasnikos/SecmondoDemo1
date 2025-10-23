# Quick Server Management Commands

## 🎯 One-Command Solutions

### Start All Servers
```powershell
.\start-all-servers.ps1
```

### Stop All Servers
```powershell
.\stop-all-servers.ps1
```

### Check Server Status
```powershell
.\check-servers.ps1
```

### Restart All Servers
```powershell
.\restart-servers.ps1
```

---

## 📖 Manual Commands (If You Prefer)

### Start Servers Manually

```powershell
# Backend
cd backend && npm start

# Frontend (in a new terminal)
npm start

# Proxy (in a new terminal)
npm run proxy-server
```

### Check Status
```powershell
netstat -ano | findstr ":3000 :3001 :5002"
```

### Kill All Servers
```powershell
Get-NetTCPConnection -LocalPort 3000,3001,5002 -ErrorAction SilentlyContinue | ForEach-Object { taskkill /F /PID $_.OwningProcess }
```

---

## 🔗 Quick Access URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend Health | http://localhost:5002/api/health |
| Proxy Health | http://localhost:3001/health |
| SOAP Logs | http://localhost:3001/api/soap-logs |

---

## 📚 Full Documentation

For detailed information, see: **SERVER_MANAGEMENT_GUIDE.md**

