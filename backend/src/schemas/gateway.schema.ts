import { z } from 'zod';
import type { PeripheralDeviceDTO } from './device.schema.js';
import type { TenantDTO } from './tenant.schema.js';

// Zod schema for validation
export const GatewaySchema = z.object({
  id: z.uuid(),
  serial_number: z.string().min(1, "Serial number is required"),
  name: z.string().min(1, "Name is required"),
  ipv4_address: z.string().regex(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, "Invalid IPv4 address"),
  status: z.enum(['ACTIVE', 'INACTIVE', 'DECOMMISSIONED']),
  location: z.string().optional(),
  created_at: z.date(),
  updated_at: z.date(),
  tenant_id: z.uuid(),
});

// Create Gateway DTO schema
export const CreateGatewaySchema = GatewaySchema.pick({
  serial_number: true,
  name: true,
  ipv4_address: true,
  status: true,
  location: true,
  tenant_id: true,
}).strict();

export const UpdateGatewaySchema = GatewaySchema.pick({
  name: true,
  ipv4_address: true,
  status: true,
  location: true,
}).partial().strict();

// Infer types from schemas
export type GatewayDTO = z.infer<typeof GatewaySchema> & {
  devices?: PeripheralDeviceDTO[];
  tenant?: TenantDTO;
};

export type CreateGatewayDTO = z.infer<typeof CreateGatewaySchema>;
export type UpdateGatewayDTO = z.infer<typeof UpdateGatewaySchema>;
