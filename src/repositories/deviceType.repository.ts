import { prisma } from "../config";
import { Prisma } from "@prisma/client";

export async function createDeviceType(data: Prisma.DeviceTypeCreateInput) {
  const deviceType = await prisma.deviceType.create({ 
    data
  });
  return deviceType;
}

export async function listDeviceTypes() {
  const deviceTypes = await prisma.deviceType.findMany();
  return deviceTypes;
}

export async function getDeviceTypeById(id: number) {
  const deviceType = await prisma.deviceType.findUnique({
    where: { id },
  });
  return deviceType;
}

export async function updateDeviceType(id: number, data: Prisma.DeviceTypeUpdateInput) {
  const deviceType = await prisma.deviceType.update({ 
    where: { id }, 
    data
  });
  return deviceType;
}

export async function deleteDeviceType(id: number) {
  return prisma.deviceType.delete({ where: { id } });
}
