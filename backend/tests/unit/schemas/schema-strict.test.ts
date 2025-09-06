import { CreateGatewaySchema, UpdateGatewaySchema } from '../../../src/schemas/gateway.schema';
import { CreateTenantSchema, UpdateTenantSchema } from '../../../src/schemas/tenant.schema';
import { CreatePeripheralDeviceSchema, UpdatePeripheralDeviceSchema } from '../../../src/schemas/device.schema';
import { CreateDeviceTypeSchema, UpdateDeviceTypeSchema } from '../../../src/schemas/deviceType.schema';

describe('Schema Strict Mode - Extra Fields Prevention', () => {
  
  describe('Gateway Schema', () => {
    it('should reject extra fields in CreateGatewaySchema', () => {
      const validData = {
        serial_number: "GW001",
        name: "Test Gateway",
        ipv4_address: "192.168.1.100",
        status: "ACTIVE" as const,
        location: "Office",
        tenant_id: "550e8400-e29b-41d4-a716-446655440000"
      };

      const dataWithExtraField = {
        ...validData,
        extra_field: "should be rejected",
        malicious_field: { script: "alert('xss')" }
      };

      // Valid data should pass
      expect(() => CreateGatewaySchema.parse(validData)).not.toThrow();

      // Data with extra fields should be rejected
      expect(() => CreateGatewaySchema.parse(dataWithExtraField)).toThrow();
    });

    it('should reject extra fields in UpdateGatewaySchema', () => {
      const validData = {
        name: "Updated Gateway",
        ipv4_address: "192.168.1.101",
        status: "INACTIVE" as const,
        location: "New Office"
      };

      const dataWithExtraField = {
        ...validData,
        unauthorized_field: "should be rejected"
      };

      // Valid data should pass
      expect(() => UpdateGatewaySchema.parse(validData)).not.toThrow();

      // Data with extra fields should be rejected
      expect(() => UpdateGatewaySchema.parse(dataWithExtraField)).toThrow();
    });
  });

  describe('Tenant Schema', () => {
    it('should reject extra fields in CreateTenantSchema', () => {
      const validData = {
        name: "Test Tenant",
        contact_email: "test@example.com"
      };

      const dataWithExtraField = {
        ...validData,
        admin_access: true,
        secret_key: "malicious_data"
      };

      // Valid data should pass
      expect(() => CreateTenantSchema.parse(validData)).not.toThrow();

      // Data with extra fields should be rejected
      expect(() => CreateTenantSchema.parse(dataWithExtraField)).toThrow();
    });

    it('should reject extra fields in UpdateTenantSchema', () => {
      const validData = {
        name: "Updated Tenant"
      };

      const dataWithExtraField = {
        ...validData,
        role: "admin",
        permissions: ["read", "write", "delete"]
      };

      // Valid data should pass
      expect(() => UpdateTenantSchema.parse(validData)).not.toThrow();

      // Data with extra fields should be rejected
      expect(() => UpdateTenantSchema.parse(dataWithExtraField)).toThrow();
    });
  });

  describe('Device Schema', () => {
    it('should reject extra fields in CreatePeripheralDeviceSchema', () => {
      const validData = {
        uid: "123456789",
        vendor: "Test Vendor",
        status: "ONLINE" as const,
        device_type_id: 1,
        gateway_id: "550e8400-e29b-41d4-a716-446655440000"
      };

      const dataWithExtraField = {
        ...validData,
        firmware_version: "1.0.0",
        custom_config: { setting: "value" }
      };

      // Valid data should pass
      expect(() => CreatePeripheralDeviceSchema.parse(validData)).not.toThrow();

      // Data with extra fields should be rejected
      expect(() => CreatePeripheralDeviceSchema.parse(dataWithExtraField)).toThrow();
    });

    it('should reject extra fields in UpdatePeripheralDeviceSchema', () => {
      const validData = {
        vendor: "Updated Vendor",
        status: "MAINTENANCE" as const
      };

      const dataWithExtraField = {
        ...validData,
        backdoor: "malicious_code",
        elevation: "root"
      };

      // Valid data should pass
      expect(() => UpdatePeripheralDeviceSchema.parse(validData)).not.toThrow();

      // Data with extra fields should be rejected
      expect(() => UpdatePeripheralDeviceSchema.parse(dataWithExtraField)).toThrow();
    });
  });

  describe('DeviceType Schema', () => {
    it('should reject extra fields in CreateDeviceTypeSchema', () => {
      const validData = {
        name: "Temperature Sensor",
        description: "Measures temperature"
      };

      const dataWithExtraField = {
        ...validData,
        pricing: 99.99,
        manufacturer: "ACME Corp"
      };

      // Valid data should pass
      expect(() => CreateDeviceTypeSchema.parse(validData)).not.toThrow();

      // Data with extra fields should be rejected
      expect(() => CreateDeviceTypeSchema.parse(dataWithExtraField)).toThrow();
    });

    it('should reject extra fields in UpdateDeviceTypeSchema', () => {
      const validData = {
        description: "Updated description"
      };

      const dataWithExtraField = {
        ...validData,
        internal_code: "SECRET_123",
        access_level: 5
      };

      // Valid data should pass
      expect(() => UpdateDeviceTypeSchema.parse(validData)).not.toThrow();

      // Data with extra fields should be rejected
      expect(() => UpdateDeviceTypeSchema.parse(dataWithExtraField)).toThrow();
    });
  });

  describe('Error Messages', () => {
    it('should provide clear error messages for unrecognized keys', () => {
      const dataWithExtraField = {
        serial_number: "GW001",
        name: "Test Gateway",
        ipv4_address: "192.168.1.100",
        status: "ACTIVE" as const,
        location: "Office",
        tenant_id: "550e8400-e29b-41d4-a716-446655440000",
        malicious_field: "attack_vector"
      };

      try {
        CreateGatewaySchema.parse(dataWithExtraField);
        fail('Expected validation to throw an error');
      } catch (error: any) {
        expect(error.issues).toBeDefined();
        expect(error.issues.some((issue: any) => 
          issue.code === 'unrecognized_keys' && 
          issue.keys.includes('malicious_field')
        )).toBe(true);
      }
    });
  });
});
