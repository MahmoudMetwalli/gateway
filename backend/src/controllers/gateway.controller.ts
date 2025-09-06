import type { Request, Response, NextFunction } from 'express';
import type { CreateGatewayDTO, UpdateGatewayDTO } from '../schemas/gateway.schema';
import * as gatewayService from '../services/gateway.service';
import * as deviceService from '../services/device.service';
import { serialize } from '../utils/serializer';

export const createGateway = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const gatewayData: CreateGatewayDTO = req.body;
    
    // Check if serial number already exists
    const serialExists = await gatewayService.serialNumberExists(gatewayData.serial_number);
    if (serialExists) {
      res.status(409).json({ error: 'Gateway serial number already exists' });
      return;
    }

    // Check if IPv4 address already exists
    const ipExists = await gatewayService.ipv4AddressExists(gatewayData.ipv4_address);
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

    const newGateway = await gatewayService.createGateway(prismaData);
    
    await gatewayService.createGatewayLog(newGateway.id, 'CREATED', {
      name: newGateway.name,
      serial_number: newGateway.serial_number,
      ipv4_address: newGateway.ipv4_address
    });

    res.status(201).json(serialize(newGateway));
  } catch (error) {
    next(error);
  }
};

export const listGateways = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const gateways = await gatewayService.listGateways();
    res.json(serialize(gateways));
  } catch (error) {
    next(error);
  }
};

export const getGatewayById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const gateway = await gatewayService.getGatewayById(id!);
    
    if (!gateway) {
      res.status(404).json({ error: 'Gateway not found' });
      return;
    }
    
    res.json(serialize(gateway));
  } catch (error) {
    next(error);
  }
};

export const updateGateway = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const gatewayData: UpdateGatewayDTO = req.body;
    
    // Check if gateway exists
    const existingGateway = await gatewayService.getGatewayById(id!);
    if (!existingGateway) {
      res.status(404).json({ error: 'Gateway not found' });
      return;
    }

    // Check if IPv4 address already exists (if being updated)
    if (gatewayData.ipv4_address && gatewayData.ipv4_address !== existingGateway.ipv4_address) {
      const ipExists = await gatewayService.ipv4AddressExists(gatewayData.ipv4_address);
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

    const updatedGateway = await gatewayService.updateGateway(id!, {...updateData});

    await gatewayService.createGatewayLog(id!, 'UPDATED', {
      changes: updateData
    });

    res.json(serialize(updatedGateway));
  } catch (error) {
    next(error);
  }
};

export const deleteGateway = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Check if gateway exists
    const existingGateway = await gatewayService.getGatewayById(id!);
    if (!existingGateway) {
      res.status(404).json({ error: 'Gateway not found' });
      return;
    }

    // Log gateway deletion
    await gatewayService.createGatewayLog(id!, 'DELETED', {
      user: 'system',
      gateway_data: serialize(existingGateway)
    });

    await gatewayService.deleteGateway(id!);
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
    const gateway = await gatewayService.getGatewayById(gatewayId!);
    if (!gateway) {
      res.status(404).json({ error: 'Gateway not found' });
      return;
    }

    // Check if device exists
    const device = await deviceService.getDeviceById(deviceId);
    if (!device) {
      res.status(404).json({ error: 'Device not found' });
      return;
    }

    // Check device limit (max 10 devices per gateway)
    const deviceCount = await deviceService.countDevicesInGateway(gatewayId!);
    if (deviceCount >= 10) {
      res.status(400).json({ error: 'Gateway already has the maximum number of devices (10)' });
      return;
    }

    // Check if device is already attached to another gateway
    if (device.gateway_id && device.gateway_id !== gatewayId) {
      res.status(400).json({ error: 'Device is already attached to another gateway' });
      return;
    }

    const updatedDevice = await deviceService.attachDeviceToGateway(deviceId, gatewayId!);
    
    // Log device attachment
    await gatewayService.createGatewayLog(gatewayId!, 'DEVICE_ATTACHED', {
      user: 'system',
      device_id: deviceId,
      device_uid: device.uid.toString()
    });

    res.json(serialize(updatedDevice));
  } catch (error) {
    next(error);
  }
};

export const detachDevice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id: gatewayId, deviceId } = req.params;

    // Check if gateway exists
    const gateway = await gatewayService.getGatewayById(gatewayId!);
    if (!gateway) {
      res.status(404).json({ error: 'Gateway not found' });
      return;
    }

    // Check if device exists and is attached to this gateway
    const device = await deviceService.getDeviceById(deviceId!);
    if (!device) {
      res.status(404).json({ error: 'Device not found' });
      return;
    }

    if (device.gateway_id !== gatewayId) {
      res.status(400).json({ error: 'Device is not attached to this gateway' });
      return;
    }

    const updatedDevice = await deviceService.detachDeviceFromGateway(deviceId!);
    
    // Log device detachment
    await gatewayService.createGatewayLog(gatewayId!, 'DEVICE_DETACHED', {
      user: 'system',
      device_id: deviceId,
      device_uid: device.uid.toString()
    });

    res.json(serialize(updatedDevice));
  } catch (error) {
    next(error);
  }
};

export const listGatewayLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id: gatewayId } = req.params;

    // Check if gateway exists
    const gateway = await gatewayService.getGatewayById(gatewayId!);
    if (!gateway) {
      res.status(404).json({ error: 'Gateway not found' });
      return;
    }

    const logs = await gatewayService.listGatewayLogs(gatewayId!);
    res.json(serialize(logs));
  } catch (error) {
    next(error);
  }
};

export const listAllLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const logs = await gatewayService.listAllLogs();
    res.json(serialize(logs));
  } catch (error) {
    next(error);
  }
};
