import { prisma } from "../config";
import { Prisma } from "@prisma/client";
export async function uidExists(uid) {
    const device = await prisma.peripheralDevice.findUnique({
        where: { uid }
    });
    return !!device;
}
export async function createDevice(data) {
    const device = await prisma.peripheralDevice.create({
        data,
        include: {
            device_type: true,
            gateway: true
        }
    });
    return device;
}
export async function listDevices() {
    const devices = await prisma.peripheralDevice.findMany({
        include: {
            device_type: true,
            gateway: true
        }
    });
    return devices;
}
export async function getDeviceById(id) {
    const device = await prisma.peripheralDevice.findUnique({
        where: { id },
        include: {
            device_type: true,
            gateway: true
        }
    });
    return device;
}
export async function updateDevice(id, data) {
    const device = await prisma.peripheralDevice.update({
        where: { id },
        data,
        include: {
            device_type: true,
            gateway: true
        }
    });
    return device;
}
export async function deleteDevice(id) {
    return prisma.peripheralDevice.delete({ where: { id } });
}
export async function getOrphanDevices() {
    const devices = await prisma.peripheralDevice.findMany({
        where: {
            gateway_id: null
        },
        include: {
            device_type: true
        }
    });
    return devices;
}
export async function countDevicesInGateway(gatewayId) {
    const count = await prisma.peripheralDevice.count({
        where: {
            gateway_id: gatewayId
        }
    });
    return count;
}
export async function attachDeviceToGateway(deviceId, gatewayId) {
    const device = await prisma.peripheralDevice.update({
        where: { id: deviceId },
        data: { gateway_id: gatewayId },
        include: {
            device_type: true,
            gateway: true
        }
    });
    return device;
}
export async function detachDeviceFromGateway(deviceId) {
    const device = await prisma.peripheralDevice.update({
        where: { id: deviceId },
        data: { gateway_id: null },
        include: {
            device_type: true,
            gateway: true
        }
    });
    return device;
}
//# sourceMappingURL=device.repository.js.map