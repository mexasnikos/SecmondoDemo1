# Dockerfile for Backend API Server
# This containerizes the Express.js backend API

FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy application files
COPY *.js ./
COPY *.sql ./
COPY *.md ./

# Create necessary directories
RUN mkdir -p logs

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5002

# Expose the port
EXPOSE 5002

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5002/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the server
CMD ["node", "server.js"]

