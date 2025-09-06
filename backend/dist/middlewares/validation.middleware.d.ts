import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';
declare const validateRequest: (schemas: {
    body?: z.ZodSchema;
    params?: z.ZodSchema;
    query?: z.ZodSchema;
}) => (req: Request, res: Response, next: NextFunction) => void;
export default validateRequest;
//# sourceMappingURL=validation.middleware.d.ts.map