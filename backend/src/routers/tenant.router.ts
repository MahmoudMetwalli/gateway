import { Router } from "express";
import type { Request, Response } from 'express';
import { validateRequest } from '../middlewares/validation.middleware';
import { CreateTenantSchema, UpdateTenantSchema } from '../schemas/tenant.schema';
import { UuidParamSchema } from '../middlewares/validation.middleware';
import * as tenantController from '../controllers/tenant.controller';
const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Tenant API is running!' });
});

router.post('/', validateRequest({ body: CreateTenantSchema }), tenantController.createTenant);
router.get('/', tenantController.listTenants);
router.get('/:id', tenantController.getTenantById);
router.put('/:id', validateRequest({ body: UpdateTenantSchema }), tenantController.updateTenant);
router.delete('/:id', tenantController.deleteTenant);


export default router;
