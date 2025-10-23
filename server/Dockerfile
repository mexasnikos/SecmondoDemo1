# Dockerfile for Proxy Server (Terracotta SOAP API)
# This containerizes the proxy server that handles SOAP requests

FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files from root (since server shares dependencies)
COPY package*.json ./

# Install dependencies (including dev dependencies needed for xmldom)
RUN npm ci --only=production

# Copy proxy server files
COPY proxy-server.js ./

# Copy backend dependencies (soap-logger)
RUN mkdir -p backend
COPY ../backend/soap-logger.js ./backend/

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Expose the port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the proxy server
CMD ["node", "proxy-server.js"]

