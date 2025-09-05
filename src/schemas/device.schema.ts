import { z } from 'zod';
import type { DeviceTypeDTO } from './deviceType.schema.js';
// Zod schema for device validation
export const PeripheralDeviceSchema = z.object({
  id: z.string().uuid(),
  uid: z.string().regex(/^\d{1,19}$/, "UID must be a valid number (up to 19 digits)"),
  vendor: z.string().min(1, "Vendor is required"),
  status: z.enum(['ONLINE', 'OFFLINE', 'MAINTENANCE']),
  created_at: z.date(),
  last_seen_at: z.date().optional(),
  gateway_id: z.string().uuid().optional(),
  device_type_id: z.number().int().positive(),
});

// Create Device DTO schema
export const CreatePeripheralDeviceSchema = PeripheralDeviceSchema.pick({
  uid: true,
  vendor: true,
  status: true,
  device_type_id: true,
  gateway_id: true,
});

// Update Device DTO schema
export const UpdatePeripheralDeviceSchema = PeripheralDeviceSchema.pick({
  vendor: true,
  status: true,
  last_seen_at: true,
  device_type_id: true,
}).partial();


// Infer types from schemas
export type PeripheralDeviceDTO = z.infer<typeof PeripheralDeviceSchema> & {
  device_type?: DeviceTypeDTO;
  gateway?: any; // Will be properly typed when gateway.dto is imported
};

export type CreatePeripheralDeviceDTO = z.infer<typeof CreatePeripheralDeviceSchema>;
export type UpdatePeripheralDeviceDTO = z.infer<typeof UpdatePeripheralDeviceSchema>;

