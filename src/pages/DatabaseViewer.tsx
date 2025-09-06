"use client";
import React, { useState, useEffect } from 'react';
import './DatabaseViewer.css';

interface TableSchema {
  name: string;
  columns: string[];
  primaryKey: string;
  foreignKeys?: string[];
  rowCount: number;
}

interface DatabaseStats {
  totalTables: number;
  totalRecords: number;
  tableStats: { name: string; count: number }[];
}

const DatabaseViewer: React.FC = () => {
  const [tables, setTables] = useState<TableSchema[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tableData, setTableData] = useState<any[]>([]);
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock database schema and data
  const mockSchema: Record<string, TableSchema> = {
    quotes: {
      name: 'quotes',
      columns: ['id', 'destination', 'start_date', 'end_date', 'trip_type', 'number_of_travelers', 'total_amount', 'status', 'policy_number', 'created_at'],
      primaryKey: 'id',
      rowCount: 5
    },
    travelers: {
      name: 'travelers',
      columns: ['id', 'quote_id', 'first_name', 'last_name', 'age', 'email', 'phone', 'nationality', 'created_at'],
      primaryKey: 'id',
      foreignKeys: ['quote_id -> quotes.id'],
      rowCount: 8
    },
    contact_messages: {
      name: 'contact_messages',
      columns: ['id', 'name', 'email', 'subject', 'message', 'status', 'created_at'],
      primaryKey: 'id',
      rowCount: 3
    },
    payments: {
      name: 'payments',
      columns: ['id', 'quote_id', 'payment_method', 'amount', 'status', 'policy_number', 'created_at'],
      primaryKey: 'id',
      foreignKeys: ['quote_id -> quotes.id'],
      rowCount: 2
    },
    additional_policies: {
      name: 'additional_policies',
      columns: ['id', 'quote_id', 'policy_id', 'name', 'description', 'price', 'created_at'],
      primaryKey: 'id',
      foreignKeys: ['quote_id -> quotes.id'],
      rowCount: 4
    },
    policy_documents: {
      name: 'policy_documents',
      columns: ['id', 'quote_id', 'document_type', 'file_name', 'file_size', 'generated_at'],
      primaryKey: 'id',
      foreignKeys: ['quote_id -> quotes.id'],
      rowCount: 2
    },
    audit_log: {
      name: 'audit_log',
      columns: ['id', 'table_name', 'record_id', 'action', 'old_values', 'new_values', 'created_at'],
      primaryKey: 'id',
      rowCount: 12
    }
  };

  const mockData: Record<string, any[]> = {
    quotes: [
      { id: 1, destination: "Spain", start_date: "2025-08-01", end_date: "2025-08-10", trip_type: "single", number_of_travelers: 2, total_amount: 89.50, status: "pending", policy_number: null, created_at: "2025-07-15T10:30:00Z" },
      { id: 2, destination: "Thailand", start_date: "2025-09-15", end_date: "2025-09-30", trip_type: "comprehensive", number_of_travelers: 1, total_amount: 156.75, status: "paid", policy_number: "POL-2025-001", created_at: "2025-07-15T14:20:00Z" },
      { id: 3, destination: "Italy", start_date: "2025-10-05", end_date: "2025-10-12", trip_type: "annual", number_of_travelers: 4, total_amount: 299.99, status: "paid", policy_number: "POL-2025-002", created_at: "2025-07-15T16:45:00Z" }
    ],
    travelers: [
      { id: 1, quote_id: 1, first_name: "John", last_name: "Doe", age: 35, email: "john.doe@email.com", phone: "+1234567890", nationality: "Irish", created_at: "2025-07-15T10:30:00Z" },
      { id: 2, quote_id: 1, first_name: "Jane", last_name: "Doe", age: 32, email: "jane.doe@email.com", phone: "+1234567890", nationality: "Irish", created_at: "2025-07-15T10:30:00Z" },
      { id: 3, quote_id: 2, first_name: "Alice", last_name: "Smith", age: 28, email: "alice.smith@email.com", phone: "+0987654321", nationality: "German", created_at: "2025-07-15T14:20:00Z" },
      { id: 4, quote_id: 3, first_name: "Bob", last_name: "Johnson", age: 45, email: "bob.j@email.com", phone: "+1122334455", nationality: "French", created_at: "2025-07-15T16:45:00Z" }
    ],
    contact_messages: [
      { id: 1, name: "Mike Johnson", email: "mike.j@email.com", subject: "Question about coverage", message: "I need more information about winter sports coverage", status: "new", created_at: "2025-07-15T09:15:00Z" },
      { id: 2, name: "Sarah Wilson", email: "sarah.w@email.com", subject: "Claim assistance", message: "I need help filing a claim for my recent trip", status: "in_progress", created_at: "2025-07-14T16:45:00Z" },
      { id: 3, name: "David Brown", email: "david.b@email.com", subject: "Policy question", message: "Can I extend my current policy?", status: "resolved", created_at: "2025-07-13T11:20:00Z" }
    ],
    payments: [
      { id: 1, quote_id: 2, payment_method: "card", amount: 156.75, status: "completed", policy_number: "POL-2025-001", created_at: "2025-07-15T14:25:00Z" },
      { id: 2, quote_id: 3, payment_method: "paypal", amount: 299.99, status: "completed", policy_number: "POL-2025-002", created_at: "2025-07-15T16:50:00Z" }
    ],
    additional_policies: [
      { id: 1, quote_id: 2, policy_id: "WINTER_SPORTS", name: "Winter Sports Coverage", description: "Extended coverage for skiing and snowboarding", price: 25.00, created_at: "2025-07-15T14:20:00Z" },
      { id: 2, quote_id: 3, policy_id: "FAMILY_DISCOUNT", name: "Family Discount", description: "Discount for families with children", price: -50.00, created_at: "2025-07-15T16:45:00Z" }
    ],
    policy_documents: [
      { id: 1, quote_id: 2, document_type: "policy", file_name: "policy_POL-2025-001.pdf", file_size: 245760, generated_at: "2025-07-15T14:30:00Z" },
      { id: 2, quote_id: 3, document_type: "certificate", file_name: "certificate_POL-2025-002.pdf", file_size: 198432, generated_at: "2025-07-15T16:55:00Z" }
    ],
    audit_log: [
      { id: 1, table_name: "quotes", record_id: 2, action: "INSERT", old_values: null, new_values: '{"destination": "Thailand", "status": "pending"}', created_at: "2025-07-15T14:20:00Z" },
      { id: 2, table_name: "payments", record_id: 1, action: "INSERT", old_values: null, new_values: '{"amount": 156.75, "status": "completed"}', created_at: "2025-07-15T14:25:00Z" },
      { id: 3, table_name: "quotes", record_id: 2, action: "UPDATE", old_values: '{"status": "pending"}', new_values: '{"status": "paid"}', created_at: "2025-07-15T14:26:00Z" }
    ]
  };

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      const tablesList = Object.values(mockSchema);
      setTables(tablesList);
      
      const totalRecords = Object.values(mockData).reduce((sum, table) => sum + table.length, 0);
      setStats({
        totalTables: tablesList.length,
        totalRecords,
        tableStats: tablesList.map(table => ({
          name: table.name,
          count: mockData[table.name]?.length || 0
        }))
      });
      
      setLoading(false);
    }, 1000);
  }, []);

  const handleTableSelect = (tableName: string) => {
    setSelectedTable(tableName);
    setTableData(mockData[tableName] || []);
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return 'NULL';
    if (typeof value === 'object') return JSON.stringify(value);
    if (typeof value === 'string' && value.includes('T') && value.includes('Z')) {
      return new Date(value).toLocaleString();
    }
    return String(value);
  };

  if (loading) {
    return (
      <div className="database-viewer">
        <div className="loading">
          <h2>🔄 Loading Database Schema...</h2>
          <p>Initializing database connection and loading table information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="database-viewer">
      <div className="db-header">
        <h1>🗄️ Travel Insurance Database</h1>
        <p>Database schema overview and sample data preview</p>
      </div>

      {stats && (
        <div className="db-stats">
          <div className="stat-card">
            <div className="stat-number">{stats.totalTables}</div>
            <div className="stat-label">Tables</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.totalRecords}</div>
            <div className="stat-label">Sample Records</div>
          </div>
          {stats.tableStats.map(stat => (
            <div key={stat.name} className="stat-card">
              <div className="stat-number">{stat.count}</div>
              <div className="stat-label">{stat.name}</div>
            </div>
          ))}
        </div>
      )}

      <div className="db-content">
        <div className="tables-sidebar">
          <h3>📊 Database Tables</h3>
          <div className="tables-list">
            {tables.map(table => (
              <div 
                key={table.name}
                className={`table-item ${selectedTable === table.name ? 'active' : ''}`}
                onClick={() => handleTableSelect(table.name)}
              >
                <div className="table-name">{table.name}</div>
                <div className="table-info">
                  <span>{table.columns.length} columns</span>
                  <span>{table.rowCount} rows</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="table-viewer">
          {selectedTable ? (
            <div className="table-details">
              <div className="table-header">
                <h3>📋 Table: {selectedTable}</h3>
              </div>
              
              <div className="schema-info">
                <h4>Schema Information</h4>
                <div className="schema-details">
                  <p><strong>Primary Key:</strong> {mockSchema[selectedTable].primaryKey}</p>
                  {mockSchema[selectedTable].foreignKeys && (
                    <p><strong>Foreign Keys:</strong> {mockSchema[selectedTable].foreignKeys!.join(', ')}</p>
                  )}
                  <div className="columns-list">
                    <strong>Columns:</strong>
                    <div className="columns">
                      {mockSchema[selectedTable].columns.map(column => (
                        <span 
                          key={column}
                          className={`column ${column === mockSchema[selectedTable].primaryKey ? 'primary-key' : ''}`}
                        >
                          {column}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="table-data">
                <h4>Sample Data ({tableData.length} records)</h4>
                {tableData.length > 0 ? (
                  <div className="data-table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          {Object.keys(tableData[0]).map(key => (
                            <th key={key}>{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.map((row, index) => (
                          <tr key={index}>
                            {Object.values(row).map((value, cellIndex) => (
                              <td key={cellIndex}>{formatValue(value)}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="no-data">No sample data available for this table.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="no-selection">
              <h3>👈 Select a table to view its structure and data</h3>
              <p>Click on any table from the sidebar to see its schema information and sample data.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DatabaseViewer;
