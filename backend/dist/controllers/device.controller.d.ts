import type { Request, Response, NextFunction } from 'express';
export declare const createDevice: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const listDevices: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getDeviceById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateDevice: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteDevice: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getOrphanDevices: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=device.controller.d.ts.map