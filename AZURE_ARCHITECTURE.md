# Travel Insurance Demo - Azure Cloud Architecture

## Architecture Overview

This document outlines the production-ready Azure architecture for the Travel Insurance application.

---

## 🏗️ Architecture Diagram

```
                                    INTERNET
                                       │
                                       ▼
                        ┌──────────────────────────┐
                        │   Azure Front Door       │
                        │  (Optional - Enterprise) │
                        │  • Global CDN            │
                        │  • WAF Protection        │
                        │  • SSL/TLS               │
                        └──────────┬───────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
                    ▼                             ▼
        ┌───────────────────────┐    ┌────────────────────────┐
        │  Azure Static Web Apps│    │  Azure Container Apps  │
        │  ┌─────────────────┐  │    │  ┌──────────────────┐  │
        │  │  React Frontend │  │    │  │  Backend API     │  │
        │  │  • Built files  │  │    │  │  • Express       │  │
        │  │  • SPA routing  │  │    │  │  • Port 5002     │  │
        │  │  • Auto SSL     │  │    │  └──────────────────┘  │
        │  └─────────────────┘  │    │  ┌──────────────────┐  │
        │  • Global CDN         │    │  │  Proxy Server    │  │
        │  • Auto-deploy        │    │  │  • Port 3001     │  │
        └───────────────────────┘    │  │  • SOAP calls    │  │
                                     │  └──────────────────┘  │
                                     │  • Auto-scale 0-N     │
                                     │  • Built-in LB        │
                                     └────────┬───────────────┘
                                              │
                    ┌─────────────────────────┼─────────────────────────┐
                    │                         │                         │
                    ▼                         ▼                         ▼
        ┌───────────────────┐   ┌─────────────────────┐   ┌──────────────────┐
        │  Azure Database   │   │   Azure Key Vault   │   │  Azure Blob      │
        │  for PostgreSQL   │   │  • DB credentials   │   │  Storage         │
        │  • Flexible Server│   │  • API keys         │   │  • Policy PDFs   │
        │  • Auto-backup    │   │  • Terracotta creds │   │  • Documents     │
        │  • High Avail.    │   │  • Secrets          │   │  • Certificates  │
        └───────────────────┘   └─────────────────────┘   └──────────────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Application Insights │
        │  • Performance        │
        │  • Error tracking     │
        │  • SOAP audit logs    │
        │  • User analytics     │
        └───────────────────────┘

                    ▼
        ┌───────────────────────┐
        │  External: Terracotta │
        │  SOAP API (UAT)       │
        │  asuauat.terracotta..│
        └───────────────────────┘
```

---

## 📦 Azure Services Breakdown

### 1. **Frontend: Azure Static Web Apps** ⭐ RECOMMENDED
**Why**: Purpose-built for React SPAs, includes CDN, auto-deploy, free SSL

**Configuration:**
- **Build command**: `npm run build`
- **Output location**: `build/`
- **App location**: `src/`
- **API location**: None (separate backend)
- **Routing**: Support for React Router (SPA)
- **Environment variables**: 
  - `REACT_APP_API_URL` → Backend Container App URL
  - `REACT_APP_TERRACOTTA_PROXY` → Proxy endpoint

**Deployment:**
- GitHub Actions (auto-configured)
- Deploys on every push to `main`
- Preview environments for PRs

**Cost**: Free tier available, Production tier ~$9/month

---

### 2. **Backend: Azure Container Apps** ⭐ RECOMMENDED
**Why**: Serverless containers, perfect for Node.js, auto-scales, cost-effective

**Two Containers:**

#### Container 1: Backend API (Port 5002)
```dockerfile
# Dockerfile for backend
FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/ ./
EXPOSE 5002
CMD ["node", "server.js"]
```

**Environment Variables:**
- `DB_HOST` → Azure PostgreSQL hostname (from Key Vault)
- `DB_USER` → Database username (from Key Vault)
- `DB_PASSWORD` → Database password (from Key Vault)
- `DB_NAME` → travel_insurance
- `DB_PORT` → 5432
- `PORT` → 5002
- `NODE_ENV` → production

**Scaling:**
- Min replicas: 0 (scale to zero when idle)
- Max replicas: 10
- CPU/Memory: 0.5 vCPU, 1GB RAM (adjustable)

#### Container 2: Proxy Server (Port 3001)
```dockerfile
# Dockerfile for proxy
FROM node:18-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm ci --only=production
COPY server/ ./
COPY backend/soap-logger.js ./
EXPOSE 3001
CMD ["node", "proxy-server.js"]
```

**Environment Variables:**
- Same DB credentials (for SOAP audit logging)
- `TERRACOTTA_BASE_URL` → https://asuauat.terracottatest.com/ws/integratedquote.asmx

**Networking:**
- Internal communication via Container Apps environment
- External ingress for proxy (accessible from frontend)

**Cost**: Pay-per-use, ~$30-100/month based on traffic

---

### 3. **Database: Azure Database for PostgreSQL** ⭐ RECOMMENDED
**Service**: Flexible Server (latest generation)

**Configuration:**
- **Tier**: Burstable or General Purpose
- **Compute**: B1ms (1 vCore, 2GB RAM) for development
- **Compute**: D2s_v3 (2 vCores, 8GB RAM) for production
- **Storage**: 32GB (expandable)
- **Backup**: Automated daily backups (7-35 days retention)
- **High Availability**: Zone-redundant (production only)

**Security:**
- Private endpoint (VNet integration) for production
- SSL/TLS enforced
- Firewall rules for Container Apps
- Azure AD authentication (optional)

**Migration:**
- Use `pg_dump` from local PostgreSQL
- Restore using `psql` to Azure PostgreSQL
- Or use Azure Database Migration Service

**Cost**: 
- Development: ~$30-50/month (Burstable B1ms)
- Production: ~$100-200/month (General Purpose)

---

### 4. **Secrets Management: Azure Key Vault** ⭐ ESSENTIAL

**Stored Secrets:**
```
# Database
db-host              → xxxxx.postgres.database.azure.com
db-user              → dbadmin
db-password          → <secure-password>
db-name              → travel_insurance

# Terracotta API
terracotta-user-id   → 4072
terracotta-user-code → 111427
terracotta-api-url   → https://asuauat.terracottatest.com/ws/integratedquote.asmx

# Application
jwt-secret           → <if using JWT>
encryption-key       → <if encrypting data>
```

**Access Control:**
- Container Apps access via Managed Identity
- No hardcoded secrets in code
- Audit logging for secret access

**Cost**: ~$1-2/month

---

### 5. **File Storage: Azure Blob Storage**

**Containers:**
- `policy-documents/` → Generated policy PDFs
- `certificates/` → Policy certificates
- `public/` → Public assets (if any)

**Configuration:**
- **Storage Account Type**: StorageV2 (General Purpose v2)
- **Redundancy**: LRS (Local) for dev, GRS (Geo) for production
- **Access Tier**: Hot (frequently accessed)
- **Public Access**: Disabled (use SAS tokens or private)

**Integration:**
- Update backend to use Azure Blob SDK
- Generate SAS tokens for document downloads
- Set retention policies

**Cost**: ~$1-5/month for typical usage

---

### 6. **Monitoring: Azure Application Insights** ⭐ ESSENTIAL

**Capabilities:**
- Real-time performance monitoring
- Error tracking and stack traces
- SOAP API call tracking
- Custom events (quote creation, payments)
- User flow analytics
- Dependency tracking (DB, Terracotta API)

**Setup:**
```javascript
// Add to backend/server.js
const appInsights = require('applicationinsights');
appInsights.setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING)
  .setAutoDependencyCorrelation(true)
  .setAutoCollectRequests(true)
  .setAutoCollectPerformance(true)
  .setAutoCollectExceptions(true)
  .start();
```

**Alerts:**
- API response time > 2 seconds
- Error rate > 5%
- Database connection failures
- Terracotta API failures

**Cost**: First 5GB/month free, then ~$2.30/GB

---

### 7. **Optional Services**

#### Azure API Management (Enterprise)
**When to use**: If you need:
- Rate limiting
- API versioning
- Developer portal
- OAuth/API key management
- Throttling policies

**Cost**: ~$140/month (Developer tier)

#### Azure Cache for Redis
**When to use**: If you need:
- Session management across replicas
- Quote caching (reduce Terracotta calls)
- Rate limiting

**Cost**: ~$15/month (Basic tier)

#### Azure Front Door (Enterprise)
**When to use**: If you need:
- Global load balancing
- Advanced WAF (Web Application Firewall)
- DDoS protection
- Multi-region deployment

**Cost**: ~$35/month + data transfer

---

## 🔐 Security Architecture

### Network Security
```
┌─────────────────────────────────────────┐
│  Azure Virtual Network (VNet)           │
│  ┌───────────────────────────────────┐  │
│  │  Subnet: Container Apps           │  │
│  │  • Backend API                    │  │
│  │  • Proxy Server                   │  │
│  └─────────────┬─────────────────────┘  │
│                │                         │
│  ┌─────────────▼─────────────────────┐  │
│  │  Subnet: Database (Private)       │  │
│  │  • PostgreSQL Flexible Server     │  │
│  │  • Private Endpoint               │  │
│  └───────────────────────────────────┘  │
│                                          │
│  Network Security Groups (NSG):          │
│  • Deny all inbound by default          │
│  • Allow HTTPS (443) from internet      │
│  • Allow PostgreSQL (5432) from app     │
└──────────────────────────────────────────┘
```

### Identity & Access Management
- **Managed Identity** for Container Apps to access:
  - Key Vault (secrets)
  - Blob Storage (documents)
  - PostgreSQL (optional Azure AD auth)
- **No connection strings** in code or env files
- **RBAC** for team members

### Data Protection
- **Encryption at rest**: All Azure services encrypt by default
- **Encryption in transit**: TLS 1.2+ enforced
- **Database**: Transparent Data Encryption (TDE)
- **Backups**: Encrypted, geo-redundant

### Compliance
- **GDPR**: Data residency in EU regions
- **PCI DSS**: For payment card data (if storing)
- **ISO 27001**: Azure is certified

---

## 📊 Cost Estimation

### Development Environment
| Service | Tier | Monthly Cost |
|---------|------|--------------|
| Static Web Apps | Free | $0 |
| Container Apps | Consumption | $10-20 |
| PostgreSQL | Burstable B1ms | $30 |
| Key Vault | Standard | $1 |
| Blob Storage | LRS, Hot | $2 |
| Application Insights | 5GB free | $0 |
| **TOTAL** | | **$43-53/month** |

### Production Environment
| Service | Tier | Monthly Cost |
|---------|------|--------------|
| Static Web Apps | Standard | $9 |
| Container Apps | Consumption | $60-100 |
| PostgreSQL | General Purpose D2s | $150 |
| Key Vault | Standard | $1 |
| Blob Storage | GRS, Hot | $5 |
| Application Insights | ~10GB | $25 |
| Azure Cache for Redis | Basic | $15 |
| **TOTAL** | | **$265-305/month** |

### Enterprise (High Traffic)
| Service | Tier | Monthly Cost |
|---------|------|--------------|
| Static Web Apps | Standard | $9 |
| Azure Front Door | Standard | $35 |
| Container Apps | Dedicated | $200-400 |
| PostgreSQL | D4s (HA) | $400 |
| Key Vault | Standard | $2 |
| Blob Storage | GRS, Hot | $20 |
| Application Insights | ~50GB | $120 |
| Azure Cache for Redis | Standard | $55 |
| API Management | Developer | $140 |
| **TOTAL** | | **$981-1,181/month** |

---

## 🚀 Deployment Strategy

### Phase 1: Infrastructure Setup (Week 1)
1. Create Azure subscription & resource group
2. Set up Azure Key Vault with secrets
3. Create Azure PostgreSQL database
4. Migrate database schema and data
5. Create Blob Storage account

### Phase 2: Backend Deployment (Week 1-2)
1. Create Dockerfiles for both servers
2. Push images to Azure Container Registry
3. Deploy Container Apps
4. Configure environment variables from Key Vault
5. Test API endpoints

### Phase 3: Frontend Deployment (Week 2)
1. Configure Azure Static Web Apps
2. Connect to GitHub repository
3. Set up CI/CD pipeline
4. Update API URLs
5. Test end-to-end flow

### Phase 4: Monitoring & Optimization (Week 2-3)
1. Set up Application Insights
2. Configure alerts
3. Implement logging
4. Performance testing
5. Security review

### Phase 5: Production Cutover (Week 3-4)
1. DNS configuration
2. SSL certificates
3. Final testing
4. Go-live
5. Monitor

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

**Frontend** (`.github/workflows/azure-static-web-apps.yml`):
```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build_and_deploy_job:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build And Deploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/"
          api_location: ""
          output_location: "build"
```

**Backend** (`.github/workflows/azure-container-apps.yml`):
```yaml
name: Deploy to Azure Container Apps

on:
  push:
    branches:
      - main
    paths:
      - 'backend/**'
      - 'server/**'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Log in to Azure Container Registry
        uses: azure/docker-login@v1
        with:
          login-server: ${{ secrets.ACR_LOGIN_SERVER }}
          username: ${{ secrets.ACR_USERNAME }}
          password: ${{ secrets.ACR_PASSWORD }}
      
      - name: Build and push backend
        run: |
          docker build -t ${{ secrets.ACR_LOGIN_SERVER }}/travel-insurance-backend:${{ github.sha }} ./backend
          docker push ${{ secrets.ACR_LOGIN_SERVER }}/travel-insurance-backend:${{ github.sha }}
      
      - name: Build and push proxy
        run: |
          docker build -t ${{ secrets.ACR_LOGIN_SERVER }}/travel-insurance-proxy:${{ github.sha }} ./server
          docker push ${{ secrets.ACR_LOGIN_SERVER }}/travel-insurance-proxy:${{ github.sha }}
      
      - name: Deploy to Container Apps
        uses: azure/container-apps-deploy-action@v1
        with:
          containerAppName: travel-insurance-api
          resourceGroup: TravelInsurance-RG
          imageToDeploy: ${{ secrets.ACR_LOGIN_SERVER }}/travel-insurance-backend:${{ github.sha }}
```

---

## 🌍 Multi-Region Deployment (Optional)

For high availability and low latency globally:

```
Primary Region: West Europe (Amsterdam)
  - All services (Static Web Apps, Container Apps, PostgreSQL)
  
Secondary Region: North Europe (Dublin)
  - Read replica for PostgreSQL
  - Container Apps (active-passive)
  
Orchestration: Azure Front Door
  - Route users to nearest region
  - Automatic failover
  - Health probes
```

**Cost**: +60-80% of single-region cost

---

## 📞 Support & Monitoring

### Health Checks
```javascript
// Backend health endpoint
app.get('/health', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: 'unknown',
      terracotta: 'unknown'
    }
  };
  
  // Check database
  try {
    await pool.query('SELECT 1');
    health.services.database = 'healthy';
  } catch (error) {
    health.services.database = 'unhealthy';
    health.status = 'degraded';
  }
  
  res.status(health.status === 'healthy' ? 200 : 503).json(health);
});
```

### Monitoring Dashboard
- Azure Portal: Built-in metrics
- Application Insights: Custom dashboard
- Alerts: Email, SMS, webhooks

---

## 🔍 Migration Checklist

- [ ] Azure subscription created
- [ ] Resource group created
- [ ] PostgreSQL database provisioned
- [ ] Database schema migrated
- [ ] Sample data migrated
- [ ] Key Vault created and populated
- [ ] Blob Storage account created
- [ ] Container Registry created
- [ ] Backend Dockerfiles created
- [ ] Backend containers deployed
- [ ] Proxy container deployed
- [ ] Static Web App configured
- [ ] Frontend deployed
- [ ] Environment variables configured
- [ ] Application Insights integrated
- [ ] Health checks implemented
- [ ] CI/CD pipelines configured
- [ ] Custom domain configured (optional)
- [ ] SSL certificates configured
- [ ] Security review completed
- [ ] Performance testing completed
- [ ] Disaster recovery plan documented
- [ ] Team training completed

---

## 📚 Additional Resources

- [Azure Static Web Apps Documentation](https://docs.microsoft.com/azure/static-web-apps/)
- [Azure Container Apps Documentation](https://docs.microsoft.com/azure/container-apps/)
- [Azure Database for PostgreSQL Documentation](https://docs.microsoft.com/azure/postgresql/)
- [Azure Key Vault Documentation](https://docs.microsoft.com/azure/key-vault/)
- [Application Insights Documentation](https://docs.microsoft.com/azure/azure-monitor/app/app-insights-overview)

---

## 🤝 Support

For Azure-specific issues:
- Azure Support Portal
- Stack Overflow (tag: azure)
- Azure community forums

For application issues:
- GitHub Issues
- Internal support team

---

**Document Version**: 1.0  
**Last Updated**: October 18, 2025  
**Author**: Cloud Architecture Team

