import type { GatewayDTO } from "./gateway.dto.ts";
import type { DeviceTypeDTO } from "./deviceType.dto.ts";

enum DeviceStatus {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
  MAINTENANCE = "MAINTENANCE"
}

type PeripheralDeviceDTO = {
  id: string;
  uid: bigint;
  vendor: string;
  status: DeviceStatus;
  created_at: Date;
  last_seen?: Date;
  gateway?: GatewayDTO;
  device_type: DeviceTypeDTO;
};

export type { PeripheralDeviceDTO };
