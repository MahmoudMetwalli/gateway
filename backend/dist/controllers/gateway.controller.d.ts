import type { Request, Response, NextFunction } from "express";
declare const gatewayController: {
    createGateway: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    listGateways: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getGatewayById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateGateway: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteGateway: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    attachDevice: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    detachDevice: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    listGatewayLogs: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    listAllLogs: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};
export default gatewayController;
//# sourceMappingURL=gateway.controller.d.ts.map