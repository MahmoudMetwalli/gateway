import { Router } from "express";
import validateRequest from '../middlewares/validation.middleware';
import { CreatePeripheralDeviceSchema, UpdatePeripheralDeviceSchema } from '../schemas/device.schema';
import deviceController from '../controllers/device.controller';

const router = Router();

/**
 * @swagger
 * /api/devices/orphans:
 *   get:
 *     summary: Get orphan devices (devices not assigned to any gateway)
 *     tags: [Devices]
 *     responses:
 *       200:
 *         description: List of orphan devices
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PeripheralDevice'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/orphans', deviceController.getOrphanDevices);

/**
 * @swagger
 * /api/devices:
 *   post:
 *     summary: Create a new device
 *     tags: [Devices]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePeripheralDeviceRequest'
 *     responses:
 *       201:
 *         description: Device created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PeripheralDevice'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/', 
  validateRequest({ body: CreatePeripheralDeviceSchema }),
  deviceController.createDevice
);

/**
 * @swagger
 * /api/devices:
 *   get:
 *     summary: Get all devices
 *     tags: [Devices]
 *     responses:
 *       200:
 *         description: List of devices
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PeripheralDevice'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/', deviceController.listDevices);

/**
 * @swagger
 * /api/devices/{id}:
 *   get:
 *     summary: Get device by ID
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Device ID
 *     responses:
 *       200:
 *         description: Device details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PeripheralDevice'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/:id', deviceController.getDeviceById);

/**
 * @swagger
 * /api/devices/{id}:
 *   patch:
 *     summary: Update device
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Device ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePeripheralDeviceRequest'
 *     responses:
 *       200:
 *         description: Device updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PeripheralDevice'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.patch('/:id',
  validateRequest({ body: UpdatePeripheralDeviceSchema }),
  deviceController.updateDevice
);

/**
 * @swagger
 * /api/devices/{id}:
 *   delete:
 *     summary: Delete device
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Device ID
 *     responses:
 *       204:
 *         description: Device deleted successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete('/:id', deviceController.deleteDevice);

export default router;
