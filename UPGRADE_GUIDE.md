# Version Upgrade Guide 🚀

This guide provides step-by-step instructions for safely upgrading Node.js and React Router versions without breaking your application.

## Current State
- **Node.js**: 18.20.4
- **react-router-dom**: 6.26.2 (downgraded from 7.9.2 for compatibility)
- **React**: 18.2.0
- **react-scripts**: 5.0.1

## Target State
- **Node.js**: 20.x or 22.x LTS
- **react-router-dom**: 7.x (latest)
- **React**: 18.2.0 (or consider 19.x if released)

---

## ⚠️ Pre-Upgrade Checklist

Before starting any upgrade:

1. **Commit all current changes**
   ```bash
   git add .
   git commit -m "Checkpoint before version upgrades"
   ```

2. **Create a backup branch**
   ```bash
   git checkout -b backup-before-upgrade
   git checkout main
   git checkout -b feature/upgrade-to-node20
   ```

3. **Document your current working state**
   ```bash
   npm list --depth=0 > current-dependencies.txt
   node --version > current-node-version.txt
   ```

4. **Stop all running servers**
   ```powershell
   Get-Process | Where-Object { $_.ProcessName -like "*node*" } | Stop-Process -Force
   ```

---

## Step-by-Step Upgrade Process

### Phase 1: Upgrade Node.js (18.x → 20.x)

#### Option A: Using NVM (Node Version Manager) - Recommended

1. **Install NVM for Windows**
   - Download from: https://github.com/coreybutler/nvm-windows/releases
   - Install the latest version

2. **Install Node 20 LTS**
   ```powershell
   nvm install 20
   nvm use 20
   node --version  # Should show v20.x.x
   ```

3. **Create .nvmrc file** (already exists in your project)
   ```bash
   echo "20" > .nvmrc
   ```

#### Option B: Direct Installation

1. Download Node.js 20 LTS from: https://nodejs.org/
2. Run the installer
3. Restart your terminal
4. Verify: `node --version`

---

### Phase 2: Clean Installation

After upgrading Node.js:

```powershell
# 1. Clear npm cache
npm cache clean --force

# 2. Delete node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

# 3. Delete build cache
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force build -ErrorAction SilentlyContinue

# 4. Fresh install
npm install

# 5. Verify installation
npm list --depth=0
```

---

### Phase 3: Upgrade react-router-dom (6.x → 7.x)

#### 3.1. Update package.json

```json
{
  "dependencies": {
    "react-router-dom": "^7.9.2"
  },
  "engines": {
    "node": ">=20.0.0"
  }
}
```

#### 3.2. Install the new version

```powershell
npm install react-router-dom@latest
```

#### 3.3. Handle Breaking Changes

React Router 7 has several breaking changes. Review your code:

**Common Breaking Changes:**

1. **Route Component Changes**
   ```tsx
   // OLD (v6)
   import { BrowserRouter, Routes, Route } from 'react-router-dom';
   
   // NEW (v7) - mostly the same, but check for deprecated features
   import { BrowserRouter, Routes, Route } from 'react-router-dom';
   ```

2. **useNavigate changes**
   ```tsx
   // Check if you're using any deprecated options
   const navigate = useNavigate();
   ```

3. **Loader/Action functions** (new in v7)
   - If migrating to v7, consider using new data loading APIs

#### 3.4. Review Migration Guide

Official React Router v7 Migration Guide:
https://reactrouter.com/en/main/upgrading/v6

---

### Phase 4: Update Related Dependencies

```powershell
# Update TypeScript types
npm install --save-dev @types/node@latest @types/react@latest @types/react-dom@latest

# Update other dependencies (one at a time to catch issues)
npm update react-scripts
npm update typescript
```

---

### Phase 5: Testing

#### 5.1. Start Development Server

```powershell
# Set environment variable
$env:NODE_OPTIONS = "--openssl-legacy-provider"

# Start the app
npm start
```

#### 5.2. Test Critical Paths

- ✅ Home page loads
- ✅ Navigation between routes works
- ✅ Forms submit correctly
- ✅ API calls work
- ✅ Quote generation works
- ✅ Payment flow works

#### 5.3. Check for Console Errors

Open browser console and check for:
- Deprecation warnings
- Runtime errors
- Failed network requests

---

### Phase 6: Code Updates (if needed)

If you encounter breaking changes, update your code:

1. **Check src/App.tsx** (your routing setup)
2. **Review all route components** in `src/pages/`
3. **Update any custom hooks** using react-router

---

## Troubleshooting Common Issues

### Issue 1: "Module not found" errors

```powershell
# Solution: Clear cache and reinstall
npm cache clean --force
Remove-Item -Recurse -Force node_modules
npm install
```

### Issue 2: TypeScript errors after upgrade

```powershell
# Solution: Update TypeScript types
npm install --save-dev @types/react-router-dom@latest
```

### Issue 3: Build fails with webpack errors

```powershell
# Solution: Update react-scripts or switch to Vite
npm install react-scripts@latest

# Or consider migrating to Vite (more modern)
npm create vite@latest . -- --template react-ts
```

### Issue 4: Port 3000 already in use

```powershell
# Solution: Kill existing Node processes
Get-Process | Where-Object { $_.ProcessName -like "*node*" } | Stop-Process -Force
```

### Issue 5: EPERM errors during npm install

```powershell
# Solution 1: Close all editors and terminals, wait 30 seconds
Start-Sleep -Seconds 30
npm install

# Solution 2: Run as Administrator
# Right-click PowerShell → Run as Administrator
npm install
```

---

## Rollback Procedure

If something goes wrong:

```powershell
# 1. Stop all servers
Get-Process | Where-Object { $_.ProcessName -like "*node*" } | Stop-Process -Force

# 2. Switch back to backup branch
git checkout backup-before-upgrade

# 3. Reinstall dependencies
Remove-Item -Recurse -Force node_modules
npm install

# 4. If you need to revert Node.js version (using NVM)
nvm use 18
```

---

## Alternative: Stay on Current Stable Versions

If you don't need React Router 7 features, staying on current versions is perfectly fine:

**Current Stable Setup:**
- Node.js: 18.x (LTS until April 2025)
- react-router-dom: 6.26.2 (latest v6, fully supported)
- React: 18.2.0 (stable)

**Benefits:**
- ✅ No breaking changes
- ✅ Proven stability
- ✅ All security updates
- ✅ Wide community support

---

## Recommended Approach

### For Production Apps:
1. **Stay on Node 18.x and React Router 6.x** until you have time for thorough testing
2. Plan upgrade during a maintenance window
3. Test thoroughly in staging environment first

### For Development/Learning:
1. Upgrade Node.js to 20.x
2. Keep React Router 6.x for now
3. Experiment with React Router 7.x in a separate branch

---

## Version Compatibility Matrix

| Package | Current | Compatible with Node 18 | Compatible with Node 20 |
|---------|---------|-------------------------|-------------------------|
| react-router-dom@6.26.2 | ✅ | ✅ | ✅ |
| react-router-dom@7.9.2 | ❌ | ❌ | ✅ |
| react@18.2.0 | ✅ | ✅ | ✅ |
| react-scripts@5.0.1 | ✅ | ✅ | ✅ |
| typescript@4.7.4 | ✅ | ✅ | ✅ |

---

## Post-Upgrade Checklist

After successful upgrade:

- [ ] All tests pass
- [ ] Application runs without console errors
- [ ] All routes navigate correctly
- [ ] Forms and user interactions work
- [ ] API calls succeed
- [ ] Build process completes successfully
- [ ] Production build tested
- [ ] Documentation updated
- [ ] Team members notified
- [ ] Commit changes with clear message

```bash
git add .
git commit -m "Upgrade to Node 20.x and React Router 7.x"
git push origin feature/upgrade-to-node20
```

---

## Need Help?

- React Router Docs: https://reactrouter.com
- Node.js Release Schedule: https://nodejs.org/en/about/previous-releases
- Stack Overflow: Tag questions with `react-router` and `node.js`

---

## Summary

**Low Risk Path:** Stay on Node 18 + React Router 6.26.2 (current setup)

**Medium Risk Path:** Upgrade to Node 20 + Keep React Router 6.26.2

**High Risk Path:** Upgrade to Node 20 + Upgrade to React Router 7.x

Choose based on your timeline and risk tolerance!



