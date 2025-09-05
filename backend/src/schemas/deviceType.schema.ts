import { z } from 'zod';
import type { PeripheralDeviceDTO } from './device.schema.js';
// Zod schema for device type validation
export const DeviceTypeSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1, "Device type name is required").max(50, "Name too long"),
  description: z.string().min(1, "Description is required").max(255, "Description too long"),
});

// Create Device Type DTO schema
export const CreateDeviceTypeSchema = DeviceTypeSchema.pick({
  name: true,
  description: true,
});

// Update Device Type DTO schema
export const UpdateDeviceTypeSchema = DeviceTypeSchema.pick({
  name: true,
  description: true,
}).partial();

// Infer types from schemas
export type DeviceTypeDTO = z.infer<typeof DeviceTypeSchema> & {
  devices?: PeripheralDeviceDTO[];
};

export type CreateDeviceTypeDTO = z.infer<typeof CreateDeviceTypeSchema>;
export type UpdateDeviceTypeDTO = z.infer<typeof UpdateDeviceTypeSchema>;
