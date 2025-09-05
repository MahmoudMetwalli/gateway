-- Create a function that limits devices per gateway to 10
CREATE OR REPLACE FUNCTION check_gateway_device_limit()
RETURNS TRIGGER AS $$
DECLARE
    device_count INTEGER;
BEGIN
    -- Count existing devices for this gateway
    SELECT COUNT(*) INTO device_count
    FROM "PeripheralDevice"
    WHERE gateway_id = NEW.gateway_id;
    
    -- Check if limit would be exceeded
    IF device_count >= 10 THEN
        RAISE EXCEPTION 'Gateway device limit exceeded. Maximum 10 devices allowed per gateway. Current count: %', device_count
            USING ERRCODE = '23514'; -- check_violation error code
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if it exists, then create it
DROP TRIGGER IF EXISTS gateway_device_limit_trigger ON "PeripheralDevice";
CREATE TRIGGER gateway_device_limit_trigger
    BEFORE INSERT ON "PeripheralDevice"
    FOR EACH ROW
    EXECUTE FUNCTION check_gateway_device_limit();
