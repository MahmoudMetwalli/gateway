import type { Request, Response, NextFunction } from "express";
import type {
  CreateDeviceTypeDTO,
  UpdateDeviceTypeDTO,
} from "../schemas/deviceType.schema";
import * as deviceTypeService from "../services/deviceType.service";
import wrapAsync from "../utils/errorCatcher";

const createDeviceType = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const deviceTypeData: CreateDeviceTypeDTO = req.body;

  // Prepare data for Prisma
  const prismaData = {
    name: deviceTypeData.name,
    description: deviceTypeData.description,
  };

  const newDeviceType = await deviceTypeService.createDeviceType(prismaData);
  res.status(201).json(newDeviceType);
};

const listDeviceTypes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const deviceTypes = await deviceTypeService.listDeviceTypes();
  res.json(deviceTypes);
};
const getDeviceTypeById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  const deviceType = await deviceTypeService.getDeviceTypeById(Number(id));

  if (!deviceType) {
    res.status(404).json({ error: "Device type not found" });
    return;
  }

  res.json(deviceType);
};

const updateDeviceType = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  const deviceTypeData: UpdateDeviceTypeDTO = req.body;

  // Check if device type exists
  const existingDeviceType = await deviceTypeService.getDeviceTypeById(
    Number(id)
  );
  if (!existingDeviceType) {
    res.status(404).json({ error: "Device type not found" });
    return;
  }

  // Prepare data for Prisma
  const updateData: any = {};
  if (deviceTypeData.name !== undefined) updateData.name = deviceTypeData.name;
  if (deviceTypeData.description !== undefined)
    updateData.description = deviceTypeData.description;

  const updatedDeviceType = await deviceTypeService.updateDeviceType(
    Number(id),
    updateData
  );
  res.json(updatedDeviceType);
};

const deleteDeviceType = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;

  // Check if device type exists
  const existingDeviceType = await deviceTypeService.getDeviceTypeById(
    Number(id)
  );
  if (!existingDeviceType) {
    res.status(404).json({ error: "Device type not found" });
    return;
  }

  await deviceTypeService.deleteDeviceType(Number(id));
  res.status(204).send();
};

const deviceTypeController = {
  createDeviceType: wrapAsync(createDeviceType),
  listDeviceTypes: wrapAsync(listDeviceTypes),
  getDeviceTypeById: wrapAsync(getDeviceTypeById),
  updateDeviceType: wrapAsync(updateDeviceType),
  deleteDeviceType: wrapAsync(deleteDeviceType),
};

export default deviceTypeController;
