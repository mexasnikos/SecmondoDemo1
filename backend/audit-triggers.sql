-- Audit triggers for travel_insurance database
-- This creates automatic audit logging for important tables

-- Function to handle audit logging
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (
            table_name, 
            record_id, 
            action, 
            old_values, 
            new_values,
            user_id,
            user_ip,
            created_at
        ) VALUES (
            TG_TABLE_NAME, 
            OLD.id, 
            TG_OP, 
            row_to_json(OLD), 
            NULL,
            CURRENT_USER,
            inet_client_addr(),
            NOW()
        );
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (
            table_name, 
            record_id, 
            action, 
            old_values, 
            new_values,
            user_id,
            user_ip,
            created_at
        ) VALUES (
            TG_TABLE_NAME, 
            NEW.id, 
            TG_OP, 
            row_to_json(OLD), 
            row_to_json(NEW),
            CURRENT_USER,
            inet_client_addr(),
            NOW()
        );
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (
            table_name, 
            record_id, 
            action, 
            old_values, 
            new_values,
            user_id,
            user_ip,
            created_at
        ) VALUES (
            TG_TABLE_NAME, 
            NEW.id, 
            TG_OP, 
            NULL, 
            row_to_json(NEW),
            CURRENT_USER,
            inet_client_addr(),
            NOW()
        );
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create audit triggers for important tables

-- Quotes table audit trigger
DROP TRIGGER IF EXISTS quotes_audit_trigger ON quotes;
CREATE TRIGGER quotes_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON quotes
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Payments table audit trigger
DROP TRIGGER IF EXISTS payments_audit_trigger ON payments;
CREATE TRIGGER payments_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON payments
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Travelers table audit trigger
DROP TRIGGER IF EXISTS travelers_audit_trigger ON travelers;
CREATE TRIGGER travelers_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON travelers
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Contact messages audit trigger
DROP TRIGGER IF EXISTS contact_messages_audit_trigger ON contact_messages;
CREATE TRIGGER contact_messages_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON contact_messages
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Additional policies audit trigger
DROP TRIGGER IF EXISTS additional_policies_audit_trigger ON additional_policies;
CREATE TRIGGER additional_policies_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON additional_policies
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Test the audit system by updating a quote
-- This will create an audit log entry
