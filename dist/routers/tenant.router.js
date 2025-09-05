import { Router } from "express";
import { validateRequest } from '../middlewares/validation.middleware';
import { CreateTenantSchema, UpdateTenantSchema } from '../schemas/tenant.schema';
import { UuidParamSchema } from '../middlewares/validation.middleware';
import * as tenantController from '../controllers/tenant.controller';
const router = Router();
router.get('/', (req, res) => {
    res.json({ message: 'Tenant API is running!' });
});
router.post('/', validateRequest({ body: CreateTenantSchema }), tenantController.createTenant);
router.get('/', tenantController.listTenants);
router.get('/:id', validateRequest({ params: UuidParamSchema }), tenantController.getTenantById);
router.put('/:id', validateRequest({ params: UuidParamSchema, body: UpdateTenantSchema }), tenantController.updateTenant);
router.delete('/:id', validateRequest({ params: UuidParamSchema }), tenantController.deleteTenant);
export default router;
//# sourceMappingURL=tenant.router.js.map