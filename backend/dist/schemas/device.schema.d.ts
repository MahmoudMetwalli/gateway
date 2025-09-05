import { z } from 'zod';
import type { DeviceTypeDTO } from './deviceType.schema.js';
export declare const PeripheralDeviceSchema: z.ZodObject<{
    id: z.ZodString;
    uid: z.ZodString;
    vendor: z.ZodString;
    status: z.ZodEnum<{
        ONLINE: "ONLINE";
        OFFLINE: "OFFLINE";
        MAINTENANCE: "MAINTENANCE";
    }>;
    created_at: z.ZodDate;
    last_seen_at: z.ZodOptional<z.ZodDate>;
    gateway_id: z.ZodOptional<z.ZodString>;
    device_type_id: z.ZodNumber;
}, z.core.$strip>;
export declare const CreatePeripheralDeviceSchema: z.ZodObject<{
    uid: z.ZodString;
    vendor: z.ZodString;
    status: z.ZodEnum<{
        ONLINE: "ONLINE";
        OFFLINE: "OFFLINE";
        MAINTENANCE: "MAINTENANCE";
    }>;
    gateway_id: z.ZodOptional<z.ZodString>;
    device_type_id: z.ZodNumber;
}, z.core.$strip>;
export declare const UpdatePeripheralDeviceSchema: z.ZodObject<{
    vendor: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        ONLINE: "ONLINE";
        OFFLINE: "OFFLINE";
        MAINTENANCE: "MAINTENANCE";
    }>>;
    device_type_id: z.ZodOptional<z.ZodNumber>;
    last_seen_at: z.ZodOptional<z.ZodOptional<z.ZodDate>>;
}, z.core.$strip>;
export type PeripheralDeviceDTO = z.infer<typeof PeripheralDeviceSchema> & {
    device_type?: DeviceTypeDTO;
    gateway?: any;
};
export type CreatePeripheralDeviceDTO = z.infer<typeof CreatePeripheralDeviceSchema>;
export type UpdatePeripheralDeviceDTO = z.infer<typeof UpdatePeripheralDeviceSchema>;
//# sourceMappingURL=device.schema.d.ts.map