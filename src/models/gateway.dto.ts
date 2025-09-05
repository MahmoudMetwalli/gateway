import type { PeripheralDeviceDTO } from './device.dto';
import type { TenantDTO } from './tenant.dto';
import type { Gateway } from '@prisma/client';
type GatewayDTO = {
  id: string;
  serial_number: string;
  name: string;
  ipv4_address: string;
  created_at: Date;
  updated_at: Date;
  devices: PeripheralDeviceDTO[];
  tenant: TenantDTO;
};

export type { GatewayDTO };