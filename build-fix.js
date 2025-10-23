// Temporary fix for Node.js v17+ compatibility with react-scripts 4.x
const spawn = require('child_process').spawn;

// Set the legacy OpenSSL provider and disable ESLint
process.env.NODE_OPTIONS = '--openssl-legacy-provider';
process.env.DISABLE_ESLINT_PLUGIN = 'true';
process.env.GENERATE_SOURCEMAP = 'false';

// Run the build command
const buildProcess = spawn('npx', ['react-scripts', 'build'], {
  stdio: 'inherit',
  shell: true,
  env: { 
    ...process.env, 
    NODE_OPTIONS: '--openssl-legacy-provider',
    DISABLE_ESLINT_PLUGIN: 'true',
    GENERATE_SOURCEMAP: 'false'
  }
});

buildProcess.on('close', (code) => {
  process.exit(code);
});
