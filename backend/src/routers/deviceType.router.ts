import { Router } from "express";
import validateRequest from "../middlewares/validation.middleware.js";
import {
  CreateDeviceTypeSchema,
  UpdateDeviceTypeSchema,
} from "../schemas/deviceType.schema.js";
import deviceTypeController from "../controllers/deviceType.controller.js";

const router = Router();

/**
 * @swagger
 * /api/device-types:
 *   post:
 *     summary: Create a new device type
 *     tags: [Device Types]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDeviceTypeRequest'
 *     responses:
 *       201:
 *         description: Device type created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeviceType'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post(
  "/",
  validateRequest({ body: CreateDeviceTypeSchema }),
  deviceTypeController.createDeviceType
);

/**
 * @swagger
 * /api/device-types:
 *   get:
 *     summary: Get all device types
 *     tags: [Device Types]
 *     responses:
 *       200:
 *         description: List of device types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DeviceType'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/", deviceTypeController.listDeviceTypes);

/**
 * @swagger
 * /api/device-types/{id}:
 *   get:
 *     summary: Get device type by ID
 *     tags: [Device Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Device type ID
 *     responses:
 *       200:
 *         description: Device type details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeviceType'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/:id", deviceTypeController.getDeviceTypeById);

/**
 * @swagger
 * /api/device-types/{id}:
 *   patch:
 *     summary: Update device type
 *     tags: [Device Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Device type ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateDeviceTypeRequest'
 *     responses:
 *       200:
 *         description: Device type updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeviceType'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.patch(
  "/:id",
  validateRequest({ body: UpdateDeviceTypeSchema }),
  deviceTypeController.updateDeviceType
);

/**
 * @swagger
 * /api/device-types/{id}:
 *   delete:
 *     summary: Delete device type
 *     tags: [Device Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Device type ID
 *     responses:
 *       204:
 *         description: Device type deleted successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete("/:id", deviceTypeController.deleteDeviceType);

export default router;
