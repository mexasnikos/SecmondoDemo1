# Azure Deployment Quick Start Guide

## ✅ Prerequisites Checklist

Before deploying to Azure, ensure you have:

- [ ] **Azure Subscription** (create at [portal.azure.com](https://portal.azure.com))
- [ ] **Azure CLI** installed ([Download](https://docs.microsoft.com/cli/azure/install-azure-cli))
- [ ] **Docker Desktop** installed and running ([Download](https://www.docker.com/products/docker-desktop))
- [ ] **Git** installed
- [ ] **GitHub Account** (for CI/CD)
- [ ] **Local PostgreSQL** with your data (for migration)

---

## 🚀 Deployment Methods

You have **two options** for deploying to Azure:

### Option 1: Automated Script (Recommended) ⚡
Uses the provided `azure-deploy.sh` script to automate everything.

### Option 2: Manual Deployment 🔧
Step-by-step manual deployment via Azure Portal and CLI.

---

## Option 1: Automated Deployment (10 minutes)

### Step 1: Prepare Your Environment

```bash
# Clone or navigate to your repository
cd TravelInsurance_Demo_2

# Make the script executable (Linux/Mac)
chmod +x azure-deploy.sh

# Or on Windows (use Git Bash)
```

### Step 2: Login to Azure

```bash
# Login to Azure CLI
az login

# Set your subscription (if you have multiple)
az account set --subscription "Your-Subscription-Name"

# Verify you're logged in
az account show
```

### Step 3: Run the Deployment Script

```bash
# Run the automated deployment
./azure-deploy.sh

# On Windows (Git Bash)
bash azure-deploy.sh

# On Windows (PowerShell) - not recommended, use Git Bash instead
```

**What the script does:**
1. ✅ Creates Azure Resource Group
2. ✅ Creates Azure Container Registry
3. ✅ Creates PostgreSQL database
4. ✅ Creates Azure Key Vault with secrets
5. ✅ Creates Azure Blob Storage
6. ✅ Builds and pushes Docker images
7. ✅ Deploys backend Container Apps
8. ✅ Deploys proxy Container Apps
9. ✅ Outputs configuration details

**Duration:** ~8-10 minutes

### Step 4: Migrate Your Database

After the script completes, you'll see output like:

```
Database Host: travel-insurance-db.postgres.database.azure.com
Database Username: dbadmin
Database Password: <generated-password>
```

Migrate your data:

```bash
# Export from local database
pg_dump -U postgres -d travel_insurance > local_db_backup.sql

# Import to Azure (use password from script output)
psql -h travel-insurance-db.postgres.database.azure.com \
     -U dbadmin \
     -d travel_insurance \
     -f local_db_backup.sql

# Or migrate schema first, then data
psql -h travel-insurance-db.postgres.database.azure.com \
     -U dbadmin \
     -d travel_insurance \
     -f backend/schema.sql
```

### Step 5: Deploy Frontend (Manual)

The script provides backend URLs. Now deploy the frontend:

1. Go to [Azure Portal](https://portal.azure.com)
2. Search for "Static Web Apps" → **+ Create**
3. Fill in details:
   - **Subscription**: Your subscription
   - **Resource Group**: TravelInsurance-RG
   - **Name**: travel-insurance-frontend
   - **Region**: West Europe
   - **Deployment Source**: GitHub
4. **Authorize GitHub** and select:
   - **Organization**: Your GitHub username
   - **Repository**: TravelInsurance_Demo_2
   - **Branch**: main
5. Build Details:
   - **App location**: `/`
   - **Api location**: (leave empty)
   - **Output location**: `build`
6. Click **Review + Create** → **Create**

7. After creation, add environment variables:
   - Go to Static Web App → **Configuration**
   - Add:
     - `REACT_APP_API_URL` = `https://<backend-url>/api` (from script output)
     - `REACT_APP_TERRACOTTA_PROXY` = `https://<proxy-url>/api/terracotta`

### Step 6: Verify Deployment

```bash
# Check backend health
curl https://<backend-url>/api/health

# Check proxy health
curl https://<proxy-url>/health

# Visit your frontend
# URL will be like: https://happy-beach-123abc.azurestaticapps.net
```

**Done! Your app is live on Azure! 🎉**

---

## Option 2: Manual Deployment (30-45 minutes)

If you prefer manual control or the script fails, follow these steps:

### Step 1: Create Resource Group

```bash
az group create \
  --name TravelInsurance-RG \
  --location westeurope
```

### Step 2: Create Azure Container Registry

```bash
az acr create \
  --resource-group TravelInsurance-RG \
  --name travelinsuranceacr \
  --sku Basic \
  --admin-enabled true

# Get login credentials
az acr credential show --name travelinsuranceacr
```

### Step 3: Create PostgreSQL Database

```bash
# Create server (replace <password> with a secure password)
az postgres flexible-server create \
  --resource-group TravelInsurance-RG \
  --name travel-insurance-db \
  --location westeurope \
  --admin-user dbadmin \
  --admin-password <YourSecurePassword> \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --version 14 \
  --storage-size 32 \
  --public-access 0.0.0.0-255.255.255.255

# Create database
az postgres flexible-server db create \
  --resource-group TravelInsurance-RG \
  --server-name travel-insurance-db \
  --database-name travel_insurance
```

### Step 4: Create Azure Key Vault

```bash
az keyvault create \
  --resource-group TravelInsurance-RG \
  --name travel-insurance-kv \
  --location westeurope

# Add secrets
az keyvault secret set --vault-name travel-insurance-kv --name "db-host" --value "<db-hostname>"
az keyvault secret set --vault-name travel-insurance-kv --name "db-password" --value "<your-password>"
```

### Step 5: Create Storage Account

```bash
az storage account create \
  --name travelinsurancestorage \
  --resource-group TravelInsurance-RG \
  --location westeurope \
  --sku Standard_LRS

# Create containers
az storage container create \
  --account-name travelinsurancestorage \
  --name policy-documents
```

### Step 6: Build and Push Docker Images

```bash
# Login to ACR
az acr login --name travelinsuranceacr

# Build and push backend
docker build -t travelinsuranceacr.azurecr.io/travel-insurance-backend:latest ./backend
docker push travelinsuranceacr.azurecr.io/travel-insurance-backend:latest

# Build and push proxy
docker build -t travelinsuranceacr.azurecr.io/travel-insurance-proxy:latest ./server
docker push travelinsuranceacr.azurecr.io/travel-insurance-proxy:latest
```

### Step 7: Create Container Apps Environment

```bash
az containerapp env create \
  --name travel-insurance-env \
  --resource-group TravelInsurance-RG \
  --location westeurope
```

### Step 8: Deploy Backend Container App

```bash
az containerapp create \
  --name travel-insurance-api \
  --resource-group TravelInsurance-RG \
  --environment travel-insurance-env \
  --image travelinsuranceacr.azurecr.io/travel-insurance-backend:latest \
  --target-port 5002 \
  --ingress external \
  --registry-server travelinsuranceacr.azurecr.io \
  --registry-username <acr-username> \
  --registry-password <acr-password> \
  --secrets \
    db-host="<db-host>" \
    db-password="<db-password>" \
  --env-vars \
    DB_HOST=secretref:db-host \
    DB_USER=dbadmin \
    DB_PASSWORD=secretref:db-password \
    DB_NAME=travel_insurance \
    DB_PORT=5432 \
    NODE_ENV=production \
  --min-replicas 0 \
  --max-replicas 5
```

### Step 9: Deploy Proxy Container App

```bash
az containerapp create \
  --name travel-insurance-proxy \
  --resource-group TravelInsurance-RG \
  --environment travel-insurance-env \
  --image travelinsuranceacr.azurecr.io/travel-insurance-proxy:latest \
  --target-port 3001 \
  --ingress external \
  --registry-server travelinsuranceacr.azurecr.io \
  --registry-username <acr-username> \
  --registry-password <acr-password> \
  --secrets \
    db-host="<db-host>" \
    db-password="<db-password>" \
  --env-vars \
    DB_HOST=secretref:db-host \
    DB_USER=dbadmin \
    DB_PASSWORD=secretref:db-password \
    DB_NAME=travel_insurance \
    DB_PORT=5432 \
    NODE_ENV=production \
  --min-replicas 0 \
  --max-replicas 3
```

### Step 10: Deploy Frontend

Follow the same steps as in Option 1, Step 5.

---

## 📊 Monitoring Setup (Optional but Recommended)

### Add Application Insights

```bash
# Create Application Insights
az monitor app-insights component create \
  --app travel-insurance-insights \
  --location westeurope \
  --resource-group TravelInsurance-RG \
  --application-type web

# Get instrumentation key
az monitor app-insights component show \
  --app travel-insurance-insights \
  --resource-group TravelInsurance-RG \
  --query instrumentationKey
```

Update your backend to use Application Insights:

```javascript
// Add to backend/server.js
const appInsights = require('applicationinsights');
appInsights.setup('<instrumentation-key>')
  .setAutoDependencyCorrelation(true)
  .setAutoCollectRequests(true)
  .start();
```

---

## 🔄 Setting Up CI/CD (GitHub Actions)

Your repository already has the workflows configured in `.github/workflows/`.

### Step 1: Configure GitHub Secrets

1. Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**
2. Add these secrets:

**For Container Apps:**
- `AZURE_CREDENTIALS`: Get from Azure CLI:
  ```bash
  az ad sp create-for-rbac \
    --name "TravelInsuranceGitHub" \
    --role contributor \
    --scopes /subscriptions/<subscription-id>/resourceGroups/TravelInsurance-RG \
    --sdk-auth
  ```
  Copy the entire JSON output

**For Static Web Apps:**
- `AZURE_STATIC_WEB_APPS_API_TOKEN`: Get from Azure Portal → Your Static Web App → **Manage deployment token**
- `REACT_APP_API_URL`: Your backend URL (from Container Apps)
- `REACT_APP_TERRACOTTA_PROXY`: Your proxy URL (from Container Apps)

### Step 2: Trigger Deployment

```bash
# Push to main branch
git add .
git commit -m "Initial Azure deployment"
git push origin main

# GitHub Actions will automatically deploy!
```

---

## 🧪 Testing Your Deployment

### Test Backend API

```bash
# Health check
curl https://<backend-url>/api/health

# Test database
curl https://<backend-url>/api/db-test

# Get countries
curl https://<backend-url>/api/countries
```

### Test Proxy Server

```bash
# Health check
curl https://<proxy-url>/health
```

### Test Frontend

1. Visit your Static Web App URL
2. Try creating a quote
3. Check browser console for errors
4. Test Terracotta integration

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check logs
az containerapp logs show \
  --name travel-insurance-api \
  --resource-group TravelInsurance-RG \
  --tail 100

# Check environment variables
az containerapp show \
  --name travel-insurance-api \
  --resource-group TravelInsurance-RG \
  --query properties.template.containers[0].env
```

### Database connection fails
```bash
# Test connection
psql -h <db-host> -U dbadmin -d travel_insurance

# Check firewall rules
az postgres flexible-server firewall-rule list \
  --resource-group TravelInsurance-RG \
  --name travel-insurance-db
```

### Frontend can't reach backend
- Check environment variables in Static Web App
- Verify CORS settings in backend
- Check Container Apps ingress is set to "external"

### Docker build fails
- Make sure you're in the correct directory
- Check Dockerfile syntax
- Verify all referenced files exist

---

## 💰 Cost Management

### Monitor Your Spending

```bash
# Check current costs
az consumption usage list \
  --start-date 2024-10-01 \
  --end-date 2024-10-31
```

### Set Up Budget Alerts

1. Azure Portal → **Cost Management + Billing**
2. **Budgets** → **+ Add**
3. Set monthly budget (e.g., $100)
4. Add alert at 80% and 100%

### Cost Optimization Tips

- **Scale to Zero**: Container Apps scale to 0 when not in use
- **Use Burstable Tier**: For development database
- **Review Unused Resources**: Delete test deployments
- **Use Reserved Instances**: For production (if traffic is consistent)

---

## 📚 Next Steps

After successful deployment:

1. ✅ Set up custom domain (Azure Portal → Static Web Apps → Custom domains)
2. ✅ Configure SSL certificate (automatic with custom domain)
3. ✅ Set up Application Insights dashboards
4. ✅ Configure backup policies for database
5. ✅ Set up monitoring alerts
6. ✅ Document your API endpoints
7. ✅ Test disaster recovery procedures
8. ✅ Set up staging environment (duplicate setup)
9. ✅ Configure Azure AD authentication (if needed)
10. ✅ Review security best practices

---

## 📞 Support Resources

- **Azure Documentation**: https://docs.microsoft.com/azure
- **Azure Support Portal**: https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade
- **Stack Overflow**: Tag questions with `azure`, `azure-container-apps`, `azure-static-web-apps`
- **Azure Community**: https://techcommunity.microsoft.com/t5/azure/ct-p/Azure

---

## 🎉 Congratulations!

You've successfully deployed your Travel Insurance application to Azure!

Your application is now:
- ✅ Scalable (auto-scales based on traffic)
- ✅ Secure (secrets in Key Vault, encrypted at rest)
- ✅ Reliable (Azure SLA: 99.95% uptime)
- ✅ Global (CDN for fast worldwide access)
- ✅ Monitored (Application Insights tracking)
- ✅ Cost-effective (pay only for what you use)

**Enjoy your cloud-native travel insurance platform! ✈️🌍**

