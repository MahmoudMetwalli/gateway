import api from './api';
import type { DeviceType, CreateDeviceTypeRequest, UpdateDeviceTypeRequest } from '../types';

export const listDeviceTypes = async (): Promise<DeviceType[]> => {
    const { data } = await api.get<DeviceType[]>('/device-types');
    return data;
};

export const getDeviceTypeById = async (id: number): Promise<DeviceType> => {
    const { data } = await api.get<DeviceType>(`/device-types/${id}`);
    return data;
};

export const createDeviceType = async (deviceType: CreateDeviceTypeRequest): Promise<DeviceType> => {
    const { data } = await api.post<DeviceType>('/device-types', deviceType);
    return data;
};

export const updateDeviceType = async (id: number, deviceType: UpdateDeviceTypeRequest): Promise<DeviceType> => {
    const { data } = await api.put<DeviceType>(`/device-types/${id}`, deviceType);
    return data;
};

export const deleteDeviceType = async (id: number): Promise<void> => {
    await api.delete(`/device-types/${id}`);
};
