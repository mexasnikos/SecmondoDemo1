#!/bin/bash
#############################################
# Azure Deployment Script
# Deploys Travel Insurance application to Azure
#############################################

set -e  # Exit on error

# Configuration
RESOURCE_GROUP="TravelInsurance-RG"
LOCATION="westeurope"
ACR_NAME="travelinsuranceacr"
BACKEND_APP_NAME="travel-insurance-api"
PROXY_APP_NAME="travel-insurance-proxy"
STATIC_APP_NAME="travel-insurance-frontend"
DB_SERVER_NAME="travel-insurance-db"
DB_NAME="travel_insurance"
KEYVAULT_NAME="travel-insurance-kv"
STORAGE_ACCOUNT_NAME="travelinsurancestorage"
CONTAINER_ENV_NAME="travel-insurance-env"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    log_error "Azure CLI is not installed. Please install it first."
    exit 1
fi

# Check if logged in
log_info "Checking Azure login status..."
if ! az account show &> /dev/null; then
    log_warn "Not logged in to Azure. Please login..."
    az login
fi

# Step 1: Create Resource Group
log_info "Creating resource group: $RESOURCE_GROUP"
az group create \
    --name $RESOURCE_GROUP \
    --location $LOCATION \
    --tags "Environment=Production" "Application=TravelInsurance"

# Step 2: Create Container Registry
log_info "Creating Azure Container Registry: $ACR_NAME"
az acr create \
    --resource-group $RESOURCE_GROUP \
    --name $ACR_NAME \
    --sku Basic \
    --admin-enabled true

# Get ACR credentials
ACR_LOGIN_SERVER=$(az acr show --name $ACR_NAME --query loginServer --output tsv)
ACR_USERNAME=$(az acr credential show --name $ACR_NAME --query username --output tsv)
ACR_PASSWORD=$(az acr credential show --name $ACR_NAME --query passwords[0].value --output tsv)

log_info "Container Registry created: $ACR_LOGIN_SERVER"

# Step 3: Create Key Vault
log_info "Creating Azure Key Vault: $KEYVAULT_NAME"
az keyvault create \
    --resource-group $RESOURCE_GROUP \
    --name $KEYVAULT_NAME \
    --location $LOCATION \
    --sku standard \
    --enabled-for-deployment true \
    --enabled-for-template-deployment true

# Step 4: Create PostgreSQL Database
log_info "Creating Azure PostgreSQL Flexible Server: $DB_SERVER_NAME"
log_warn "This may take several minutes..."

# Generate a secure password
DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)

az postgres flexible-server create \
    --resource-group $RESOURCE_GROUP \
    --name $DB_SERVER_NAME \
    --location $LOCATION \
    --admin-user dbadmin \
    --admin-password "$DB_PASSWORD" \
    --sku-name Standard_B1ms \
    --tier Burstable \
    --version 14 \
    --storage-size 32 \
    --public-access 0.0.0.0-255.255.255.255

# Create database
log_info "Creating database: $DB_NAME"
az postgres flexible-server db create \
    --resource-group $RESOURCE_GROUP \
    --server-name $DB_SERVER_NAME \
    --database-name $DB_NAME

# Get database hostname
DB_HOST=$(az postgres flexible-server show \
    --resource-group $RESOURCE_GROUP \
    --name $DB_SERVER_NAME \
    --query fullyQualifiedDomainName \
    --output tsv)

log_info "Database created: $DB_HOST"

# Step 5: Store secrets in Key Vault
log_info "Storing secrets in Key Vault..."
az keyvault secret set --vault-name $KEYVAULT_NAME --name "db-host" --value "$DB_HOST"
az keyvault secret set --vault-name $KEYVAULT_NAME --name "db-user" --value "dbadmin"
az keyvault secret set --vault-name $KEYVAULT_NAME --name "db-password" --value "$DB_PASSWORD"
az keyvault secret set --vault-name $KEYVAULT_NAME --name "db-name" --value "$DB_NAME"
az keyvault secret set --vault-name $KEYVAULT_NAME --name "db-port" --value "5432"
az keyvault secret set --vault-name $KEYVAULT_NAME --name "terracotta-user-id" --value "4072"
az keyvault secret set --vault-name $KEYVAULT_NAME --name "terracotta-user-code" --value "111427"

log_info "Secrets stored successfully"

# Step 6: Create Storage Account
log_info "Creating Azure Storage Account: $STORAGE_ACCOUNT_NAME"
az storage account create \
    --name $STORAGE_ACCOUNT_NAME \
    --resource-group $RESOURCE_GROUP \
    --location $LOCATION \
    --sku Standard_LRS \
    --kind StorageV2

# Create blob containers
log_info "Creating blob containers..."
az storage container create \
    --account-name $STORAGE_ACCOUNT_NAME \
    --name policy-documents \
    --public-access off

az storage container create \
    --account-name $STORAGE_ACCOUNT_NAME \
    --name certificates \
    --public-access off

# Step 7: Build and push Docker images
log_info "Building and pushing Docker images..."

# Login to ACR
az acr login --name $ACR_NAME

# Build and push backend
log_info "Building backend API image..."
docker build -t $ACR_LOGIN_SERVER/travel-insurance-backend:latest ./backend
docker push $ACR_LOGIN_SERVER/travel-insurance-backend:latest

# Build and push proxy
log_info "Building proxy server image..."
docker build -t $ACR_LOGIN_SERVER/travel-insurance-proxy:latest ./server
docker push $ACR_LOGIN_SERVER/travel-insurance-proxy:latest

# Step 8: Create Container Apps Environment
log_info "Creating Container Apps Environment..."
az containerapp env create \
    --name $CONTAINER_ENV_NAME \
    --resource-group $RESOURCE_GROUP \
    --location $LOCATION

# Step 9: Deploy Backend Container App
log_info "Deploying backend Container App..."
az containerapp create \
    --name $BACKEND_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --environment $CONTAINER_ENV_NAME \
    --image $ACR_LOGIN_SERVER/travel-insurance-backend:latest \
    --target-port 5002 \
    --ingress external \
    --registry-server $ACR_LOGIN_SERVER \
    --registry-username $ACR_USERNAME \
    --registry-password $ACR_PASSWORD \
    --secrets \
        db-host="$DB_HOST" \
        db-user="dbadmin" \
        db-password="$DB_PASSWORD" \
        db-name="$DB_NAME" \
    --env-vars \
        DB_HOST=secretref:db-host \
        DB_USER=secretref:db-user \
        DB_PASSWORD=secretref:db-password \
        DB_NAME=secretref:db-name \
        DB_PORT=5432 \
        NODE_ENV=production \
        PORT=5002 \
    --min-replicas 0 \
    --max-replicas 5

# Get backend URL
BACKEND_URL=$(az containerapp show \
    --name $BACKEND_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --query properties.configuration.ingress.fqdn \
    --output tsv)

log_info "Backend deployed: https://$BACKEND_URL"

# Step 10: Deploy Proxy Container App
log_info "Deploying proxy Container App..."
az containerapp create \
    --name $PROXY_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --environment $CONTAINER_ENV_NAME \
    --image $ACR_LOGIN_SERVER/travel-insurance-proxy:latest \
    --target-port 3001 \
    --ingress external \
    --registry-server $ACR_LOGIN_SERVER \
    --registry-username $ACR_USERNAME \
    --registry-password $ACR_PASSWORD \
    --secrets \
        db-host="$DB_HOST" \
        db-user="dbadmin" \
        db-password="$DB_PASSWORD" \
        db-name="$DB_NAME" \
    --env-vars \
        DB_HOST=secretref:db-host \
        DB_USER=secretref:db-user \
        DB_PASSWORD=secretref:db-password \
        DB_NAME=secretref:db-name \
        DB_PORT=5432 \
        NODE_ENV=production \
        PORT=3001 \
    --min-replicas 0 \
    --max-replicas 3

# Get proxy URL
PROXY_URL=$(az containerapp show \
    --name $PROXY_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --query properties.configuration.ingress.fqdn \
    --output tsv)

log_info "Proxy deployed: https://$PROXY_URL"

# Step 11: Deploy Frontend to Static Web Apps
log_info "Frontend deployment requires manual setup via Azure Portal or GitHub Actions"
log_warn "Please follow these steps:"
echo "1. Go to Azure Portal > Static Web Apps"
echo "2. Create new Static Web App"
echo "3. Connect to GitHub repository"
echo "4. Set build location: /"
echo "5. Set app location: src"
echo "6. Set output location: build"
echo "7. Add environment variable: REACT_APP_API_URL=https://$BACKEND_URL/api"
echo "8. Add environment variable: REACT_APP_TERRACOTTA_PROXY=https://$PROXY_URL/api/terracotta"

# Summary
log_info "=========================================="
log_info "Deployment Summary"
log_info "=========================================="
log_info "Resource Group: $RESOURCE_GROUP"
log_info "Location: $LOCATION"
log_info ""
log_info "Backend API URL: https://$BACKEND_URL"
log_info "Proxy Server URL: https://$PROXY_URL"
log_info "Database Host: $DB_HOST"
log_info "Database Name: $DB_NAME"
log_info "Key Vault: $KEYVAULT_NAME"
log_info "Storage Account: $STORAGE_ACCOUNT_NAME"
log_info ""
log_warn "IMPORTANT: Save these credentials securely!"
log_info "Database Username: dbadmin"
log_info "Database Password: $DB_PASSWORD"
log_info ""
log_info "Next Steps:"
log_info "1. Migrate database schema: psql -h $DB_HOST -U dbadmin -d $DB_NAME < backend/schema.sql"
log_info "2. Set up Static Web App for frontend"
log_info "3. Configure Application Insights"
log_info "4. Set up monitoring and alerts"
log_info "=========================================="

# Save configuration to file
cat > azure-config.txt <<EOF
# Azure Deployment Configuration
# Generated: $(date)

RESOURCE_GROUP=$RESOURCE_GROUP
LOCATION=$LOCATION
ACR_NAME=$ACR_NAME
BACKEND_APP_NAME=$BACKEND_APP_NAME
PROXY_APP_NAME=$PROXY_APP_NAME
DB_SERVER_NAME=$DB_SERVER_NAME
DB_NAME=$DB_NAME
KEYVAULT_NAME=$KEYVAULT_NAME
STORAGE_ACCOUNT_NAME=$STORAGE_ACCOUNT_NAME

# URLs
BACKEND_URL=https://$BACKEND_URL
PROXY_URL=https://$PROXY_URL

# Database
DB_HOST=$DB_HOST
DB_USER=dbadmin
DB_PASSWORD=$DB_PASSWORD
DB_PORT=5432

# Container Registry
ACR_LOGIN_SERVER=$ACR_LOGIN_SERVER
ACR_USERNAME=$ACR_USERNAME
EOF

log_info "Configuration saved to: azure-config.txt"
log_warn "Keep this file secure and do not commit it to version control!"

log_info "Deployment completed successfully! 🚀"

