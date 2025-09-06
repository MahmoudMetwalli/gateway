import type { Request, Response, NextFunction } from "express";
import type { CreateTenantDTO } from "../schemas/tenant.schema";
import * as tenantService from "../services/tenant.service";
import { serialize } from "../utils/serializer";
import wrapAsync from "../utils/errorCatcher";

const createTenant = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const tenantData: CreateTenantDTO = req.body;
  const newTenant = await tenantService.createTenant(tenantData);
  res.status(201).json(newTenant);
};

const listTenants = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const tenants = await tenantService.listTenants();
  res.json(serialize(tenants));
};

const getTenantById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  const tenant = await tenantService.getTenantById(id!);
  if (!tenant) {
    res.status(404).json({ error: "Tenant not found" });
    return;
  }
  res.json(serialize(tenant));
};

const updateTenant = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  const tenantData: Partial<CreateTenantDTO> = req.body;
  const updatedTenant = await tenantService.updateTenant(id!, tenantData);
  res.json(updatedTenant);
};

const deleteTenant = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  await tenantService.deleteTenant(id!);
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
