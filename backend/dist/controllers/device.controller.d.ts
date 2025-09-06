import type { Request, Response, NextFunction } from "express";
declare const deviceController: {
    createDevice: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    listDevices: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getDeviceById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateDevice: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteDevice: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getOrphanDevices: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};
export default deviceController;
//# sourceMappingURL=device.controller.d.ts.map