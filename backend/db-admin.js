const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Mock database data (since PostgreSQL isn't installed yet)
const mockData = {
  quotes: [
    {
      id: 1,
      destination: "Spain",
      start_date: "2025-08-01",
      end_date: "2025-08-10",
      trip_type: "single",
      number_of_travelers: 2,
      total_amount: 89.50,
      status: "pending",
      created_at: "2025-07-15T10:30:00Z"
    },
    {
      id: 2,
      destination: "Thailand",
      start_date: "2025-09-15",
      end_date: "2025-09-30",
      trip_type: "comprehensive",
      number_of_travelers: 1,
      total_amount: 156.75,
      status: "paid",
      created_at: "2025-07-15T14:20:00Z"
    }
  ],
  travelers: [
    {
      id: 1,
      quote_id: 1,
      first_name: "John",
      last_name: "Doe",
      age: 35,
      email: "john.doe@email.com",
      phone: "+1234567890",
      nationality: "Irish"
    },
    {
      id: 2,
      quote_id: 1,
      first_name: "Jane",
      last_name: "Doe",
      age: 32,
      email: "jane.doe@email.com",
      phone: "+1234567890",
      nationality: "Irish"
    },
    {
      id: 3,
      quote_id: 2,
      first_name: "Alice",
      last_name: "Smith",
      age: 28,
      email: "alice.smith@email.com",
      phone: "+0987654321",
      nationality: "German"
    }
  ],
  contact_messages: [
    {
      id: 1,
      name: "Mike Johnson",
      email: "mike.j@email.com",
      subject: "Question about coverage",
      message: "I need more information about winter sports coverage",
      status: "new",
      created_at: "2025-07-15T09:15:00Z"
    },
    {
      id: 2,
      name: "Sarah Wilson",
      email: "sarah.w@email.com",
      subject: "Claim assistance",
      message: "I need help filing a claim for my recent trip",
      status: "in_progress",
      created_at: "2025-07-14T16:45:00Z"
    }
  ],
  payments: [
    {
      id: 1,
      quote_id: 2,
      payment_method: "card",
      amount: 156.75,
      status: "completed",
      policy_number: "POL-2025-001",
      created_at: "2025-07-15T14:25:00Z"
    }
  ],
  additional_policies: [
    {
      id: 1,
      quote_id: 2,
      policy_id: "WINTER_SPORTS",
      name: "Winter Sports Coverage",
      description: "Extended coverage for skiing and snowboarding",
      price: 25.00
    }
  ],
  policy_documents: [
    {
      id: 1,
      quote_id: 2,
      document_type: "policy",
      file_name: "policy_POL-2025-001.pdf",
      file_size: 245760,
      generated_at: "2025-07-15T14:30:00Z"
    }
  ],
  audit_log: [
    {
      id: 1,
      table_name: "quotes",
      record_id: 2,
      action: "INSERT",
      new_values: { destination: "Thailand", status: "pending" },
      created_at: "2025-07-15T14:20:00Z"
    },
    {
      id: 2,
      table_name: "payments",
      record_id: 1,
      action: "INSERT",
      new_values: { amount: 156.75, status: "completed" },
      created_at: "2025-07-15T14:25:00Z"
    }
  ]
};

// Database schema information
const schema = {
  quotes: {
    columns: ['id', 'destination', 'start_date', 'end_date', 'trip_type', 'number_of_travelers', 'total_amount', 'status', 'policy_number', 'created_at'],
    primaryKey: 'id'
  },
  travelers: {
    columns: ['id', 'quote_id', 'first_name', 'last_name', 'age', 'email', 'phone', 'nationality', 'created_at'],
    primaryKey: 'id',
    foreignKeys: ['quote_id -> quotes.id']
  },
  contact_messages: {
    columns: ['id', 'name', 'email', 'subject', 'message', 'status', 'created_at'],
    primaryKey: 'id'
  },
  payments: {
    columns: ['id', 'quote_id', 'payment_method', 'amount', 'status', 'policy_number', 'created_at'],
    primaryKey: 'id',
    foreignKeys: ['quote_id -> quotes.id']
  },
  additional_policies: {
    columns: ['id', 'quote_id', 'policy_id', 'name', 'description', 'price', 'created_at'],
    primaryKey: 'id',
    foreignKeys: ['quote_id -> quotes.id']
  },
  policy_documents: {
    columns: ['id', 'quote_id', 'document_type', 'file_name', 'file_size', 'generated_at'],
    primaryKey: 'id',
    foreignKeys: ['quote_id -> quotes.id']
  },
  audit_log: {
    columns: ['id', 'table_name', 'record_id', 'action', 'old_values', 'new_values', 'created_at'],
    primaryKey: 'id'
  }
};

// API Routes
app.get('/api/tables', (req, res) => {
  const tables = Object.keys(schema).map(tableName => ({
    name: tableName,
    rowCount: mockData[tableName] ? mockData[tableName].length : 0,
    columns: schema[tableName].columns.length,
    schema: schema[tableName]
  }));
  
  res.json({ tables });
});

app.get('/api/table/:tableName', (req, res) => {
  const { tableName } = req.params;
  
  if (!mockData[tableName]) {
    return res.status(404).json({ error: 'Table not found' });
  }
  
  res.json({
    tableName,
    schema: schema[tableName],
    data: mockData[tableName],
    totalRows: mockData[tableName].length
  });
});

app.get('/api/stats', (req, res) => {
  const stats = {
    totalTables: Object.keys(schema).length,
    totalRecords: Object.values(mockData).reduce((sum, table) => sum + table.length, 0),
    tableStats: Object.keys(mockData).map(tableName => ({
      name: tableName,
      count: mockData[tableName].length
    }))
  };
  
  res.json(stats);
});

// Serve admin interface
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Travel Insurance Database Admin</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; }
            .header { background: #0077b6; color: white; padding: 1rem 2rem; }
            .header h1 { margin-bottom: 0.5rem; }
            .header p { opacity: 0.9; }
            .container { max-width: 1200px; margin: 2rem auto; padding: 0 1rem; }
            .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
            .stat-card { background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .stat-number { font-size: 2rem; font-weight: bold; color: #0077b6; }
            .stat-label { color: #666; margin-top: 0.5rem; }
            .tables-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; }
            .table-card { background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden; }
            .table-header { background: #0077b6; color: white; padding: 1rem; }
            .table-content { padding: 1rem; }
            .table-info { display: flex; justify-content: space-between; margin-bottom: 1rem; }
            .table-info span { background: #f0f0f0; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.875rem; }
            .btn { background: #0077b6; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; text-decoration: none; display: inline-block; }
            .btn:hover { background: #005885; }
            .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; }
            .modal-content { background: white; margin: 5% auto; width: 90%; max-width: 1000px; border-radius: 8px; overflow: hidden; max-height: 80vh; overflow-y: auto; }
            .modal-header { background: #0077b6; color: white; padding: 1rem; display: flex; justify-content: space-between; align-items: center; }
            .close { font-size: 1.5rem; cursor: pointer; }
            .modal-body { padding: 1rem; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #ddd; }
            th { background: #f8f9fa; font-weight: 600; }
            tr:hover { background: #f8f9fa; }
            .schema-info { background: #f8f9fa; padding: 1rem; margin-bottom: 1rem; border-radius: 4px; }
            .schema-info h4 { margin-bottom: 0.5rem; }
            .columns { display: flex; flex-wrap: wrap; gap: 0.5rem; }
            .column { background: #e3f2fd; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.875rem; }
            .primary-key { background: #ffeb3b; }
            .foreign-key { background: #f8bbd9; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🗄️ Travel Insurance Database Admin</h1>
            <p>View database tables and sample data</p>
        </div>
        
        <div class="container">
            <div class="stats" id="stats">
                <!-- Stats will be loaded here -->
            </div>
            
            <div class="tables-grid" id="tables">
                <!-- Tables will be loaded here -->
            </div>
        </div>
        
        <!-- Modal -->
        <div id="tableModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 id="modalTitle">Table Data</h3>
                    <span class="close">&times;</span>
                </div>
                <div class="modal-body" id="modalBody">
                    <!-- Table data will be loaded here -->
                </div>
            </div>
        </div>
        
        <script>
            // Load stats
            fetch('/api/stats')
                .then(res => res.json())
                .then(data => {
                    const statsHTML = \`
                        <div class="stat-card">
                            <div class="stat-number">\${data.totalTables}</div>
                            <div class="stat-label">Total Tables</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">\${data.totalRecords}</div>
                            <div class="stat-label">Total Records</div>
                        </div>
                        \${data.tableStats.map(stat => \`
                            <div class="stat-card">
                                <div class="stat-number">\${stat.count}</div>
                                <div class="stat-label">\${stat.name}</div>
                            </div>
                        \`).join('')}
                    \`;
                    document.getElementById('stats').innerHTML = statsHTML;
                });
            
            // Load tables
            fetch('/api/tables')
                .then(res => res.json())
                .then(data => {
                    const tablesHTML = data.tables.map(table => \`
                        <div class="table-card">
                            <div class="table-header">
                                <h3>\${table.name}</h3>
                            </div>
                            <div class="table-content">
                                <div class="table-info">
                                    <span>📊 \${table.rowCount} rows</span>
                                    <span>📋 \${table.columns} columns</span>
                                </div>
                                <button class="btn" onclick="viewTable('\${table.name}')">View Data</button>
                            </div>
                        </div>
                    \`).join('');
                    document.getElementById('tables').innerHTML = tablesHTML;
                });
            
            // View table data
            function viewTable(tableName) {
                fetch(\`/api/table/\${tableName}\`)
                    .then(res => res.json())
                    .then(data => {
                        const modal = document.getElementById('tableModal');
                        const title = document.getElementById('modalTitle');
                        const body = document.getElementById('modalBody');
                        
                        title.textContent = \`Table: \${tableName}\`;
                        
                        let html = \`
                            <div class="schema-info">
                                <h4>📋 Schema Information</h4>
                                <p><strong>Primary Key:</strong> \${data.schema.primaryKey}</p>
                                \${data.schema.foreignKeys ? \`<p><strong>Foreign Keys:</strong> \${data.schema.foreignKeys.join(', ')}</p>\` : ''}
                                <p><strong>Columns:</strong></p>
                                <div class="columns">
                                    \${data.schema.columns.map(col => \`
                                        <span class="column \${col === data.schema.primaryKey ? 'primary-key' : ''}">\${col}</span>
                                    \`).join('')}
                                </div>
                            </div>
                        \`;
                        
                        if (data.data.length > 0) {
                            html += \`
                                <table>
                                    <thead>
                                        <tr>
                                            \${Object.keys(data.data[0]).map(key => \`<th>\${key}</th>\`).join('')}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        \${data.data.map(row => \`
                                            <tr>
                                                \${Object.values(row).map(value => \`
                                                    <td>\${typeof value === 'object' ? JSON.stringify(value) : value}</td>
                                                \`).join('')}
                                            </tr>
                                        \`).join('')}
                                    </tbody>
                                </table>
                            \`;
                        } else {
                            html += '<p>No data available in this table.</p>';
                        }
                        
                        body.innerHTML = html;
                        modal.style.display = 'block';
                    });
            }
            
            // Close modal
            document.querySelector('.close').onclick = function() {
                document.getElementById('tableModal').style.display = 'none';
            }
            
            window.onclick = function(event) {
                const modal = document.getElementById('tableModal');
                if (event.target == modal) {
                    modal.style.display = 'none';
                }
            }
        </script>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`🗄️  Database Admin Interface running on http://localhost:${PORT}`);
  console.log(`📊 View your database tables and sample data in your browser`);
  console.log(`🔍 Click on any table to see its structure and data`);
});
