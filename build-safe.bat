@echo off
echo Setting Node.js legacy OpenSSL provider...
set NODE_OPTIONS=--openssl-legacy-provider
set GENERATE_SOURCEMAP=false
set DISABLE_ESLINT_PLUGIN=true
set SKIP_PREFLIGHT_CHECK=true
echo Building React application...
npx react-app-rewired build
