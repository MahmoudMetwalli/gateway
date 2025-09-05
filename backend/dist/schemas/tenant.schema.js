import { z } from 'zod';
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
});
// Update Tenant DTO schema
export const UpdateTenantSchema = TenantSchema.pick({
    name: true,
    contact_email: true,
}).partial();
//# sourceMappingURL=tenant.schema.js.map