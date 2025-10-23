-- Additional Views for Terracotta Quote and Policy ID Tracking
-- Run this after setting up the soap_audit_log table

-- View: Terracotta Quote ID Tracking
-- Shows all unique Terracotta Quote IDs with their SOAP operations
CREATE OR REPLACE VIEW terracotta_quote_tracking AS
SELECT 
    sal.terracotta_quote_id,
    sal.quote_id as local_quote_id,
    COUNT(DISTINCT sal.id) as soap_operation_count,
    STRING_AGG(DISTINCT sal.soap_operation, ', ' ORDER BY sal.soap_operation) as operations_performed,
    MIN(sal.created_at) as first_seen,
    MAX(sal.created_at) as last_seen,
    COUNT(CASE WHEN sal.status = 'success' THEN 1 END) as successful_operations,
    COUNT(CASE WHEN sal.status IN ('failed', 'error') THEN 1 END) as failed_operations,
    MAX(CASE WHEN sal.soap_operation = 'ProvideQuotation' THEN sal.created_at END) as quote_requested_at,
    MAX(CASE WHEN sal.soap_operation = 'SavePolicyDetails' THEN sal.created_at END) as policy_saved_at,
    sal.terracotta_policy_id
FROM soap_audit_log sal
WHERE sal.terracotta_quote_id IS NOT NULL
GROUP BY sal.terracotta_quote_id, sal.quote_id, sal.terracotta_policy_id
ORDER BY MAX(sal.created_at) DESC;

-- View: Terracotta Policy ID Tracking
-- Shows all Terracotta Policy IDs with their associated quotes
CREATE OR REPLACE VIEW terracotta_policy_tracking AS
SELECT 
    sal.terracotta_policy_id,
    sal.terracotta_quote_id,
    sal.quote_id as local_quote_id,
    q.policy_number as local_policy_number,
    sal.created_at as policy_created_at,
    sal.status as save_status,
    sal.error_message,
    q.total_amount,
    q.status as quote_status
FROM soap_audit_log sal
LEFT JOIN quotes q ON sal.quote_id = q.id
WHERE sal.terracotta_policy_id IS NOT NULL
  AND sal.soap_operation = 'SavePolicyDetails'
ORDER BY sal.created_at DESC;

-- View: Quote ID Mapping
-- Shows the relationship between local quote IDs and Terracotta IDs
CREATE OR REPLACE VIEW quote_id_mapping AS
SELECT 
    q.id as local_quote_id,
    q.policy_number as local_policy_number,
    q.selected_plan->'plan'->>'terracottaQuoteId' as terracotta_quote_id_from_json,
    sal.terracotta_quote_id as terracotta_quote_id_from_soap,
    sal.terracotta_policy_id as terracotta_policy_id,
    q.status as quote_status,
    q.total_amount,
    q.created_at as quote_created,
    sal.created_at as soap_logged
FROM quotes q
LEFT JOIN LATERAL (
    SELECT DISTINCT ON (terracotta_quote_id)
        terracotta_quote_id,
        terracotta_policy_id,
        created_at
    FROM soap_audit_log
    WHERE quote_id = q.id
    ORDER BY terracotta_quote_id, created_at DESC
) sal ON TRUE
ORDER BY q.id DESC;

-- View: SOAP Operation Summary with IDs
-- Enhanced version showing Terracotta IDs
CREATE OR REPLACE VIEW soap_operation_summary_with_ids AS
SELECT 
    soap_operation,
    COUNT(*) as total_operations,
    COUNT(CASE WHEN status = 'success' THEN 1 END) as successful,
    COUNT(CASE WHEN status IN ('failed', 'error') THEN 1 END) as failed,
    COUNT(DISTINCT terracotta_quote_id) as unique_quote_ids,
    COUNT(DISTINCT terracotta_policy_id) as unique_policy_ids,
    COUNT(DISTINCT quote_id) as unique_local_quotes,
    AVG(response_time_ms) as avg_response_time,
    MAX(created_at) as last_operation
FROM soap_audit_log
GROUP BY soap_operation
ORDER BY total_operations DESC;

-- Function: Get all Terracotta IDs for a local quote
CREATE OR REPLACE FUNCTION get_terracotta_ids_for_quote(p_quote_id INTEGER)
RETURNS TABLE (
    terracotta_quote_id VARCHAR(100),
    terracotta_policy_id VARCHAR(100),
    soap_operation VARCHAR(100),
    status VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sal.terracotta_quote_id,
        sal.terracotta_policy_id,
        sal.soap_operation,
        sal.status,
        sal.created_at
    FROM soap_audit_log sal
    WHERE sal.quote_id = p_quote_id
       OR sal.terracotta_quote_id IN (
           SELECT q.selected_plan->'plan'->>'terracottaQuoteId'
           FROM quotes q
           WHERE q.id = p_quote_id
       )
    ORDER BY sal.created_at ASC;
END;
$$ LANGUAGE plpgsql;

-- Function: Find quote by Terracotta Quote ID
CREATE OR REPLACE FUNCTION find_quote_by_terracotta_id(p_terracotta_quote_id VARCHAR(100))
RETURNS TABLE (
    local_quote_id INTEGER,
    policy_number VARCHAR(100),
    status VARCHAR(50),
    total_amount DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE,
    soap_operations TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        q.id as local_quote_id,
        q.policy_number,
        q.status,
        q.total_amount,
        q.created_at,
        STRING_AGG(DISTINCT sal.soap_operation, ', ') as soap_operations
    FROM quotes q
    LEFT JOIN soap_audit_log sal ON sal.quote_id = q.id
    WHERE q.selected_plan->'plan'->>'terracottaQuoteId' = p_terracotta_quote_id
       OR sal.terracotta_quote_id = p_terracotta_quote_id
    GROUP BY q.id, q.policy_number, q.status, q.total_amount, q.created_at;
END;
$$ LANGUAGE plpgsql;

-- Sample Queries (commented out - uncomment to use)

-- Get all Terracotta Quote IDs
-- SELECT * FROM terracotta_quote_tracking;

-- Get all Terracotta Policy IDs
-- SELECT * FROM terracotta_policy_tracking;

-- See the mapping between local and Terracotta IDs
-- SELECT * FROM quote_id_mapping;

-- Get Terracotta IDs for a specific quote
-- SELECT * FROM get_terracotta_ids_for_quote(120);

-- Find quote by Terracotta Quote ID
-- SELECT * FROM find_quote_by_terracotta_id('8546669');

-- Check which quotes have Terracotta Quote IDs but no Policy IDs yet
-- SELECT * FROM quote_id_mapping WHERE terracotta_quote_id_from_soap IS NOT NULL AND terracotta_policy_id IS NULL;

-- Get all SOAP operations with their Terracotta IDs
-- SELECT 
--     id, 
--     soap_operation, 
--     terracotta_quote_id, 
--     terracotta_policy_id, 
--     status, 
--     created_at 
-- FROM soap_audit_log 
-- WHERE terracotta_quote_id IS NOT NULL OR terracotta_policy_id IS NOT NULL
-- ORDER BY created_at DESC;

COMMENT ON VIEW terracotta_quote_tracking IS 'Tracks all unique Terracotta Quote IDs with their SOAP operations';
COMMENT ON VIEW terracotta_policy_tracking IS 'Tracks all Terracotta Policy IDs created via SavePolicyDetails';
COMMENT ON VIEW quote_id_mapping IS 'Maps local quote IDs to Terracotta Quote and Policy IDs';
COMMENT ON VIEW soap_operation_summary_with_ids IS 'SOAP operation summary including unique Terracotta ID counts';

SELECT 'Terracotta ID tracking views created successfully!' as status;

