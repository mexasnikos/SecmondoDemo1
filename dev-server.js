const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Only serve specific static files we need, not the entire public directory
// Serve React and ReactDOM from node_modules
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// Handle favicon and manifest requests gracefully
app.get('/favicon.ico', (req, res) => {
  res.status(204).end(); // No content
});

app.get('/manifest.json', (req, res) => {
  res.json({
    "short_name": "TravelSafe",
    "name": "TravelSafe - Travel Insurance Made Easy",
    "start_url": "/",
    "display": "standalone",
    "theme_color": "#0077b6",
    "background_color": "#ffffff"
  });
});

// For development, create a simple working HTML page without external dependencies
const devIndexHtml = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#0077b6" />
    <meta name="description" content="Travel Insurance Made Easy - Get instant coverage for your next adventure" />
    <title>TravelSafe - Travel Insurance Made Easy</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>✈️</text></svg>" />
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }
      .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
      
      /* Header */
      .header { 
        background: linear-gradient(135deg, #0077b6 0%, #00b4d8 100%);
        color: white;
        padding: 1rem 0;
      }
      .nav { 
        display: flex; 
        justify-content: space-between; 
        align-items: center;
      }
      .logo { font-size: 1.8rem; font-weight: bold; }
      .nav-btn { 
        background: white;
        color: #0077b6;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        font-weight: bold;
        cursor: pointer;
        text-decoration: none;
        display: inline-block;
      }
      
      /* Hero Section */
      .hero { 
        background: linear-gradient(135deg, #0077b6 0%, #00b4d8 100%);
        color: white;
        padding: 4rem 0;
        text-align: center;
      }
      .hero h1 { font-size: 3rem; margin-bottom: 1rem; }
      .hero p { font-size: 1.25rem; margin-bottom: 2rem; opacity: 0.9; }
      .cta-btn { 
        background: rgba(255,255,255,0.2);
        color: white;
        border: 2px solid white;
        padding: 1rem 2rem;
        border-radius: 0.5rem;
        font-size: 1.1rem;
        font-weight: bold;
        cursor: pointer;
        text-decoration: none;
        display: inline-block;
        transition: all 0.3s ease;
      }
      .cta-btn:hover { background: white; color: #0077b6; }
      
      /* Quote Form */
      .quote-section { 
        padding: 4rem 0;
        background: #f8f9fa;
        display: none;
      }
      .quote-form { 
        max-width: 600px;
        margin: 0 auto;
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      }
      .form-group { margin-bottom: 1rem; }
      .form-group label { 
        display: block;
        margin-bottom: 0.5rem;
        font-weight: bold;
        color: #333;
      }
      .form-group input { 
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 0.5rem;
        font-size: 1rem;
      }
      .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
      .submit-btn { 
        background: #0077b6;
        color: white;
        border: none;
        padding: 1rem;
        border-radius: 0.5rem;
        font-size: 1.1rem;
        font-weight: bold;
        cursor: pointer;
        width: 100%;
        margin-top: 1rem;
      }
      .back-link { 
        text-align: center;
        margin-top: 1rem;
      }
      .back-link a { 
        color: #0077b6;
        text-decoration: none;
      }
      
      /* Show/Hide sections */
      .home-section.hidden { display: none; }
      .quote-section.visible { display: block; }
    </style>
  </head>
  <body>
    <!-- Header -->
    <header class="header">
      <div class="container">
        <nav class="nav">
          <div class="logo">TravelSafe</div>
          <a href="#" class="nav-btn" onclick="showQuote()">Get Quote</a>
        </nav>
      </div>
    </header>

    <!-- Home Section -->
    <section class="home-section" id="homeSection">
      <div class="hero">
        <div class="container">
          <h1>Travel Insurance Made Easy</h1>
          <p>Get instant coverage for your next adventure</p>
          <a href="#" class="cta-btn" onclick="showQuote()">Start Your Quote →</a>
        </div>
      </div>
    </section>

    <!-- Quote Section -->
    <section class="quote-section" id="quoteSection">
      <div class="container">
        <div class="quote-form">
          <h1 style="color: #0077b6; margin-bottom: 2rem; text-align: center;">Get Your Travel Quote</h1>
          <form onsubmit="submitQuote(event)">
            <div class="form-group">
              <label for="destination">Destination</label>
              <input type="text" id="destination" name="destination" placeholder="Where are you traveling?" required>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="startDate">Start Date</label>
                <input type="date" id="startDate" name="startDate" required>
              </div>
              <div class="form-group">
                <label for="endDate">End Date</label>
                <input type="date" id="endDate" name="endDate" required>
              </div>
            </div>
            
            <div class="form-group">
              <label for="travelers">Number of Travelers</label>
              <input type="number" id="travelers" name="travelers" value="1" min="1" max="10" required>
            </div>
            
            <div class="form-group">
              <label for="vaxId">VAX ID</label>
              <input type="text" id="vaxId" name="vaxId" placeholder="Enter your VAX ID" required>
            </div>
            
            <div class="form-group">
              <label for="email">Email Address</label>
              <input type="email" id="email" name="email" placeholder="your@email.com" required>
            </div>
            
            <button type="submit" class="submit-btn">Get Quote</button>
            
            <div class="back-link">
              <a href="#" onclick="showHome()">← Back to Home</a>
            </div>
          </form>
        </div>
      </div>
    </section>

    <script>
      function showQuote() {
        document.getElementById('homeSection').classList.add('hidden');
        document.getElementById('quoteSection').classList.add('visible');
      }
      
      function showHome() {
        document.getElementById('homeSection').classList.remove('hidden');
        document.getElementById('quoteSection').classList.remove('visible');
      }
      
      function submitQuote(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);
        
        alert('Quote Request Submitted!\\n\\n' + 
              'Destination: ' + data.destination + '\\n' +
              'Dates: ' + data.startDate + ' to ' + data.endDate + '\\n' +
              'Travelers: ' + data.travelers + '\\n' +
              'VAX ID: ' + data.vaxId + '\\n' +
              'Email: ' + data.email + '\\n\\n' +
              'Thank you for choosing TravelSafe!');
      }
    </script>
  </body>
</html>
`;

// Serve the development index.html
app.get('/', (req, res) => {
  res.send(devIndexHtml);
});

// Handle React routing - send all other requests to index.html
app.get('*', (req, res) => {
  res.send(devIndexHtml);
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 TravelSafe server running at http://localhost:${PORT}`);
  console.log(`📂 Serving files from: ${__dirname}`);
});
