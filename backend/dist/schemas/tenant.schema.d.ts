import { z } from 'zod';
import type { GatewayDTO } from './gateway.schema.js';
export declare const TenantSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    contact_email: z.ZodString;
    created_at: z.ZodDate;
}, z.core.$strip>;
export declare const CreateTenantSchema: z.ZodObject<{
    name: z.ZodString;
    contact_email: z.ZodString;
}, z.core.$strip>;
export declare const UpdateTenantSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    contact_email: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type TenantDTO = z.infer<typeof TenantSchema> & {
    gateways?: GatewayDTO[];
};
export type CreateTenantDTO = z.infer<typeof CreateTenantSchema>;
export type UpdateTenantDTO = z.infer<typeof UpdateTenantSchema>;
//# sourceMappingURL=tenant.schema.d.ts.map