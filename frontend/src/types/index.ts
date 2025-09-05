export interface Tenant {
  id: string;
  name: string;
  contact_email: string;
  created_at: string;
  gateways?: Gateway[];
}

export interface Gateway {
  id: string;
  serial_number: string;
  name: string;
  ipv4_address: string;
  location?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DECOMMISSIONED';
  created_at: string;
  updated_at: string;
  tenant_id: string;
  devices?: PeripheralDevice[];
  tenant?: Tenant;
}

export interface PeripheralDevice {
  id: string;
  uid: string;
  vendor: string;
  status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE';
  device_type_id: number;
  gateway_id?: string;
  last_seen_at?: string;
  created_at: string;
  device_type?: DeviceType;
  gateway?: Gateway;
}

export interface DeviceType {
  id: number;
  name: string;
  description: string;
  devices?: PeripheralDevice[];
}

export interface CreateTenantRequest {
  name: string;
  contact_email: string;
}

export interface UpdateTenantRequest {
  name?: string;
  contact_email?: string;
}

export interface CreateGatewayRequest {
  serial_number: string;
  name: string;
  ipv4_address: string;
  status: Gateway['status'];
  location?: string;
  tenant_id: string;
}

export interface UpdateGatewayRequest {
  name?: string;
  ipv4_address?: string;
  status?: Gateway['status'];
  location?: string;
}

export interface CreateDeviceRequest {
  uid: string;
  vendor: string;
  status: PeripheralDevice['status'];
  device_type_id: number;
  gateway_id?: string;
}

export interface UpdateDeviceRequest {
  vendor?: string;
  status?: PeripheralDevice['status'];
  last_seen_at?: string;
  device_type_id?: number;
}

export interface CreateDeviceTypeRequest {
  name: string;
  description: string;
}

export interface UpdateDeviceTypeRequest {
  name?: string;
  description?: string;
}

export interface GatewayLog {
  id: string;
  gateway_id: string;
  action: string;
  details: string;
  created_at: string;
  gateway?: {
    id: string;
    name: string;
    serial_number: string;
    tenant?: {
      id: string;
      name: string;
    };
  } | null;
}