import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';
export declare const validateRequest: (schemas: {
    body?: z.ZodSchema;
    params?: z.ZodSchema;
    query?: z.ZodSchema;
}) => (req: Request, res: Response, next: NextFunction) => void;
export declare const UuidParamSchema: z.ZodObject<{
    id: z.ZodUUID;
}, z.core.$strip>;
export declare const DeviceAttachSchema: z.ZodObject<{
    deviceId: z.ZodUUID;
}, z.core.$strip>;
//# sourceMappingURL=validation.middleware.d.ts.map