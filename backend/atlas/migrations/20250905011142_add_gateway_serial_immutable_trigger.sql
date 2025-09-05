-- Create a function that prevents serial_number updates
CREATE OR REPLACE FUNCTION preserve_gateway_serial_number()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if serial_number is being changed
    IF OLD.serial_number != NEW.serial_number THEN
        RAISE EXCEPTION 'serial_number is immutable and cannot be updated. Current value: %, Attempted value: %', 
                       OLD.serial_number, NEW.serial_number;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if it exists, then create it
DROP TRIGGER IF EXISTS gateway_preserve_serial_trigger ON "Gateway";
CREATE TRIGGER gateway_preserve_serial_trigger
    BEFORE UPDATE ON "Gateway"
    FOR EACH ROW
    EXECUTE FUNCTION preserve_gateway_serial_number();
