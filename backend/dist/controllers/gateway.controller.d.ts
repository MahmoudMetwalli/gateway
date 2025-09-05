import type { Request, Response, NextFunction } from 'express';
export declare const createGateway: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const listGateways: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getGatewayById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateGateway: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteGateway: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const attachDevice: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const detachDevice: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=gateway.controller.d.ts.map