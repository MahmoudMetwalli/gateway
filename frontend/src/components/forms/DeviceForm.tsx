import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../ui/Button';
import type { PeripheralDevice, CreateDeviceRequest, UpdateDeviceRequest, Gateway, DeviceType } from '../../types';

interface DeviceFormProps {
  initialData?: PeripheralDevice;
  gateways: Gateway[];
  onSubmit: (data: CreateDeviceRequest | UpdateDeviceRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const DeviceForm: React.FC<DeviceFormProps> = ({
  initialData,
  gateways,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    uid: initialData?.uid || '',
    vendor: initialData?.vendor || '',
    status: initialData?.status || 'OFFLINE',
    device_type_id: initialData?.device_type_id || 0,
    gateway_id: initialData?.gateway_id || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch device types
  const { data: deviceTypes } = useQuery({
    queryKey: ['device-types'],
    queryFn: async () => {
      // This would need to be implemented in the API service
      // For now, we'll use mock data
      return [
        { id: 1, name: 'Temperature Sensor', description: 'Measures ambient temperature' },
        { id: 2, name: 'Humidity Sensor', description: 'Measures humidity levels' },
        { id: 3, name: 'Motion Detector', description: 'Detects motion and movement' },
        { id: 4, name: 'Light Sensor', description: 'Measures light intensity' },
        { id: 5, name: 'Pressure Sensor', description: 'Measures atmospheric pressure' },
      ] as DeviceType[];
    },
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        uid: initialData.uid,
        vendor: initialData.vendor,
        status: initialData.status,
        device_type_id: initialData.device_type_id,
        gateway_id: initialData.gateway_id || '',
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.uid.trim()) {
      newErrors.uid = 'Device UID is required';
    }

    if (!formData.vendor.trim()) {
      newErrors.vendor = 'Vendor is required';
    }

    if (formData.device_type_id === 0) {
      newErrors.device_type_id = 'Please select a device type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const submitData = {
        ...formData,
        gateway_id: formData.gateway_id || undefined,
      };
      
      if (initialData) {
        // For updates, we don't send the UID
        const { uid, ...updateData } = submitData;
        onSubmit(updateData);
      } else {
        onSubmit(submitData);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'device_type_id' ? parseInt(value, 10) : value 
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="uid" className="block text-sm font-medium text-gray-700 mb-1">
          Device UID *
        </label>
        <input
          type="text"
          id="uid"
          name="uid"
          value={formData.uid}
          onChange={handleChange}
          disabled={!!initialData} // UID should not be editable for existing devices
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono ${
            errors.uid ? 'border-red-300' : 'border-gray-300'
          } ${initialData ? 'bg-gray-50 text-gray-500' : ''}`}
          placeholder="Enter unique device identifier"
        />
        {errors.uid && <p className="mt-1 text-sm text-red-600">{errors.uid}</p>}
        {initialData && (
          <p className="mt-1 text-xs text-gray-500">UID cannot be modified for existing devices</p>
        )}
      </div>

      <div>
        <label htmlFor="vendor" className="block text-sm font-medium text-gray-700 mb-1">
          Vendor *
        </label>
        <input
          type="text"
          id="vendor"
          name="vendor"
          value={formData.vendor}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.vendor ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Enter device vendor"
        />
        {errors.vendor && <p className="mt-1 text-sm text-red-600">{errors.vendor}</p>}
      </div>

      <div>
        <label htmlFor="device_type_id" className="block text-sm font-medium text-gray-700 mb-1">
          Device Type *
        </label>
        <select
          id="device_type_id"
          name="device_type_id"
          value={formData.device_type_id}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.device_type_id ? 'border-red-300' : 'border-gray-300'
          }`}
        >
          <option value={0}>Select a device type</option>
          {deviceTypes?.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
        {errors.device_type_id && <p className="mt-1 text-sm text-red-600">{errors.device_type_id}</p>}
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
          Status *
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="ONLINE">Online</option>
          <option value="OFFLINE">Offline</option>
          <option value="MAINTENANCE">Maintenance</option>
        </select>
      </div>

      <div>
        <label htmlFor="gateway_id" className="block text-sm font-medium text-gray-700 mb-1">
          Gateway (Optional)
        </label>
        <select
          id="gateway_id"
          name="gateway_id"
          value={formData.gateway_id}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">No gateway assigned</option>
          {gateways
            .filter(gateway => gateway.status === 'ACTIVE')
            .map((gateway) => (
              <option key={gateway.id} value={gateway.id}>
                {gateway.name} ({gateway.ipv4_address})
              </option>
            ))}
        </select>
        <p className="mt-1 text-xs text-gray-500">
          Only active gateways are available for assignment
        </p>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : initialData ? 'Update Device' : 'Create Device'}
        </Button>
      </div>
    </form>
  );
};
