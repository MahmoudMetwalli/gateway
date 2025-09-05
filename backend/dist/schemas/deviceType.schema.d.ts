import { z } from 'zod';
import type { PeripheralDeviceDTO } from './device.schema.js';
export declare const DeviceTypeSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    description: z.ZodString;
}, z.core.$strip>;
export declare const CreateDeviceTypeSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
}, z.core.$strip>;
export declare const UpdateDeviceTypeSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type DeviceTypeDTO = z.infer<typeof DeviceTypeSchema> & {
    devices?: PeripheralDeviceDTO[];
};
export type CreateDeviceTypeDTO = z.infer<typeof CreateDeviceTypeSchema>;
export type UpdateDeviceTypeDTO = z.infer<typeof UpdateDeviceTypeSchema>;
//# sourceMappingURL=deviceType.schema.d.ts.map