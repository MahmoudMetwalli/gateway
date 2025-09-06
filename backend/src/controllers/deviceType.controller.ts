import type { Request, Response, NextFunction } from 'express';
import type { CreateDeviceTypeDTO, UpdateDeviceTypeDTO } from '../schemas/deviceType.schema';
import * as deviceTypeService from '../services/deviceType.service';

export const createDeviceType = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const deviceTypeData: CreateDeviceTypeDTO = req.body;

    // Prepare data for Prisma
    const prismaData = {
      name: deviceTypeData.name,
      description: deviceTypeData.description,
    };

    const newDeviceType = await deviceTypeService.createDeviceType(prismaData);
    res.status(201).json(newDeviceType);
  } catch (error) {
    next(error);
  }
};

export const listDeviceTypes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const deviceTypes = await deviceTypeService.listDeviceTypes();
    res.json(deviceTypes);
  } catch (error) {
    next(error);
  }
};
export const getDeviceTypeById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const deviceType = await deviceTypeService.getDeviceTypeById(Number(id));
    
    if (!deviceType) {
      res.status(404).json({ error: 'Device type not found' });
      return;
    }
    
    res.json(deviceType);
  } catch (error) {
    next(error);
  }
};

export const updateDeviceType = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const deviceTypeData: UpdateDeviceTypeDTO = req.body;

    // Check if device type exists
    const existingDeviceType = await deviceTypeService.getDeviceTypeById(Number(id));
    if (!existingDeviceType) {
      res.status(404).json({ error: 'Device type not found' });
      return;
    }

    // Prepare data for Prisma
    const updateData: any = {};
    if (deviceTypeData.name !== undefined) updateData.name = deviceTypeData.name;
    if (deviceTypeData.description !== undefined) updateData.description = deviceTypeData.description;

    const updatedDeviceType = await deviceTypeService.updateDeviceType(Number(id), updateData);
    res.json(updatedDeviceType);
  } catch (error) {
    next(error);
  }
};

export const deleteDeviceType = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Check if device type exists
    const existingDeviceType = await deviceTypeService.getDeviceTypeById(Number(id));
    if (!existingDeviceType) {
      res.status(404).json({ error: 'Device type not found' });
      return;
    }

    await deviceTypeService.deleteDeviceType(Number(id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
