const http = require('http');
const https = require('https');
const { performance } = require('perf_hooks');

// Performance testing script
class PerformanceTester {
  constructor(baseUrl = 'http://localhost:5000') {
    this.baseUrl = baseUrl;
    this.results = [];
  }

  async makeRequest(endpoint, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
      const startTime = performance.now();
      const url = new URL(endpoint, this.baseUrl);
      
      const options = {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        method: method,
        headers: {
          'Content-Type': 'application/json',
        }
      };

      if (data) {
        const postData = JSON.stringify(data);
        options.headers['Content-Length'] = Buffer.byteLength(postData);
      }

      const req = http.request(options, (res) => {
        let responseData = '';
        
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        
        res.on('end', () => {
          const endTime = performance.now();
          const duration = endTime - startTime;
          
          resolve({
            statusCode: res.statusCode,
            duration: duration,
            size: responseData.length,
            endpoint: endpoint,
            method: method
          });
        });
      });

      req.on('error', (err) => {
        reject(err);
      });

      if (data) {
        req.write(JSON.stringify(data));
      }
      
      req.end();
    });
  }

  async runTests() {
    console.log('🚀 Starting Performance Tests...\n');

    const tests = [
      { name: 'Health Check', endpoint: '/api/health' },
      { name: 'Database Test', endpoint: '/api/db-test' },
      { name: 'Statistics', endpoint: '/api/stats' },
      { name: 'Quotes List', endpoint: '/api/quotes' },
      { name: 'Contact Messages', endpoint: '/api/contact-messages' },
    ];

    for (const test of tests) {
      try {
        console.log(`Testing ${test.name}...`);
        const result = await this.makeRequest(test.endpoint);
        this.results.push(result);
        
        const status = result.statusCode === 200 ? '✅' : '❌';
        console.log(`${status} ${test.name}: ${result.duration.toFixed(2)}ms (${result.size} bytes)`);
      } catch (error) {
        console.log(`❌ ${test.name}: Error - ${error.message}`);
      }
    }

    this.printSummary();
  }

  printSummary() {
    console.log('\n📊 Performance Summary:');
    console.log('='.repeat(50));
    
    const successfulTests = this.results.filter(r => r.statusCode === 200);
    const avgDuration = successfulTests.reduce((sum, r) => sum + r.duration, 0) / successfulTests.length;
    const totalSize = successfulTests.reduce((sum, r) => sum + r.size, 0);
    
    console.log(`Total Tests: ${this.results.length}`);
    console.log(`Successful: ${successfulTests.length}`);
    console.log(`Average Response Time: ${avgDuration.toFixed(2)}ms`);
    console.log(`Total Data Transferred: ${(totalSize / 1024).toFixed(2)} KB`);
    
    console.log('\n📈 Response Times:');
    successfulTests.forEach(result => {
      const status = result.duration < 100 ? '🟢' : result.duration < 500 ? '🟡' : '🔴';
      console.log(`${status} ${result.endpoint}: ${result.duration.toFixed(2)}ms`);
    });

    // Performance recommendations
    console.log('\n💡 Performance Recommendations:');
    const slowEndpoints = successfulTests.filter(r => r.duration > 500);
    if (slowEndpoints.length > 0) {
      console.log('⚠️  Slow endpoints detected:');
      slowEndpoints.forEach(ep => {
        console.log(`   - ${ep.endpoint}: ${ep.duration.toFixed(2)}ms`);
      });
      console.log('   Consider adding caching or optimizing database queries');
    } else {
      console.log('✅ All endpoints are performing well!');
    }
  }
}

// Run performance tests
const tester = new PerformanceTester();
tester.runTests().catch(console.error);


