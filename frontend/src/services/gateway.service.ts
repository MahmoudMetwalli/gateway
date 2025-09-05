import api from './api';
import type {
  Tenant,
  CreateTenantRequest,
  UpdateTenantRequest,
  Gateway,
  CreateGatewayRequest,
  UpdateGatewayRequest,
  PeripheralDevice,
  CreateDeviceRequest,
  UpdateDeviceRequest,
  DeviceType,
} from '../types';

// Add the missing interface
interface AttachDeviceRequest {
  deviceId: string;
}

// Tenant API
export const tenantApi = {
  getAll: () => api.get<Tenant[]>('/tenants'),
  getById: (id: string) => api.get<Tenant>(`/tenants/${id}`),
  create: (data: CreateTenantRequest) => api.post<Tenant>('/tenants', data),
  update: (id: string, data: UpdateTenantRequest) => 
    api.put<Tenant>(`/tenants/${id}`, data),
  delete: (id: string) => api.delete(`/tenants/${id}`),
};

// Gateway API
export const gatewayApi = {
  getAll: () => api.get<Gateway[]>('/gateways'),
  getById: (id: string) => api.get<Gateway>(`/gateways/${id}`),
  create: (data: CreateGatewayRequest) => api.post<Gateway>('/gateways', data),
  update: (id: string, data: UpdateGatewayRequest) => 
    api.put<Gateway>(`/gateways/${id}`, data),
  delete: (id: string) => api.delete(`/gateways/${id}`),
  attachDevice: (gatewayId: string, data: AttachDeviceRequest) =>
    api.post<PeripheralDevice>(`/gateways/${gatewayId}/devices`, data),
  detachDevice: (gatewayId: string, deviceId: string) =>
    api.delete(`/gateways/${gatewayId}/devices/${deviceId}`),
};

// Device API
export const deviceApi = {
  getAll: () => api.get<PeripheralDevice[]>('/devices'),
  getById: (id: string) => api.get<PeripheralDevice>(`/devices/${id}`),
  create: (data: CreateDeviceRequest) => api.post<PeripheralDevice>('/devices', data),
  update: (id: string, data: UpdateDeviceRequest) => 
    api.put<PeripheralDevice>(`/devices/${id}`, data),
  delete: (id: string) => api.delete(`/devices/${id}`),
  getOrphans: () => api.get<PeripheralDevice[]>('/devices/orphans'),
};

// Device Type API (if needed in the future)
export const deviceTypeApi = {
  getAll: () => api.get<DeviceType[]>('/device-types'),
  getById: (id: number) => api.get<DeviceType>(`/device-types/${id}`),
  create: (data: { name: string; description?: string }) => 
    api.post<DeviceType>('/device-types', data),
  update: (id: number, data: { name?: string; description?: string }) => 
    api.put<DeviceType>(`/device-types/${id}`, data),
  delete: (id: number) => api.delete(`/device-types/${id}`),
};
