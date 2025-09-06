-- Migration: seed_test_data
-- Created: 2025-09-06
-- Description: Seeds test data for tenants, gateways, device types, and devices

-- Insert test tenants
INSERT INTO "Tenant" (id, name, contact_email, created_at) VALUES 
  ('a1b2c3d4-e5f6-7890-abcd-123456789abc', 'Acme Corporation', 'admin@acme.com', NOW()),
  ('b2c3d4e5-f6a7-8901-bcde-234567890def', 'TechStart Inc', 'contact@techstart.com', NOW()),
  ('c3d4e5f6-a7b8-9012-cdef-345678901fed', 'Global Systems', 'info@globalsys.com', NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert device types
INSERT INTO "DeviceType" (id, name, description) VALUES 
  (1, 'Temperature Sensor', 'Digital temperature monitoring device'),
  (2, 'Humidity Sensor', 'Environmental humidity measurement device'),
  (3, 'Motion Detector', 'PIR motion detection sensor'),
  (4, 'Door Sensor', 'Magnetic door/window contact sensor'),
  (5, 'Smart Camera', 'IP-based surveillance camera'),
  (6, 'Pressure Sensor', 'Industrial pressure monitoring device'),
  (7, 'Light Sensor', 'Ambient light level detector'),
  (8, 'Smoke Detector', 'Fire safety smoke detection device')
ON CONFLICT (id) DO NOTHING;

-- Insert test gateways
INSERT INTO "Gateway" (id, serial_number, name, ipv4_address, status, location, tenant_id, created_at, updated_at) VALUES 
  ('f1e2d3c4-b5a6-7890-cdef-111111111111', 'GW-ACME-001', 'Main Building Gateway', '192.168.1.100', 'ACTIVE', 'Building A - Floor 1', 'a1b2c3d4-e5f6-7890-abcd-123456789abc', NOW(), NOW()),
  ('f2e3d4c5-b6a7-8901-def0-222222222222', 'GW-ACME-002', 'Warehouse Gateway', '192.168.1.101', 'ACTIVE', 'Warehouse Complex', 'a1b2c3d4-e5f6-7890-abcd-123456789abc', NOW(), NOW()),
  ('f3e4d5c6-b7a8-9012-ef01-333333333333', 'GW-TECH-001', 'Office Gateway', '192.168.2.100', 'ACTIVE', 'TechStart HQ', 'b2c3d4e5-f6a7-8901-bcde-234567890def', NOW(), NOW()),
  ('f4e5d6c7-b8a9-0123-f012-444444444444', 'GW-TECH-002', 'Lab Gateway', '192.168.2.101', 'INACTIVE', 'Research Lab', 'b2c3d4e5-f6a7-8901-bcde-234567890def', NOW(), NOW()),
  ('f5e6d7c8-b9a0-1234-0123-555555555555', 'GW-GLOBAL-001', 'Data Center Gateway', '192.168.3.100', 'ACTIVE', 'Primary Data Center', 'c3d4e5f6-a7b8-9012-cdef-345678901fed', NOW(), NOW())
ON CONFLICT (serial_number) DO NOTHING;

-- Insert test peripheral devices
INSERT INTO "PeripheralDevice" (id, uid, vendor, status, device_type_id, gateway_id, created_at, last_seen) VALUES 
  -- Devices for GW-ACME-001
  ('d1e2f3a4-b5c6-7890-abcd-111111111111', 1001, 'Sensirion', 'ONLINE', 1, 'f1e2d3c4-b5a6-7890-cdef-111111111111', NOW(), NOW()),
  ('d2e3f4a5-b6c7-8901-bcde-222222222222', 1002, 'Sensirion', 'ONLINE', 2, 'f1e2d3c4-b5a6-7890-cdef-111111111111', NOW(), NOW()),
  ('d3e4f5a6-b7c8-9012-cdef-333333333333', 1003, 'Bosch', 'ONLINE', 3, 'f1e2d3c4-b5a6-7890-cdef-111111111111', NOW(), NOW() - INTERVAL '5 minutes'),
  ('d4e5f6a7-b8c9-0123-def0-444444444444', 1004, 'Honeywell', 'OFFLINE', 4, 'f1e2d3c4-b5a6-7890-cdef-111111111111', NOW(), NOW() - INTERVAL '2 hours'),
  
  -- Devices for GW-ACME-002
  ('d5e6f7a8-b9c0-1234-ef01-555555555555', 1005, 'Axis', 'ONLINE', 5, 'f2e3d4c5-b6a7-8901-def0-222222222222', NOW(), NOW()),
  ('d6e7f8a9-b0c1-2345-f012-666666666666', 1006, 'Endress+Hauser', 'ONLINE', 6, 'f2e3d4c5-b6a7-8901-def0-222222222222', NOW(), NOW()),
  ('d7e8f9a0-b1c2-3456-0123-777777777777', 1007, 'OSRAM', 'MAINTENANCE', 7, 'f2e3d4c5-b6a7-8901-def0-222222222222', NOW(), NOW() - INTERVAL '30 minutes'),
  
  -- Devices for GW-TECH-001
  ('d8e9f0a1-b2c3-4567-1234-888888888888', 1008, 'Nest', 'ONLINE', 8, 'f3e4d5c6-b7a8-9012-ef01-333333333333', NOW(), NOW()),
  ('d9e0f1a2-b3c4-5678-2345-999999999999', 1009, 'Sensirion', 'ONLINE', 1, 'f3e4d5c6-b7a8-9012-ef01-333333333333', NOW(), NOW()),
  ('d0e1f2a3-b4c5-6789-3456-aaaaaaaaaaaa', 1010, 'Bosch', 'OFFLINE', 3, 'f3e4d5c6-b7a8-9012-ef01-333333333333', NOW(), NOW() - INTERVAL '1 hour'),
  
  -- Devices for GW-GLOBAL-001
  ('e1e2f3a4-b5c6-7890-4567-bbbbbbbbbbbb', 1011, 'Axis', 'ONLINE', 5, 'f5e6d7c8-b9a0-1234-0123-555555555555', NOW(), NOW()),
  ('e2e3f4a5-b6c7-8901-5678-cccccccccccc', 1012, 'Endress+Hauser', 'ONLINE', 6, 'f5e6d7c8-b9a0-1234-0123-555555555555', NOW(), NOW()),
  ('e3e4f5a6-b7c8-9012-6789-dddddddddddd', 1013, 'OSRAM', 'ONLINE', 7, 'f5e6d7c8-b9a0-1234-0123-555555555555', NOW(), NOW()),
  ('e4e5f6a7-b8c9-0123-7890-eeeeeeeeeeee', 1014, 'Honeywell', 'MAINTENANCE', 4, 'f5e6d7c8-b9a0-1234-0123-555555555555', NOW(), NOW() - INTERVAL '15 minutes'),
  
  -- Some unassigned devices (no gateway_id)
  ('e5e6f7a8-b9c0-1234-8901-ffffffffffff', 1015, 'Sensirion', 'OFFLINE', 1, NULL, NOW(), NOW() - INTERVAL '3 days'),
  ('e6e7f8a9-b0c1-2345-9012-101010101010', 1016, 'Bosch', 'OFFLINE', 2, NULL, NOW(), NOW() - INTERVAL '1 week'),
  ('e7e8f9a0-b1c2-3456-0123-121212121212', 1017, 'Honeywell', 'OFFLINE', 4, NULL, NOW(), NOW() - INTERVAL '2 days')
ON CONFLICT (uid) DO NOTHING;

-- Insert some gateway logs for testing
INSERT INTO "GatewayLog" (id, gateway_id, action, details, created_at) VALUES 
  ('11112222-3333-4444-5555-666666666666', 'f1e2d3c4-b5a6-7890-cdef-111111111111', 'DEVICE_CONNECTED', '{"device_uid": 1001, "device_type": "Temperature Sensor"}', NOW() - INTERVAL '2 hours'),
  ('22223333-4444-5555-6666-777777777777', 'f1e2d3c4-b5a6-7890-cdef-111111111111', 'STATUS_CHANGE', '{"from": "INACTIVE", "to": "ACTIVE"}', NOW() - INTERVAL '6 hours'),
  ('33334444-5555-6666-7777-888888888888', 'f2e3d4c5-b6a7-8901-def0-222222222222', 'DEVICE_DISCONNECTED', '{"device_uid": 1007, "reason": "maintenance"}', NOW() - INTERVAL '30 minutes'),
  ('44445555-6666-7777-8888-999999999999', 'f3e4d5c6-b7a8-9012-ef01-333333333333', 'GATEWAY_RESTART', '{"uptime_before": "72h15m", "reason": "scheduled_maintenance"}', NOW() - INTERVAL '1 hour'),
  ('55556666-7777-8888-9999-aaaaaaaaaaaa', 'f5e6d7c8-b9a0-1234-0123-555555555555', 'DEVICE_CONNECTED', '{"device_uid": 1014, "device_type": "Door Sensor"}', NOW() - INTERVAL '15 minutes')
ON CONFLICT (id) DO NOTHING;
