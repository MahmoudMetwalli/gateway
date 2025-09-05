import type { Request, Response, NextFunction } from 'express';
import type { CreateGatewayDTO, UpdateGatewayDTO } from '../schemas/gateway.schema';
import * as gatewayRepo from '../repositories/gateway.repository';
import * as deviceRepo from '../repositories/device.repository';
import { serializeBigInt } from '../utils/bigint';

export const createGateway = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const gatewayData: CreateGatewayDTO = req.body;
    
    // Check if serial number already exists
    const serialExists = await gatewayRepo.serialNumberExists(gatewayData.serial_number);
    if (serialExists) {
      res.status(409).json({ error: 'Gateway serial number already exists' });
      return;
    }

    // Check if IPv4 address already exists
    const ipExists = await gatewayRepo.ipv4AddressExists(gatewayData.ipv4_address);
    if (ipExists) {
      res.status(409).json({ error: 'Gateway IPv4 address already exists' });
      return;
    }

    // Prepare data for Prisma with tenant relationship
    const prismaData = {
      name: gatewayData.name,
      status: gatewayData.status,
      serial_number: gatewayData.serial_number,
      ipv4_address: gatewayData.ipv4_address,
      location: gatewayData.location || null,
      tenant: {
        connect: { id: gatewayData.tenant_id }
      }
    };

    const newGateway = await gatewayRepo.createGateway(prismaData);
    
    await gatewayRepo.createGatewayLog(newGateway.id, 'CREATED', {
      name: newGateway.name,
      serial_number: newGateway.serial_number,
      ipv4_address: newGateway.ipv4_address
    });

    res.status(201).json(serializeBigInt(newGateway));
  } catch (error) {
    next(error);
  }
};

export const listGateways = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const gateways = await gatewayRepo.listGateways();
    res.json(serializeBigInt(gateways));
  } catch (error) {
    next(error);
  }
};

export const getGatewayById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const gateway = await gatewayRepo.getGatewayById(id!);
    
    if (!gateway) {
      res.status(404).json({ error: 'Gateway not found' });
      return;
    }
    
    res.json(serializeBigInt(gateway));
  } catch (error) {
    next(error);
  }
};

export const updateGateway = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const gatewayData: UpdateGatewayDTO = req.body;
    
    // Check if gateway exists
    const existingGateway = await gatewayRepo.getGatewayById(id!);
    if (!existingGateway) {
      res.status(404).json({ error: 'Gateway not found' });
      return;
    }

    // Check if IPv4 address already exists (if being updated)
    if (gatewayData.ipv4_address && gatewayData.ipv4_address !== existingGateway.ipv4_address) {
      const ipExists = await gatewayRepo.ipv4AddressExists(gatewayData.ipv4_address);
      if (ipExists) {
        res.status(409).json({ error: 'Gateway IPv4 address already exists' });
        return;
      }
    }

    // Filter out undefined values for Prisma
    const updateData: Record<string, any> = {};
    if (gatewayData.name !== undefined) updateData.name = gatewayData.name;
    if (gatewayData.status !== undefined) updateData.status = gatewayData.status;
    if (gatewayData.ipv4_address !== undefined) updateData.ipv4_address = gatewayData.ipv4_address;
    if (gatewayData.location !== undefined) updateData.location = gatewayData.location;

    const updatedGateway = await gatewayRepo.updateGateway(id!, updateData);
    
    await gatewayRepo.createGatewayLog(id!, 'UPDATED', {
      changes: updateData
    });

    res.json(serializeBigInt(updatedGateway));
  } catch (error) {
    next(error);
  }
};

export const deleteGateway = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Check if gateway exists
    const existingGateway = await gatewayRepo.getGatewayById(id!);
    if (!existingGateway) {
      res.status(404).json({ error: 'Gateway not found' });
      return;
    }

    // Log gateway deletion
    await gatewayRepo.createGatewayLog(id!, 'DELETED', {
      user: 'system',
      gateway_data: existingGateway
    });

    await gatewayRepo.deleteGateway(id!);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const attachDevice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id: gatewayId } = req.params;
    const { deviceId } = req.body;

    // Check if gateway exists
    const gateway = await gatewayRepo.getGatewayById(gatewayId!);
    if (!gateway) {
      res.status(404).json({ error: 'Gateway not found' });
      return;
    }

    // Check if device exists
    const device = await deviceRepo.getDeviceById(deviceId);
    if (!device) {
      res.status(404).json({ error: 'Device not found' });
      return;
    }

    // Check device limit (max 10 devices per gateway)
    const deviceCount = await deviceRepo.countDevicesInGateway(gatewayId!);
    if (deviceCount >= 10) {
      res.status(400).json({ error: 'Gateway already has the maximum number of devices (10)' });
      return;
    }

    // Check if device is already attached to another gateway
    if (device.gateway_id && device.gateway_id !== gatewayId) {
      res.status(400).json({ error: 'Device is already attached to another gateway' });
      return;
    }

    const updatedDevice = await deviceRepo.attachDeviceToGateway(deviceId, gatewayId!);
    
    // Log device attachment
    await gatewayRepo.createGatewayLog(gatewayId!, 'DEVICE_ATTACHED', {
      user: 'system',
      device_id: deviceId,
      device_uid: device.uid.toString()
    });

    res.json(serializeBigInt(updatedDevice));
  } catch (error) {
    next(error);
  }
};

export const detachDevice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id: gatewayId, deviceId } = req.params;

    // Check if gateway exists
    const gateway = await gatewayRepo.getGatewayById(gatewayId!);
    if (!gateway) {
      res.status(404).json({ error: 'Gateway not found' });
      return;
    }

    // Check if device exists and is attached to this gateway
    const device = await deviceRepo.getDeviceById(deviceId!);
    if (!device) {
      res.status(404).json({ error: 'Device not found' });
      return;
    }

    if (device.gateway_id !== gatewayId) {
      res.status(400).json({ error: 'Device is not attached to this gateway' });
      return;
    }

    const updatedDevice = await deviceRepo.detachDeviceFromGateway(deviceId!);
    
    // Log device detachment
    await gatewayRepo.createGatewayLog(gatewayId!, 'DEVICE_DETACHED', {
      user: 'system',
      device_id: deviceId,
      device_uid: device.uid.toString()
    });

    res.json(serializeBigInt(updatedDevice));
  } catch (error) {
    next(error);
  }
};
