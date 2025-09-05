import * as tenantRepo from '../repositories/tenant.repository';
export const createTenant = async (req, res, next) => {
    try {
        const tenantData = req.body;
        const newTenant = await tenantRepo.createTenant(tenantData);
        res.status(201).json(newTenant);
    }
    catch (error) {
        next(error);
    }
};
export const listTenants = async (req, res, next) => {
    try {
        const tenants = await tenantRepo.listTenants();
        res.json(tenants);
    }
    catch (error) {
        next(error);
    }
};
export const getTenantById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const tenant = await tenantRepo.getTenantById(id);
        if (!tenant) {
            res.status(404).json({ error: 'Tenant not found' });
            return;
        }
        res.json(tenant);
    }
    catch (error) {
        next(error);
    }
};
export const updateTenant = async (req, res, next) => {
    try {
        const { id } = req.params;
        const tenantData = req.body;
        const updatedTenant = await tenantRepo.updateTenant(id, tenantData);
        res.json(updatedTenant);
    }
    catch (error) {
        next(error);
    }
};
export const deleteTenant = async (req, res, next) => {
    try {
        const { id } = req.params;
        await tenantRepo.deleteTenant(id);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=tenant.controller.js.map