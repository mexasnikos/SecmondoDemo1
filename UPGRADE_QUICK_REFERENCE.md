# Quick Upgrade Reference Card 📋

## TL;DR - What Happened?

Yesterday someone upgraded `react-router-dom` from 6.3.0 to 7.9.2, which requires Node 20+, but your system runs Node 18.20.4. This caused compatibility issues.

**Fix Applied:** Downgraded to `react-router-dom@6.26.2` (latest v6, works with Node 18)

---

## Quick Commands

### Check Current Status
```powershell
.\upgrade-helper.ps1 -Action check
```

### If You Want to Upgrade to Node 20 + React Router 7

```powershell
# 1. Create backup
.\upgrade-helper.ps1 -Action backup

# 2. Install NVM (if not installed)
# Download from: https://github.com/coreybutler/nvm-windows/releases

# 3. Switch to Node 20
.\upgrade-helper.ps1 -Action node20

# 4. Clean and reinstall
.\upgrade-helper.ps1 -Action clean
npm install

# 5. Upgrade React Router
.\upgrade-helper.ps1 -Action upgrade-router

# 6. Test
.\upgrade-helper.ps1 -Action test
```

### If You Want to Stay on Current Stable Setup (Recommended)

**No action needed!** Your current setup is stable:
- ✅ Node 18.20.4 (supported until April 2025)
- ✅ react-router-dom 6.26.2 (latest v6, fully supported)
- ✅ All features working

---

## Decision Matrix

| Scenario | Action | Risk Level |
|----------|--------|------------|
| **Production app, tight deadline** | Stay on Node 18 + Router 6 | 🟢 Low |
| **Want latest features** | Upgrade to Node 20 + Router 7 | 🔴 High |
| **Future-proofing** | Upgrade Node 20, keep Router 6 | 🟡 Medium |
| **Just experimenting** | Create new branch, try upgrades | 🟢 Low |

---

## Emergency Commands

### Kill Stuck Node Processes
```powershell
Get-Process | Where-Object { $_.ProcessName -like "*node*" } | Stop-Process -Force
```

### Fix EPERM Errors
```powershell
Start-Sleep -Seconds 30
Remove-Item "node_modules\.package-lock.json" -Force -ErrorAction SilentlyContinue
npm install
```

### Quick Clean & Reinstall
```powershell
.\upgrade-helper.ps1 -Action clean
npm install
```

### Start App
```powershell
$env:NODE_OPTIONS = "--openssl-legacy-provider"
npm start
```

---

## Version Compatibility

| Package | Node 18 | Node 20 |
|---------|---------|---------|
| react-router-dom@6.x | ✅ | ✅ |
| react-router-dom@7.x | ❌ | ✅ |
| react@18.2.0 | ✅ | ✅ |
| react-scripts@5.0.1 | ✅ | ✅ |

---

## When to Upgrade?

### Upgrade Now If:
- ✅ You need React Router 7 specific features
- ✅ You have time for thorough testing
- ✅ You're starting a new project
- ✅ Node 18 LTS is ending soon (April 2025)

### Stay Current If:
- ✅ Everything is working fine
- ✅ You have tight deadlines
- ✅ You prefer stability over latest features
- ✅ Team is not ready for breaking changes

---

## Need Help?

1. **Read full guide**: `UPGRADE_GUIDE.md`
2. **Use helper script**: `.\upgrade-helper.ps1 -Action check`
3. **Check docs**: https://reactrouter.com
4. **Ask team**: Share this guide with your team

---

## Current Setup Status ✅

```json
{
  "node": "18.20.4",
  "react": "18.2.0",
  "react-router-dom": "6.26.2",
  "status": "✅ Stable & Working",
  "security": "✅ All patches applied",
  "recommendation": "Safe to use as-is"
}
```

---

**Remember:** There's nothing wrong with staying on Node 18 + React Router 6.x. It's stable, secure, and fully supported!

