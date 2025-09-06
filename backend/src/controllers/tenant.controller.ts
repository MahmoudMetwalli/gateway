import type { Request, Response, NextFunction } from 'express';
import type { CreateTenantDTO } from '../schemas/tenant.schema';
import * as tenantService from '../services/tenant.service';
import { serialize } from '../utils/serializer';

export const createTenant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tenantData: CreateTenantDTO = req.body;
    const newTenant = await tenantService.createTenant(tenantData);
    res.status(201).json(newTenant);
  } catch (error) {
    next(error);
  }
};

export const listTenants = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tenants = await tenantService.listTenants();
    res.json(serialize(tenants));
  } catch (error) {
    next(error);
  }
};

export const getTenantById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const tenant = await tenantService.getTenantById(id!);
    if (!tenant) {
      res.status(404).json({ error: 'Tenant not found' });
      return;
    }
    res.json(serialize(tenant));
  } catch (error) {
    next(error);
  }
};

export const updateTenant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const tenantData: Partial<CreateTenantDTO> = req.body;
    const updatedTenant = await tenantService.updateTenant(id!, tenantData);
    res.json(updatedTenant);
  } catch (error) {
    next(error);
  }
};

export const deleteTenant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await tenantService.deleteTenant(id!);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
