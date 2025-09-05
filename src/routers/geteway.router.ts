import { Router } from "express";
import { validateRequest } from '../middlewares/validation.middleware';
import { CreateGatewaySchema, UpdateGatewaySchema } from '../schemas/gateway.schema';
import { DeviceAttachSchema } from '../schemas/miscellaneous.schema';
import * as gatewayController from '../controllers/gateway.controller';
import { z } from 'zod';

const router = Router();

// CREATE gateway
router.post('/', 
  validateRequest({ body: CreateGatewaySchema }),
  gatewayController.createGateway
);

// LIST all gateways
router.get('/', gatewayController.listGateways);

// GET single gateway by ID
router.get('/:id', gatewayController.getGatewayById);

// UPDATE gateway
router.put('/:id',
  validateRequest({ body: UpdateGatewaySchema }),
  gatewayController.updateGateway
);

// DELETE gateway
router.delete('/:id', gatewayController.deleteGateway);

// ATTACH device to gateway
router.post('/:id/devices',
  validateRequest({ body: DeviceAttachSchema }),
  gatewayController.attachDevice
);

// DETACH device from gateway
router.delete('/:id/devices/:deviceId', gatewayController.detachDevice);

export default router;
