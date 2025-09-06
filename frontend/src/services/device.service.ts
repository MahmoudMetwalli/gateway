import api from './api';
import type { PeripheralDevice, CreateDeviceRequest, UpdateDeviceRequest } from '../types';

export const listDevices = async (): Promise<PeripheralDevice[]> => {
    const { data } = await api.get<PeripheralDevice[]>('/devices');
    return data;
};

export const getDeviceById = async (id: string): Promise<PeripheralDevice> => {
    const { data } = await api.get<PeripheralDevice>(`/devices/${id}`);
    return data;
};

export const createDevice = async (device: CreateDeviceRequest): Promise<PeripheralDevice> => {
    const { data } = await api.post<PeripheralDevice>('/devices', device);
    return data;
};

export const updateDevice = async (id: string, device: UpdateDeviceRequest): Promise<PeripheralDevice> => {
    const { data } = await api.patch<PeripheralDevice>(`/devices/${id}`, device);
    return data;
};

export const deleteDevice = async (id: string): Promise<void> => {
    await api.delete(`/devices/${id}`);
};

export const getOrphanDevices = async (): Promise<PeripheralDevice[]> => {
    const { data } = await api.get<PeripheralDevice[]>('/devices/orphans');
    return data;
};
