import { tr } from "zod/locales";
import { prisma } from "../config";
import { Prisma } from "@prisma/client";

export async function uidExists(uid: bigint): Promise<boolean> {
  const device = await prisma.peripheralDevice.findUnique({
    where: { uid },
  });
  return !!device;
}

export async function createDevice(data: Prisma.PeripheralDeviceCreateInput) {
  try {
    const device = await prisma.peripheralDevice.create({
      data,
      include: {
        device_type: true,
        gateway: { include: { tenant: true } },
      },
    });
    return device;
  } catch (error: any) {
    if (error.code === "P2025") {
      throw new Error("Device type or Gateway not found");
    } else {
      throw error;
    }
  }
}

export async function listDevices() {
  const devices = await prisma.peripheralDevice.findMany({
    include: {
      device_type: true,
      gateway: { include: { tenant: true } },
    },
  });
  return devices;
}

export async function getDeviceById(id: string) {
  const device = await prisma.peripheralDevice.findUnique({
    where: { id },
    include: {
      device_type: true,
      gateway: { include: { tenant: true } },
    },
  });
  return device;
}

export async function updateDevice(
  id: string,
  data: Prisma.PeripheralDeviceUpdateInput
) {
  const device = await prisma.peripheralDevice.update({
    where: { id },
    data,
    include: {
      device_type: true,
      gateway: { include: { tenant: true } },
    },
  });
  return device;
}

export async function deleteDevice(id: string) {
  return prisma.peripheralDevice.delete({ where: { id } });
}

export async function getOrphanDevices() {
  const devices = await prisma.peripheralDevice.findMany({
    where: {
      gateway_id: null,
    },
    include: {
      device_type: true,
    },
  });
  return devices;
}

export async function countDevicesInGateway(
  gatewayId: string
): Promise<number> {
  const count = await prisma.peripheralDevice.count({
    where: {
      gateway_id: gatewayId,
    },
  });
  return count;
}

export async function attachDeviceToGateway(
  deviceId: string,
  gatewayId: string
) {
  const device = await prisma.peripheralDevice.update({
    where: { id: deviceId },
    data: { gateway_id: gatewayId },
    include: {
      device_type: true,
      gateway: { include: { tenant: true } },
    },
  });
  return device;
}

export async function detachDeviceFromGateway(deviceId: string) {
  const device = await prisma.peripheralDevice.update({
    where: { id: deviceId },
    data: { gateway_id: null },
    include: {
      device_type: true,
    },
  });
  return device;
}
