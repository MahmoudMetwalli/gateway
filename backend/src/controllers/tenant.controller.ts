import type { Request, Response, NextFunction } from 'express';
import type { CreateTenantDTO } from '../schemas/tenant.schema';
import * as tenantRepo from '../repositories/tenant.repository';

export const createTenant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tenantData: CreateTenantDTO = req.body;
    const newTenant = await tenantRepo.createTenant(tenantData);
    res.status(201).json(newTenant);
  } catch (error) {
    next(error);
  }
};

export const listTenants = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tenants = await tenantRepo.listTenants();
    res.json(tenants);
  } catch (error) {
    next(error);
  }
};

export const getTenantById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const tenant = await tenantRepo.getTenantById(id!);
    if (!tenant) {
      res.status(404).json({ error: 'Tenant not found' });
      return;
    }
    res.json(tenant);
  } catch (error) {
    next(error);
  }
};

export const updateTenant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const tenantData: Partial<CreateTenantDTO> = req.body;
    const updatedTenant = await tenantRepo.updateTenant(id!, tenantData);
    res.json(updatedTenant);
  } catch (error) {
    next(error);
  }
};

export const deleteTenant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await tenantRepo.deleteTenant(id!);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
