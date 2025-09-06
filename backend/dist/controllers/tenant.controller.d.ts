import type { Request, Response, NextFunction } from "express";
declare const tenantController: {
    createTenant: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    listTenants: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getTenantById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateTenant: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteTenant: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};
export default tenantController;
//# sourceMappingURL=tenant.controller.d.ts.map