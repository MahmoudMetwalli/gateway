import type { PeripheralDeviceDTO } from './device.dto';

type DeviceTypeDTO = {
  id: number;
  name: string;
  description: string;
  devices: PeripheralDeviceDTO[];
};

export type { DeviceTypeDTO };
