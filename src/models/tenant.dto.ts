import type { GatewayDTO } from "./gateway.dto";

type TenantDTO = {
  id: string;
  name: string;
  contact_email: string;
  created_at: Date;
  gateways: GatewayDTO[];
};

export type { TenantDTO };