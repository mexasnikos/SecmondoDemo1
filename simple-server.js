const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Serve static files from the src directory for development
app.use('/static', express.static(path.join(__dirname, 'src')));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle React routing - send all requests to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 TravelSafe server running at http://localhost:${PORT}`);
  console.log('✅ Your React app is now accessible!');
  console.log('Press Ctrl+C to stop the server');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n📝 Shutting down server...');
  process.exit(0);
});
