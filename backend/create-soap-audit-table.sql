-- SOAP Request/Response Audit Table
-- This table tracks all SOAP API interactions with Terracotta
-- Useful for debugging, monitoring, and compliance

CREATE TABLE IF NOT EXISTS soap_audit_log (
    id SERIAL PRIMARY KEY,
    
    -- Link to local quote (may be NULL for initial requests)
    quote_id INTEGER REFERENCES quotes(id) ON DELETE SET NULL,
    
    -- SOAP Operation Details
    soap_operation VARCHAR(100) NOT NULL, -- e.g., 'ProvideQuotation', 'ProvideQuotationWithAlterations', 'SavePolicyDetails', 'ScreeningQuestions'
    soap_method VARCHAR(50) NOT NULL, -- HTTP method (usually 'POST')
    endpoint_url VARCHAR(500) NOT NULL, -- Full URL endpoint
    
    -- Request Details
    request_body TEXT NOT NULL, -- Complete SOAP XML request
    request_headers JSONB, -- HTTP headers as JSON object
    
    -- Response Details
    response_body TEXT, -- Complete SOAP XML response
    response_headers JSONB, -- HTTP response headers
    http_status_code INTEGER, -- HTTP status code (200, 500, etc.)
    
    -- Terracotta-specific Data
    terracotta_quote_id VARCHAR(100), -- QuoteID from Terracotta response
    terracotta_policy_id VARCHAR(100), -- PolicyID from SavePolicyDetails
    user_id VARCHAR(50), -- Terracotta UserID used
    user_code VARCHAR(50), -- Terracotta UserCode used
    
    -- Status and Error Handling
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'timeout', 'error')),
    error_message TEXT, -- Error message if request failed
    
    -- Performance Metrics
    response_time_ms INTEGER, -- Response time in milliseconds
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Additional context
    client_ip INET, -- IP address of the client making the request
    user_agent TEXT, -- Browser/client user agent
    session_id VARCHAR(255), -- Session identifier if available
    
    -- Parsed response data (for quick queries)
    parsed_response JSONB -- Parsed response data for easier querying
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_soap_audit_quote_id ON soap_audit_log(quote_id);
CREATE INDEX IF NOT EXISTS idx_soap_audit_operation ON soap_audit_log(soap_operation);
CREATE INDEX IF NOT EXISTS idx_soap_audit_status ON soap_audit_log(status);
CREATE INDEX IF NOT EXISTS idx_soap_audit_created_at ON soap_audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_soap_audit_terracotta_quote_id ON soap_audit_log(terracotta_quote_id);
CREATE INDEX IF NOT EXISTS idx_soap_audit_terracotta_policy_id ON soap_audit_log(terracotta_policy_id);
CREATE INDEX IF NOT EXISTS idx_soap_audit_http_status ON soap_audit_log(http_status_code);

-- Trigger for updated_at timestamp
CREATE TRIGGER update_soap_audit_log_updated_at 
    BEFORE UPDATE ON soap_audit_log
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- View: SOAP Request Summary
-- Provides a quick overview of SOAP requests by operation
CREATE OR REPLACE VIEW soap_request_summary AS
SELECT 
    soap_operation,
    COUNT(*) as total_requests,
    COUNT(CASE WHEN status = 'success' THEN 1 END) as successful_requests,
    COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_requests,
    COUNT(CASE WHEN status = 'error' THEN 1 END) as error_requests,
    AVG(response_time_ms) as avg_response_time_ms,
    MIN(response_time_ms) as min_response_time_ms,
    MAX(response_time_ms) as max_response_time_ms,
    MAX(created_at) as last_request_at
FROM soap_audit_log
GROUP BY soap_operation
ORDER BY total_requests DESC;

-- View: Quote SOAP History
-- Shows all SOAP operations for each quote
CREATE OR REPLACE VIEW quote_soap_history AS
SELECT 
    q.id as quote_id,
    q.policy_number,
    q.status as quote_status,
    sal.id as soap_log_id,
    sal.soap_operation,
    sal.status as soap_status,
    sal.terracotta_quote_id,
    sal.terracotta_policy_id,
    sal.http_status_code,
    sal.response_time_ms,
    sal.error_message,
    sal.created_at as soap_request_at
FROM quotes q
LEFT JOIN soap_audit_log sal ON q.id = sal.quote_id
ORDER BY q.id DESC, sal.created_at DESC;

-- View: Recent SOAP Errors
-- Shows recent SOAP errors for monitoring
CREATE OR REPLACE VIEW recent_soap_errors AS
SELECT 
    id,
    quote_id,
    soap_operation,
    status,
    http_status_code,
    error_message,
    created_at,
    response_time_ms
FROM soap_audit_log
WHERE status IN ('failed', 'error', 'timeout')
ORDER BY created_at DESC
LIMIT 100;

-- View: SOAP Performance Stats by Hour
-- Performance metrics aggregated by hour
CREATE OR REPLACE VIEW soap_performance_by_hour AS
SELECT 
    DATE_TRUNC('hour', created_at) as hour,
    soap_operation,
    COUNT(*) as request_count,
    AVG(response_time_ms) as avg_response_time,
    MAX(response_time_ms) as max_response_time,
    COUNT(CASE WHEN status = 'success' THEN 1 END) as successful_count,
    COUNT(CASE WHEN status IN ('failed', 'error') THEN 1 END) as error_count
FROM soap_audit_log
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE_TRUNC('hour', created_at), soap_operation
ORDER BY hour DESC, soap_operation;

-- Function to get all SOAP operations for a specific quote
CREATE OR REPLACE FUNCTION get_quote_soap_operations(p_quote_id INTEGER)
RETURNS TABLE (
    operation VARCHAR(100),
    status VARCHAR(50),
    terracotta_quote_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE,
    response_time_ms INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sal.soap_operation,
        sal.status,
        sal.terracotta_quote_id,
        sal.created_at,
        sal.response_time_ms
    FROM soap_audit_log sal
    WHERE sal.quote_id = p_quote_id
    ORDER BY sal.created_at ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to check if a quote has completed all required SOAP operations
CREATE OR REPLACE FUNCTION check_quote_soap_completeness(p_quote_id INTEGER)
RETURNS TABLE (
    has_provide_quotation BOOLEAN,
    has_save_policy_details BOOLEAN,
    all_operations_successful BOOLEAN,
    operation_summary TEXT
) AS $$
DECLARE
    v_provide_quotation BOOLEAN;
    v_save_policy BOOLEAN;
    v_all_success BOOLEAN;
    v_summary TEXT;
BEGIN
    -- Check for ProvideQuotation
    SELECT EXISTS (
        SELECT 1 FROM soap_audit_log 
        WHERE quote_id = p_quote_id 
        AND soap_operation = 'ProvideQuotation' 
        AND status = 'success'
    ) INTO v_provide_quotation;
    
    -- Check for SavePolicyDetails
    SELECT EXISTS (
        SELECT 1 FROM soap_audit_log 
        WHERE quote_id = p_quote_id 
        AND soap_operation = 'SavePolicyDetails' 
        AND status = 'success'
    ) INTO v_save_policy;
    
    -- Check if all operations are successful
    SELECT NOT EXISTS (
        SELECT 1 FROM soap_audit_log 
        WHERE quote_id = p_quote_id 
        AND status IN ('failed', 'error')
    ) INTO v_all_success;
    
    -- Build summary
    SELECT string_agg(soap_operation || ':' || status, ', ' ORDER BY created_at)
    FROM soap_audit_log
    WHERE quote_id = p_quote_id
    INTO v_summary;
    
    RETURN QUERY SELECT 
        v_provide_quotation,
        v_save_policy,
        v_all_success,
        COALESCE(v_summary, 'No operations found');
END;
$$ LANGUAGE plpgsql;

-- Sample queries for monitoring

-- Get all failed SOAP requests in the last 24 hours
-- SELECT * FROM soap_audit_log 
-- WHERE status IN ('failed', 'error') 
-- AND created_at >= NOW() - INTERVAL '24 hours'
-- ORDER BY created_at DESC;

-- Get SOAP operations for a specific quote
-- SELECT * FROM get_quote_soap_operations(123);

-- Check completeness of SOAP operations for a quote
-- SELECT * FROM check_quote_soap_completeness(123);

-- Get average response time by operation
-- SELECT soap_operation, AVG(response_time_ms) as avg_ms, COUNT(*) as total
-- FROM soap_audit_log 
-- WHERE status = 'success'
-- GROUP BY soap_operation;

-- Find quotes with incomplete SOAP operations
-- SELECT DISTINCT quote_id 
-- FROM soap_audit_log sal1
-- WHERE NOT EXISTS (
--     SELECT 1 FROM soap_audit_log sal2 
--     WHERE sal2.quote_id = sal1.quote_id 
--     AND sal2.soap_operation = 'SavePolicyDetails' 
--     AND sal2.status = 'success'
-- );

COMMENT ON TABLE soap_audit_log IS 'Audit log for all SOAP API requests and responses to Terracotta insurance system';
COMMENT ON COLUMN soap_audit_log.quote_id IS 'Reference to local quote ID (may be NULL for initial API calls)';
COMMENT ON COLUMN soap_audit_log.soap_operation IS 'SOAP operation name (e.g., ProvideQuotation, SavePolicyDetails)';
COMMENT ON COLUMN soap_audit_log.request_body IS 'Complete SOAP XML request envelope';
COMMENT ON COLUMN soap_audit_log.response_body IS 'Complete SOAP XML response envelope';
COMMENT ON COLUMN soap_audit_log.terracotta_quote_id IS 'Quote ID returned by Terracotta API';
COMMENT ON COLUMN soap_audit_log.terracotta_policy_id IS 'Policy ID returned after successful SavePolicyDetails';
COMMENT ON COLUMN soap_audit_log.response_time_ms IS 'API response time in milliseconds';
COMMENT ON COLUMN soap_audit_log.parsed_response IS 'Parsed response data in JSON format for easier querying';

SELECT 'SOAP audit table created successfully!' as status;

