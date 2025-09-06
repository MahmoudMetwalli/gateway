import * as tenantService from "../services/tenant.service.js";
import { serialize } from "../utils/serializer.js";
import wrapAsync from "../utils/errorCatcher.js";
const createTenant = async (req, res, next) => {
    const tenantData = req.body;
    const newTenant = await tenantService.createTenant(tenantData);
    res.status(201).json(newTenant);
};
const listTenants = async (req, res, next) => {
    const tenants = await tenantService.listTenants();
    res.json(serialize(tenants));
};
const getTenantById = async (req, res, next) => {
    const { id } = req.params;
    const tenant = await tenantService.getTenantById(id);
    if (!tenant) {
        res.status(404).json({ error: "Tenant not found" });
        return;
    }
    res.json(serialize(tenant));
};
const updateTenant = async (req, res, next) => {
    const { id } = req.params;
    const tenantData = req.body;
    const updatedTenant = await tenantService.updateTenant(id, tenantData);
    res.json(updatedTenant);
};
const deleteTenant = async (req, res, next) => {
    const { id } = req.params;
    await tenantService.deleteTenant(id);
    res.status(204).send();
};
const tenantController = {
    createTenant: wrapAsync(createTenant),
    listTenants: wrapAsync(listTenants),
    getTenantById: wrapAsync(getTenantById),
    updateTenant: wrapAsync(updateTenant),
    deleteTenant: wrapAsync(deleteTenant),
};
export default tenantController;
//# sourceMappingURL=tenant.controller.js.map