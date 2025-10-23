-- Travel Insurance Database Schema
-- Run this script to create all necessary tables

-- Create database (if needed)
-- CREATE DATABASE travel_insurance;

-- Use the database
-- \c travel_insurance;

-- Enable UUID extension (if available)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: quotes
-- Stores main quote information
CREATE TABLE IF NOT EXISTS quotes (
    id SERIAL PRIMARY KEY,
    destination VARCHAR(255) NOT NULL,
    country_of_residence VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    trip_type VARCHAR(50) NOT NULL CHECK (trip_type IN ('single', 'annual', 'comprehensive', 'longstay')),
    number_of_travelers INTEGER NOT NULL CHECK (number_of_travelers > 0),
    selected_plan JSONB,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled', 'expired')),
    policy_number VARCHAR(100) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: travelers
-- Stores individual traveler information
CREATE TABLE IF NOT EXISTS travelers (
    id SERIAL PRIMARY KEY,
    quote_id INTEGER NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    age INTEGER NOT NULL CHECK (age > 0 AND age <= 120),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    vax_id VARCHAR(100),
    nationality VARCHAR(100),
    traveller_number VARCHAR(100), -- TravellerNumber from Terracotta API responses (ProvideQuotation/ProvideQuotationWithAlterations)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: additional_policies
-- Stores selected additional coverage options
CREATE TABLE IF NOT EXISTS additional_policies (
    id SERIAL PRIMARY KEY,
    quote_id INTEGER NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
    policy_id VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: payments
-- Stores payment information (sensitive data should be tokenized)
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    quote_id INTEGER NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('card', 'bank', 'paypal')),
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    policy_number VARCHAR(100) NOT NULL,
    billing_address JSONB,
    transaction_id VARCHAR(255),
    payment_gateway_response JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: contact_messages
-- Stores contact form submissions
CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'closed')),
    assigned_to VARCHAR(255),
    response TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: policy_documents
-- Stores generated policy documents and metadata
CREATE TABLE IF NOT EXISTS policy_documents (
    id SERIAL PRIMARY KEY,
    quote_id INTEGER NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL CHECK (document_type IN ('policy', 'certificate', 'receipt', 'terms')),
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500),
    file_size INTEGER,
    mime_type VARCHAR(100),
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: audit_log
-- Stores audit trail for important actions
CREATE TABLE IF NOT EXISTS audit_log (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id INTEGER NOT NULL,
    action VARCHAR(50) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_values JSONB,
    new_values JSONB,
    user_id VARCHAR(255),
    user_ip INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: countries
-- Stores available countries for Country of Residence dropdown
CREATE TABLE IF NOT EXISTS countries (
    country_id INTEGER PRIMARY KEY,
    country_name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert EU/EEA countries data
INSERT INTO countries (country_id, country_name) VALUES
(4, 'Austria'),
(6, 'Belgium'),
(10, 'Bulgaria'),
(14, 'Croatia (Hrvatska)'),
(16, 'Czech Republic'),
(17, 'Denmark'),
(20, 'Estonia'),
(21, 'Finland'),
(22, 'France'),
(23, 'Germany'),
(24, 'Greece'),
(27, 'Hungary'),
(28, 'Iceland'),
(33, 'Italy'),
(38, 'Latvia'),
(40, 'Liechtenstein'),
(41, 'Lithuania'),
(42, 'Luxembourg'),
(93, 'Malta'),
(47, 'Netherlands'),
(49, 'Norway'),
(53, 'Poland'),
(54, 'Portugal'),
(283, 'Republic of Cyprus'),
(19, 'Republic of Ireland'),
(55, 'Romania'),
(59, 'Slovak Republic'),
(60, 'Slovenia'),
(62, 'Spain'),
(63, 'Sweden')
ON CONFLICT (country_id) DO NOTHING;

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_policy_number ON quotes(policy_number);
CREATE INDEX IF NOT EXISTS idx_quotes_destination ON quotes(destination);
CREATE INDEX IF NOT EXISTS idx_travelers_quote_id ON travelers(quote_id);
CREATE INDEX IF NOT EXISTS idx_travelers_email ON travelers(email);
CREATE INDEX IF NOT EXISTS idx_travelers_traveller_number ON travelers(traveller_number);
CREATE INDEX IF NOT EXISTS idx_additional_policies_quote_id ON additional_policies(quote_id);
CREATE INDEX IF NOT EXISTS idx_payments_quote_id ON payments(quote_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_policy_documents_quote_id ON policy_documents(quote_id);
CREATE INDEX IF NOT EXISTS idx_countries_name ON countries(country_name);

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables that have updated_at columns
CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON quotes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON contact_messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Views for common queries

-- View: quote_summary
-- Provides a summary view of quotes with traveler count
CREATE OR REPLACE VIEW quote_summary AS
SELECT 
    q.id,
    q.destination,
    q.country_of_residence,
    q.start_date,
    q.end_date,
    q.trip_type,
    q.number_of_travelers,
    q.total_amount,
    q.status,
    q.policy_number,
    q.created_at,
    COUNT(t.id) as actual_traveler_count,
    COUNT(CASE WHEN p.status = 'completed' THEN 1 END) as completed_payments
FROM quotes q
LEFT JOIN travelers t ON q.id = t.quote_id
LEFT JOIN payments p ON q.id = p.quote_id
GROUP BY q.id, q.destination, q.country_of_residence, q.start_date, q.end_date, q.trip_type, 
         q.number_of_travelers, q.total_amount, q.status, q.policy_number, q.created_at;

-- View: revenue_by_month
-- Monthly revenue statistics
CREATE OR REPLACE VIEW revenue_by_month AS
SELECT 
    DATE_TRUNC('month', created_at) as month,
    COUNT(*) as total_quotes,
    COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_quotes,
    SUM(CASE WHEN status = 'paid' THEN total_amount ELSE 0 END) as revenue,
    AVG(CASE WHEN status = 'paid' THEN total_amount END) as avg_policy_value
FROM quotes
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

-- View: destination_stats
-- Popular destinations with statistics
CREATE OR REPLACE VIEW destination_stats AS
SELECT 
    destination,
    COUNT(*) as total_quotes,
    COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_quotes,
    SUM(CASE WHEN status = 'paid' THEN total_amount ELSE 0 END) as revenue,
    AVG(total_amount) as avg_quote_value,
    AVG(number_of_travelers) as avg_travelers
FROM quotes
GROUP BY destination
ORDER BY total_quotes DESC;

-- Sample data for testing (optional)
-- Uncomment if you want to insert test data

/*
INSERT INTO quotes (destination, start_date, end_date, trip_type, number_of_travelers, total_amount, status) VALUES
('Europe', '2024-08-01', '2024-08-15', 'single', 2, 299.99, 'paid'),
('Thailand', '2024-09-10', '2024-09-25', 'single', 1, 199.99, 'paid'),
('USA', '2024-10-05', '2024-10-20', 'comprehensive', 4, 899.99, 'pending');

INSERT INTO travelers (quote_id, first_name, last_name, age, email, phone, nationality) VALUES
(1, 'John', 'Doe', 35, 'john.doe@email.com', '+1234567890', 'American'),
(1, 'Jane', 'Doe', 32, 'jane.doe@email.com', '+1234567890', 'American'),
(2, 'Alice', 'Johnson', 28, 'alice.j@email.com', '+1987654321', 'British'),
(3, 'Bob', 'Smith', 45, 'bob.smith@email.com', '+1122334455', 'Canadian');

INSERT INTO contact_messages (name, email, subject, message) VALUES
('Test User', 'test@example.com', 'general', 'This is a test message to verify the system is working.');
*/

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO your_app_user;

-- Print success message
SELECT 'Database schema created successfully!' as status;
