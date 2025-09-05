import swaggerJSDoc from 'swagger-jsdoc';
import type { SwaggerDefinition } from 'swagger-jsdoc';
import path from 'path';

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Gateway Management API',
    version: '1.0.0',
    description: 'API for managing IoT gateways, devices, and tenants',
    contact: {
      name: 'Mahmoud Metwalli',
      email: 'mahmoud@example.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  components: {
    schemas: {
      Tenant: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'Unique identifier for the tenant',
          },
          name: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
            description: 'Name of the tenant',
          },
          contact_email: {
            type: 'string',
            format: 'email',
            description: 'Contact email address',
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            description: 'Timestamp when the tenant was created',
          },
          gateways: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Gateway'
            },
            description: 'Gateways owned by this tenant'
          }
        },
        required: ['id', 'name', 'contact_email', 'created_at'],
      },
      Gateway: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'Unique identifier for the gateway',
          },
          serial_number: {
            type: 'string',
            minLength: 1,
            description: 'Serial number of the gateway',
          },
          name: {
            type: 'string',
            minLength: 1,
            description: 'Name of the gateway',
          },
          ipv4_address: {
            type: 'string',
            pattern: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
            description: 'IPv4 address of the gateway',
          },
          location: {
            type: 'string',
            description: 'Physical location of the gateway',
          },
          status: {
            type: 'string',
            enum: ['ACTIVE', 'INACTIVE', 'DECOMMISSIONED'],
            description: 'Current status of the gateway',
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            description: 'Timestamp when the gateway was created',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            description: 'Timestamp when the gateway was last updated',
          },
          tenant_id: {
            type: 'string',
            format: 'uuid',
            description: 'ID of the tenant that owns this gateway',
          },
          devices: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/PeripheralDevice'
            },
            description: 'Devices connected to this gateway'
          },
          tenant: {
            $ref: '#/components/schemas/Tenant',
            description: 'Tenant that owns this gateway'
          }
        },
        required: ['id', 'serial_number', 'name', 'ipv4_address', 'status', 'created_at', 'updated_at', 'tenant_id'],
      },
      PeripheralDevice: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'Unique identifier for the device',
          },
          uid: {
            type: 'string',
            pattern: '^\\d{1,19}$',
            description: 'UID must be a valid number (up to 19 digits)',
          },
          vendor: {
            type: 'string',
            minLength: 1,
            description: 'Device vendor/manufacturer',
          },
          status: {
            type: 'string',
            enum: ['ONLINE', 'OFFLINE', 'MAINTENANCE'],
            description: 'Current status of the device',
          },
          device_type_id: {
            type: 'integer',
            minimum: 1,
            description: 'ID of the device type',
          },
          gateway_id: {
            type: 'string',
            format: 'uuid',
            description: 'ID of the gateway this device is connected to',
            nullable: true,
          },
          last_seen_at: {
            type: 'string',
            format: 'date-time',
            description: 'Timestamp when the device was last seen',
            nullable: true,
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            description: 'Timestamp when the device was created',
          },
          device_type: {
            $ref: '#/components/schemas/DeviceType',
            description: 'Type of this device'
          },
          gateway: {
            $ref: '#/components/schemas/Gateway',
            description: 'Gateway this device is connected to'
          }
        },
        required: ['id', 'uid', 'vendor', 'status', 'device_type_id', 'created_at'],
      },
      DeviceType: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            minimum: 1,
            description: 'Unique identifier for the device type',
          },
          name: {
            type: 'string',
            minLength: 1,
            maxLength: 50,
            description: 'Name of the device type',
          },
          description: {
            type: 'string',
            minLength: 1,
            maxLength: 255,
            description: 'Description of the device type',
          },
          devices: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/PeripheralDevice'
            },
            description: 'Devices of this type'
          }
        },
        required: ['id', 'name', 'description'],
      },
      CreateTenantRequest: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
            description: 'Name of the tenant',
          },
          contact_email: {
            type: 'string',
            format: 'email',
            description: 'Contact email address',
          },
        },
        required: ['name', 'contact_email'],
      },
      UpdateTenantRequest: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
            description: 'Name of the tenant',
          },
          contact_email: {
            type: 'string',
            format: 'email',
            description: 'Contact email address',
          },
        },
      },
      CreateGatewayRequest: {
        type: 'object',
        properties: {
          serial_number: {
            type: 'string',
            minLength: 1,
            description: 'Serial number of the gateway',
          },
          name: {
            type: 'string',
            minLength: 1,
            description: 'Name of the gateway',
          },
          ipv4_address: {
            type: 'string',
            pattern: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
            description: 'IPv4 address of the gateway',
          },
          status: {
            type: 'string',
            enum: ['ACTIVE', 'INACTIVE', 'DECOMMISSIONED'],
            description: 'Current status of the gateway',
          },
          location: {
            type: 'string',
            description: 'Physical location of the gateway',
          },
          tenant_id: {
            type: 'string',
            format: 'uuid',
            description: 'ID of the tenant that owns this gateway',
          },
        },
        required: ['serial_number', 'name', 'ipv4_address', 'status', 'tenant_id'],
      },
      UpdateGatewayRequest: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            minLength: 1,
            description: 'Name of the gateway',
          },
          ipv4_address: {
            type: 'string',
            pattern: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
            description: 'IPv4 address of the gateway',
          },
          status: {
            type: 'string',
            enum: ['ACTIVE', 'INACTIVE', 'DECOMMISSIONED'],
            description: 'Current status of the gateway',
          },
          location: {
            type: 'string',
            description: 'Physical location of the gateway',
          },
        },
      },
      CreatePeripheralDeviceRequest: {
        type: 'object',
        properties: {
          uid: {
            type: 'string',
            pattern: '^\d{1,19}$',
            description: 'UID must be a valid number (up to 19 digits)',
          },
          vendor: {
            type: 'string',
            minLength: 1,
            description: 'Device vendor/manufacturer',
          },
          status: {
            type: 'string',
            enum: ['ONLINE', 'OFFLINE', 'MAINTENANCE'],
            description: 'Current status of the device',
          },
          device_type_id: {
            type: 'integer',
            minimum: 1,
            description: 'ID of the device type',
          },
          gateway_id: {
            type: 'string',
            format: 'uuid',
            description: 'ID of the gateway this device is connected to',
            nullable: true,
          },
        },
        required: ['uid', 'vendor', 'status', 'device_type_id'],
      },
      UpdatePeripheralDeviceRequest: {
        type: 'object',
        properties: {
          vendor: {
            type: 'string',
            minLength: 1,
            description: 'Device vendor/manufacturer',
          },
          status: {
            type: 'string',
            enum: ['ONLINE', 'OFFLINE', 'MAINTENANCE'],
            description: 'Current status of the device',
          },
          last_seen_at: {
            type: 'string',
            format: 'date-time',
            description: 'Timestamp when the device was last seen',
          },
          device_type_id: {
            type: 'integer',
            minimum: 1,
            description: 'ID of the device type',
          },
        },
      },
      CreateDeviceTypeRequest: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            minLength: 1,
            maxLength: 50,
            description: 'Name of the device type',
          },
          description: {
            type: 'string',
            minLength: 1,
            maxLength: 255,
            description: 'Description of the device type',
          },
        },
        required: ['name', 'description'],
      },
      UpdateDeviceTypeRequest: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            minLength: 1,
            maxLength: 50,
            description: 'Name of the device type',
          },
          description: {
            type: 'string',
            minLength: 1,
            maxLength: 255,
            description: 'Description of the device type',
          },
        },
      },
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            description: 'Error message',
          },
          details: {
            type: 'string',
            description: 'Additional error details',
          },
        },
        required: ['error'],
      },
    },
  },
};

const options = {
  definition: swaggerDefinition,
  apis: [
    './src/routers/*.ts',
    './src/controllers/*.ts',
  ], // paths to files containing OpenAPI definitions
};

export const swaggerSpec = swaggerJSDoc(options);
