# Azure Deployment - Quick Reference Card

## 🚀 Quick Start Commands

### Deploy Everything (Automated)
```bash
# Login to Azure
az login

# Run deployment script
./azure-deploy.sh
```

**Done!** Backend deployed in ~10 minutes.

---

## 📋 Essential Commands

### Azure CLI Login
```bash
az login
az account set --subscription "Your-Subscription"
az account show
```

### Check Deployment Status
```bash
# List all resources
az resource list --resource-group TravelInsurance-RG --output table

# Check Container App status
az containerapp show --name travel-insurance-api --resource-group TravelInsurance-RG
```

### View Logs
```bash
# Backend API logs
az containerapp logs show --name travel-insurance-api --resource-group TravelInsurance-RG --tail 100

# Proxy server logs
az containerapp logs show --name travel-insurance-proxy --resource-group TravelInsurance-RG --tail 100
```

### Database Operations
```bash
# Connect to database
psql -h <db-host>.postgres.database.azure.com -U dbadmin -d travel_insurance

# Migrate schema
psql -h <db-host> -U dbadmin -d travel_insurance -f backend/schema.sql

# Export local DB
pg_dump -U postgres -d travel_insurance > backup.sql

# Import to Azure
psql -h <db-host> -U dbadmin -d travel_insurance -f backup.sql
```

### Update Deployed Apps
```bash
# Rebuild and push images
docker build -t travelinsuranceacr.azurecr.io/travel-insurance-backend:latest ./backend
docker push travelinsuranceacr.azurecr.io/travel-insurance-backend:latest

# Update container app
az containerapp update \
  --name travel-insurance-api \
  --resource-group TravelInsurance-RG \
  --image travelinsuranceacr.azurecr.io/travel-insurance-backend:latest
```

---

## 🔗 Important URLs (After Deployment)

| Service | URL | Purpose |
|---------|-----|---------|
| **Backend API** | https://<backend-app>.azurecontainerapps.io | REST API endpoints |
| **Proxy Server** | https://<proxy-app>.azurecontainerapps.io | SOAP proxy for Terracotta |
| **Frontend** | https://<unique-name>.azurestaticapps.net | React web application |
| **Azure Portal** | https://portal.azure.com | Manage all Azure resources |
| **Database** | <db-name>.postgres.database.azure.com | PostgreSQL connection |

---

## 🔐 Environment Variables

### Backend Container App
```bash
DB_HOST=<db-host>.postgres.database.azure.com
DB_USER=dbadmin
DB_PASSWORD=<from-keyvault>
DB_NAME=travel_insurance
DB_PORT=5432
PORT=5002
NODE_ENV=production
```

### Proxy Container App
```bash
DB_HOST=<db-host>.postgres.database.azure.com
DB_USER=dbadmin
DB_PASSWORD=<from-keyvault>
DB_NAME=travel_insurance
DB_PORT=5432
PORT=3001
NODE_ENV=production
```

### Frontend (Static Web Apps)
```bash
REACT_APP_API_URL=https://<backend-app>.azurecontainerapps.io/api
REACT_APP_TERRACOTTA_PROXY=https://<proxy-app>.azurecontainerapps.io/api/terracotta
```

---

## 💰 Cost Monitoring

### Check Current Costs
```bash
# Current month costs
az consumption usage list --start-date $(date -d "1 month ago" +%Y-%m-%d) --end-date $(date +%Y-%m-%d)
```

### Set Budget Alert
```bash
az consumption budget create \
  --budget-name TravelInsuranceBudget \
  --amount 200 \
  --time-period month \
  --resource-group TravelInsurance-RG
```

---

## 🐛 Common Issues & Fixes

### Issue: Backend can't connect to database
```bash
# Check database firewall rules
az postgres flexible-server firewall-rule list \
  --resource-group TravelInsurance-RG \
  --name travel-insurance-db

# Allow Azure services
az postgres flexible-server firewall-rule create \
  --resource-group TravelInsurance-RG \
  --name travel-insurance-db \
  --rule-name AllowAzure \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

### Issue: Container app won't start
```bash
# View detailed logs
az containerapp logs show --name travel-insurance-api --resource-group TravelInsurance-RG

# Check environment variables
az containerapp show --name travel-insurance-api --resource-group TravelInsurance-RG \
  --query properties.template.containers[0].env
```

### Issue: Frontend can't reach backend
- Check CORS settings in backend (`server.js`)
- Verify `REACT_APP_API_URL` in Static Web Apps configuration
- Check Container App ingress is set to "external"

### Issue: SOAP API calls fail
- Verify proxy server is running: `curl https://<proxy-url>/health`
- Check database connection (proxy logs to DB)
- Test Terracotta endpoint directly

---

## 🔄 CI/CD Setup

### GitHub Secrets Needed

```bash
# Get Azure credentials for GitHub Actions
az ad sp create-for-rbac \
  --name "TravelInsuranceGitHub" \
  --role contributor \
  --scopes /subscriptions/<subscription-id>/resourceGroups/TravelInsurance-RG \
  --sdk-auth
```

Add to GitHub: **Settings → Secrets → Actions**:
- `AZURE_CREDENTIALS` (output from above command)
- `AZURE_STATIC_WEB_APPS_API_TOKEN` (from Static Web App)
- `REACT_APP_API_URL` (backend URL)
- `REACT_APP_TERRACOTTA_PROXY` (proxy URL)

### Trigger Deployment
```bash
git add .
git commit -m "Update application"
git push origin main
# GitHub Actions automatically deploys!
```

---

## 🧪 Testing Endpoints

### Health Checks
```bash
# Backend health
curl https://<backend-url>/api/health

# Database test
curl https://<backend-url>/api/db-test

# Proxy health
curl https://<proxy-url>/health
```

### API Tests
```bash
# Get countries
curl https://<backend-url>/api/countries

# Get destination categories
curl https://<backend-url>/api/destination-categories

# Get addons
curl https://<backend-url>/api/addons/Single%20Trip
```

---

## 📊 Monitoring

### Application Insights
```bash
# Install Application Insights
az monitor app-insights component create \
  --app travel-insurance-insights \
  --location westeurope \
  --resource-group TravelInsurance-RG \
  --application-type web

# Get instrumentation key
az monitor app-insights component show \
  --app travel-insurance-insights \
  --resource-group TravelInsurance-RG \
  --query instrumentationKey -o tsv
```

Add to backend:
```javascript
const appInsights = require('applicationinsights');
appInsights.setup('<instrumentation-key>').start();
```

---

## 🔒 Security Checklist

- [ ] Database password stored in Key Vault
- [ ] No secrets in code or env files
- [ ] HTTPS enforced (automatic with Azure)
- [ ] CORS properly configured
- [ ] Database has firewall rules
- [ ] Container Apps use managed identity
- [ ] Blob Storage uses private access
- [ ] Application Insights monitoring enabled
- [ ] Budget alerts configured

---

## 📞 Support Contacts

| Issue | Contact |
|-------|---------|
| Azure service issues | Azure Support Portal |
| Billing questions | Azure Cost Management |
| Technical documentation | https://docs.microsoft.com/azure |
| Community support | Stack Overflow (tag: azure) |

---

## 🗑️ Cleanup (Delete Everything)

**⚠️ WARNING: This deletes ALL resources and data!**

```bash
# Delete entire resource group
az group delete --name TravelInsurance-RG --yes --no-wait
```

---

## 📈 Scaling Configuration

### Manual Scaling
```bash
# Scale up backend
az containerapp update \
  --name travel-insurance-api \
  --resource-group TravelInsurance-RG \
  --min-replicas 2 \
  --max-replicas 10
```

### Auto-scaling (based on HTTP requests)
```bash
az containerapp update \
  --name travel-insurance-api \
  --resource-group TravelInsurance-RG \
  --scale-rule-name http-rule \
  --scale-rule-type http \
  --scale-rule-http-concurrency 50
```

---

## 🔄 Backup & Recovery

### Database Backup
```bash
# Manual backup
az postgres flexible-server backup create \
  --resource-group TravelInsurance-RG \
  --name travel-insurance-db \
  --backup-name manual-backup-$(date +%Y%m%d)

# List backups
az postgres flexible-server backup list \
  --resource-group TravelInsurance-RG \
  --name travel-insurance-db
```

### Restore Database
```bash
# Point-in-time restore
az postgres flexible-server restore \
  --resource-group TravelInsurance-RG \
  --name travel-insurance-db-restored \
  --source-server travel-insurance-db \
  --restore-time "2024-10-18T10:00:00Z"
```

---

## 📱 Mobile App (Future)

Your backend API is already compatible with mobile apps!

### Expose APIs for Mobile
1. Backend API already returns JSON ✅
2. Add authentication (Azure AD B2C or JWT)
3. Document API with Swagger/OpenAPI
4. Consider Azure API Management for:
   - Rate limiting
   - API versioning
   - Developer portal

---

## 🎯 Performance Optimization

### Enable CDN for Blob Storage
```bash
az cdn profile create \
  --resource-group TravelInsurance-RG \
  --name travel-insurance-cdn

az cdn endpoint create \
  --resource-group TravelInsurance-RG \
  --profile-name travel-insurance-cdn \
  --name travel-insurance-files \
  --origin travelinsurancestorage.blob.core.windows.net
```

### Add Redis Cache
```bash
az redis create \
  --resource-group TravelInsurance-RG \
  --name travel-insurance-cache \
  --location westeurope \
  --sku Basic \
  --vm-size c0
```

---

## 📖 Documentation Links

- **Azure Static Web Apps**: https://docs.microsoft.com/azure/static-web-apps/
- **Azure Container Apps**: https://docs.microsoft.com/azure/container-apps/
- **Azure PostgreSQL**: https://docs.microsoft.com/azure/postgresql/
- **Azure Key Vault**: https://docs.microsoft.com/azure/key-vault/
- **Azure Blob Storage**: https://docs.microsoft.com/azure/storage/blobs/

---

## ✅ Pre-Flight Checklist

Before going to production:

- [ ] All environment variables configured
- [ ] Database migrated and tested
- [ ] SSL/HTTPS working
- [ ] Custom domain configured (optional)
- [ ] Monitoring and alerts set up
- [ ] Backup policy configured
- [ ] Budget alerts configured
- [ ] Security review completed
- [ ] Performance testing done
- [ ] Disaster recovery plan documented
- [ ] Team trained on Azure Portal
- [ ] Support contacts documented

---

**Keep this document handy for quick reference during deployment and operations!**

**Last Updated:** October 18, 2025  
**Version:** 1.0

