import { prisma } from  "../config";

export async function createGateway(data: any) {
  const gateway = await prisma.gateway.create({ data });
  return gateway;
}

export async function getGatewayById(id: string) {
  const gateway = await prisma.gateway.findUnique({
    where: { id },
    include: {
      devices: { include: { device_type: true } },
      tenant: { include: { gateways: true } },
    },
  });
  return gateway;
}

export async function updateGateway(id: string, data: any) {
  const gateway = await prisma.gateway.update({ where: { id }, data });
  return gateway;
}

export async function deleteGateway(id: string) {
  return prisma.gateway.delete({ where: { id } });
}

export async function listGateways() {
  const gateways = await prisma.gateway.findMany({
    include: {
      devices: { include: { device_type: true } },
      tenant: { include: { gateways: true } },
    },
  });
  return gateways;
}
