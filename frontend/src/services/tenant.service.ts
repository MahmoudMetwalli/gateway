import api from './api';
import type { Tenant, CreateTenantRequest, UpdateTenantRequest } from '../types';

export const listTenants = async (): Promise<Tenant[]> => {
    const { data } = await api.get<Tenant[]>('/tenants');
    return data;
};

export const getTenantById = async (id: string): Promise<Tenant> => {
    const { data } = await api.get<Tenant>(`/tenants/${id}`);
    return data;
};

export const createTenant = async (tenant: CreateTenantRequest): Promise<Tenant> => {
    const { data } = await api.post<Tenant>('/tenants', tenant);
    return data;
};

export const updateTenant = async (id: string, tenant: UpdateTenantRequest): Promise<Tenant> => {
    const { data } = await api.put<Tenant>(`/tenants/${id}`, tenant);
    return data;
};

export const deleteTenant = async (id: string): Promise<void> => {
    await api.delete(`/tenants/${id}`);
};
