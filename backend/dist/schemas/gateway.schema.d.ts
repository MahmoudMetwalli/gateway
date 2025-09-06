import { z } from 'zod';
import type { PeripheralDeviceDTO } from './device.schema.js';
import type { TenantDTO } from './tenant.schema.js';
export declare const GatewaySchema: z.ZodObject<{
    id: z.ZodUUID;
    serial_number: z.ZodString;
    name: z.ZodString;
    ipv4_address: z.ZodString;
    status: z.ZodEnum<{
        ACTIVE: "ACTIVE";
        INACTIVE: "INACTIVE";
        DECOMMISSIONED: "DECOMMISSIONED";
    }>;
    location: z.ZodOptional<z.ZodString>;
    created_at: z.ZodDate;
    updated_at: z.ZodDate;
    tenant_id: z.ZodUUID;
}, z.core.$strip>;
export declare const CreateGatewaySchema: z.ZodObject<{
    name: z.ZodString;
    serial_number: z.ZodString;
    ipv4_address: z.ZodString;
    status: z.ZodEnum<{
        ACTIVE: "ACTIVE";
        INACTIVE: "INACTIVE";
        DECOMMISSIONED: "DECOMMISSIONED";
    }>;
    tenant_id: z.ZodUUID;
    location: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const UpdateGatewaySchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    ipv4_address: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        ACTIVE: "ACTIVE";
        INACTIVE: "INACTIVE";
        DECOMMISSIONED: "DECOMMISSIONED";
    }>>;
    location: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export type GatewayDTO = z.infer<typeof GatewaySchema> & {
    devices?: PeripheralDeviceDTO[];
    tenant?: TenantDTO;
};
export type CreateGatewayDTO = z.infer<typeof CreateGatewaySchema>;
export type UpdateGatewayDTO = z.infer<typeof UpdateGatewaySchema>;
//# sourceMappingURL=gateway.schema.d.ts.map