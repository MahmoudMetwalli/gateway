import { Router } from "express";
import { validateRequest } from '../middlewares/validation.middleware';
import { CreateGatewaySchema, UpdateGatewaySchema } from '../schemas/gateway.schema';
import { DeviceAttachSchema } from '../schemas/miscellaneous.schema';
import * as gatewayController from '../controllers/gateway.controller';
import { z } from 'zod';

const router = Router();

/**
 * @swagger
 * /api/gateways:
 *   post:
 *     summary: Create a new gateway
 *     tags: [Gateways]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateGatewayRequest'
 *     responses:
 *       201:
 *         description: Gateway created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Gateway'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/', 
  validateRequest({ body: CreateGatewaySchema }),
  gatewayController.createGateway
);

/**
 * @swagger
 * /api/gateways:
 *   get:
 *     summary: Get all gateways
 *     tags: [Gateways]
 *     responses:
 *       200:
 *         description: List of gateways
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Gateway'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/', gatewayController.listGateways);

/**
 * @swagger
 * /api/gateways/{id}:
 *   get:
 *     summary: Get gateway by ID
 *     tags: [Gateways]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Gateway ID
 *     responses:
 *       200:
 *         description: Gateway details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Gateway'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/:id', gatewayController.getGatewayById);

/**
 * @swagger
 * /api/gateways/{id}:
 *   put:
 *     summary: Update gateway
 *     tags: [Gateways]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Gateway ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateGatewayRequest'
 *     responses:
 *       200:
 *         description: Gateway updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Gateway'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put('/:id',
  validateRequest({ body: UpdateGatewaySchema }),
  gatewayController.updateGateway
);

/**
 * @swagger
 * /api/gateways/{id}:
 *   delete:
 *     summary: Delete gateway
 *     tags: [Gateways]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Gateway ID
 *     responses:
 *       204:
 *         description: Gateway deleted successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete('/:id', gatewayController.deleteGateway);

/**
 * @swagger
 * /api/gateways/{id}/devices:
 *   post:
 *     summary: Attach device to gateway
 *     tags: [Gateways]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Gateway ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deviceId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the device to attach
 *             required:
 *               - deviceId
 *     responses:
 *       200:
 *         description: Device attached successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Gateway'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/:id/devices',
  validateRequest({ body: DeviceAttachSchema }),
  gatewayController.attachDevice
);

/**
 * @swagger
 * /api/gateways/{id}/devices/{deviceId}:
 *   delete:
 *     summary: Detach device from gateway
 *     tags: [Gateways]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Gateway ID
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Device ID to detach
 *     responses:
 *       200:
 *         description: Device detached successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Gateway'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete('/:id/devices/:deviceId', gatewayController.detachDevice);

export default router;
