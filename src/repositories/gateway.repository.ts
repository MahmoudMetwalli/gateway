import { prisma } from "../config";
import { Prisma } from "@prisma/client";

export async function serialNumberExists(
  serialNumber: string
): Promise<boolean> {
  const gateway = await prisma.gateway.findUnique({
    where: { serial_number: serialNumber },
  });
  return !!gateway;
}

export async function ipv4AddressExists(ipv4Address: string): Promise<boolean> {
  const gateway = await prisma.gateway.findUnique({
    where: { ipv4_address: ipv4Address },
  });
  return !!gateway;
}

export async function createGateway(data: Prisma.GatewayCreateInput) {
  const gateway = await prisma.gateway.create({
    data,
    include: {
      devices: { include: { device_type: true } },
      tenant: true,
    },
  });
  return gateway;
}

export async function getGatewayById(id: string) {
  const gateway = await prisma.gateway.findUnique({
    where: { id },
    include: {
      devices: { include: { device_type: true } },
      tenant: true,
    },
  });
  return gateway;
}

export async function updateGateway(
  id: string,
  data: Prisma.GatewayUpdateInput
) {
  const gateway = await prisma.gateway.update({
    where: { id },
    data,
    include: {
      devices: { include: { device_type: true } },
      tenant: true,
    },
  });
  return gateway;
}

export async function deleteGateway(id: string) {
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

export async function createGatewayLog(
  gatewayId: string,
  action: string,
  details: Record<string, any>
) {
  await prisma.gatewayLog.create({
    data: {
      gateway_id: gatewayId,
      action,
      details: JSON.stringify(details),
    },
  });
}
