import type { Request, Response, NextFunction } from 'express';
export declare const createTenant: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const listTenants: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getTenantById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateTenant: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteTenant: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=tenant.controller.d.ts.map