import { z } from 'zod';
import type { GatewayDTO } from './gateway.schema.js';
// Zod schema for tenant validation
export const TenantSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Tenant name is required").max(100, "Name too long"),
  contact_email: z.string().email("Invalid email format"),
  created_at: z.date(),
});

// Create Tenant DTO schema
export const CreateTenantSchema = TenantSchema.pick({
  name: true,
  contact_email: true,
}).strict();

// Update Tenant DTO schema
export const UpdateTenantSchema = TenantSchema.pick({
  name: true,
  contact_email: true,
}).partial().strict();

// Infer types from schemas
export type TenantDTO = z.infer<typeof TenantSchema> & {
  gateways?: GatewayDTO[];
};

export type CreateTenantDTO = z.infer<typeof CreateTenantSchema>;
export type UpdateTenantDTO = z.infer<typeof UpdateTenantSchema>;
