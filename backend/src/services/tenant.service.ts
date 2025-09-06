import { prisma } from  "../config/database.js";
import { Prisma } from "@prisma/client";

export async function createTenant(data: Prisma.TenantCreateInput) {
  const tenant = await prisma.tenant.create({ data });
  return tenant;
}

export async function getTenantById(id: string) {
  const tenant = await prisma.tenant.findUnique({
    where: { id },
    include: { gateways: { include: { devices: { include: { device_type: true } } } } },
  });
  return tenant;
}

export async function updateTenant(id: string, data: Prisma.TenantUpdateInput) {
  const tenant = await prisma.tenant.update({ where: { id }, data });
  return tenant;
}

export async function deleteTenant(id: string) {
  return prisma.tenant.delete({ where: { id } });
}

export async function listTenants() {
  const tenants = await prisma.tenant.findMany({
    include: { gateways: { include: { devices: { include: { device_type: true } } } } },
  });
  return tenants;
}
