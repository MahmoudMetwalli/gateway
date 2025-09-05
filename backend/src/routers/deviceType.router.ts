import { Router } from "express";
import { validateRequest } from '../middlewares/validation.middleware';
import { CreateDeviceTypeSchema, UpdateDeviceTypeSchema } from '../schemas/deviceType.schema';
import * as deviceTypeController from '../controllers/deviceType.controller';

const router = Router();



// CREATE device type
router.post('/', 
  validateRequest({ body: CreateDeviceTypeSchema }),
  deviceTypeController.createDeviceType
);

// LIST all device types
router.get('/', deviceTypeController.listDeviceTypes);

// GET single device type by ID
router.get('/:id', deviceTypeController.getDeviceTypeById);

// UPDATE device type
router.put('/:id',
  validateRequest({ body: UpdateDeviceTypeSchema }),
  deviceTypeController.updateDeviceType
);

// DELETE device type
router.delete('/:id', deviceTypeController.deleteDeviceType);

export default router;
