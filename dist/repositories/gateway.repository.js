import { prisma } from "../config";
import { Prisma } from "@prisma/client";
export async function serialNumberExists(serialNumber) {
    const gateway = await prisma.gateway.findUnique({
        where: { serial_number: serialNumber }
    });
    return !!gateway;
}
export async function ipv4AddressExists(ipv4Address) {
    const gateway = await prisma.gateway.findUnique({
        where: { ipv4_address: ipv4Address }
    });
    return !!gateway;
}
export async function createGateway(data) {
    const gateway = await prisma.gateway.create({
        data,
        include: {
            devices: { include: { device_type: true } },
            tenant: true
        }
    });
    return gateway;
}
export async function getGatewayById(id) {
    const gateway = await prisma.gateway.findUnique({
        where: { id },
        include: {
            devices: { include: { device_type: true } },
            tenant: true,
        },
    });
    return gateway;
}
export async function updateGateway(id, data) {
    const gateway = await prisma.gateway.update({
        where: { id },
        data,
        include: {
            devices: { include: { device_type: true } },
            tenant: true
        }
    });
    return gateway;
}
export async function deleteGateway(id) {
    return prisma.gateway.delete({ where: { id } });
}
export async function listGateways() {
    const gateways = await prisma.gateway.findMany({
        include: {
            devices: { include: { device_type: true } },
            tenant: true,
        },
    });
    return gateways;
}
export async function createGatewayLog(gatewayId, action, details) {
    // For now, we'll just log to console since we don't have a gateway_logs table
    // In a real application, you might want to create a separate logs table
    console.log(`Gateway Log: ${gatewayId} - ${action}`, details);
    // You could also store this in a separate logging service or table
    // For example:
    // return prisma.gatewayLog.create({
    //   data: {
    //     gateway_id: gatewayId,
    //     action,
    //     details: JSON.stringify(details),
    //     timestamp: new Date()
    //   }
    // });
}
//# sourceMappingURL=gateway.repository.js.map