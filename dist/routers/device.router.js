import { Router } from "express";
import { validateRequest } from '../middlewares/validation.middleware';
import { CreatePeripheralDeviceSchema, UpdatePeripheralDeviceSchema } from '../schemas/device.schema';
import * as deviceController from '../controllers/device.controller';
const router = Router();
// GET orphan devices (devices not assigned to any gateway) - must be before /:id route
router.get('/orphans', deviceController.getOrphanDevices);
// CREATE device
router.post('/', validateRequest({ body: CreatePeripheralDeviceSchema }), deviceController.createDevice);
// LIST all devices
router.get('/', deviceController.listDevices);
// GET single device by ID
router.get('/:id', deviceController.getDeviceById);
// UPDATE device
router.put('/:id', validateRequest({ body: UpdatePeripheralDeviceSchema }), deviceController.updateDevice);
// DELETE device
router.delete('/:id', deviceController.deleteDevice);
export default router;
//# sourceMappingURL=device.router.js.map