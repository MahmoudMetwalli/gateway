import { z } from 'zod';
// Zod schema for validation
export const GatewaySchema = z.object({
    id: z.string().uuid(),
    serial_number: z.string().min(1, "Serial number is required"),
    name: z.string().min(1, "Name is required"),
    ipv4_address: z.string().regex(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, "Invalid IPv4 address"),
    status: z.enum(['ACTIVE', 'INACTIVE', 'DECOMMISSIONED']),
    location: z.string().optional(),
    created_at: z.date(),
    updated_at: z.date(),
    tenant_id: z.string().uuid(),
});
// Create Gateway DTO schema
export const CreateGatewaySchema = GatewaySchema.pick({
    serial_number: true,
    name: true,
    ipv4_address: true,
    status: true,
    location: true,
    tenant_id: true,
});
export const UpdateGatewaySchema = GatewaySchema.pick({
    name: true,
    ipv4_address: true,
    status: true,
    location: true,
}).partial();
//# sourceMappingURL=gateway.schema.js.map