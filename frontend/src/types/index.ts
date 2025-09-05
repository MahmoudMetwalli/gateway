// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Tenant Types
export interface Tenant {
  id: string;
  name: string;
  contact_info: Record<string, any>;
  created_at: string;
  updated_at: string;
  gateways?: Gateway[];
}

export interface CreateTenantRequest {
  name: string;
  contact_info: Record<string, any>;
}

export interface UpdateTenantRequest {
  name?: string;
  contact_info?: Record<string, any>;
}

// Gateway Types
export type GatewayStatus = 'ACTIVE' | 'INACTIVE' | 'DECOMMISSIONED';

export interface Gateway {
  id: string;
  name: string;
  status: GatewayStatus;
  serial_number: string;
  ipv4_address: string;
  location?: string;
  tenant_id: string;
  created_at: string;
  updated_at: string;
  tenant?: Tenant;
  devices?: PeripheralDevice[];
}

export interface CreateGatewayRequest {
  name: string;
  status: GatewayStatus;
  serial_number: string;
  ipv4_address: string;
  location?: string;
  tenant_id: string;
}

export interface UpdateGatewayRequest {
  name?: string;
  status?: GatewayStatus;
  ipv4_address?: string;
  location?: string;
}

// Device Types
export type DeviceStatus = 'ONLINE' | 'OFFLINE' | 'MAINTENANCE';

export interface DeviceType {
  id: number;
  name: string;
  description?: string;
}

export interface PeripheralDevice {
  id: string;
  uid: string;
  vendor: string;
  status: DeviceStatus;
  device_type_id: number;
  gateway_id?: string;
  last_seen_at?: string;
  created_at: string;
  updated_at: string;
  device_type?: DeviceType;
  gateway?: Gateway;
}

export interface CreateDeviceRequest {
  uid: string;
  vendor: string;
  status: DeviceStatus;
  device_type_id: number;
  gateway_id?: string;
}

export interface UpdateDeviceRequest {
  vendor?: string;
  status?: DeviceStatus;
  device_type_id?: number;
  last_seen_at?: string;
}

export interface AttachDeviceRequest {
  deviceId: string;
}

// UI State Types
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
}

export interface FilterState {
  search?: string;
  status?: string;
  tenant_id?: string;
}
