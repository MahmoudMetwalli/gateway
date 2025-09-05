import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import type { Gateway, CreateGatewayRequest, UpdateGatewayRequest, Tenant } from '../../types';

interface GatewayFormProps {
  initialData?: Gateway;
  tenants: Tenant[];
  onSubmit: (data: CreateGatewayRequest | UpdateGatewayRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const GatewayForm: React.FC<GatewayFormProps> = ({
  initialData,
  tenants,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    serial_number: initialData?.serial_number || '',
    ipv4_address: initialData?.ipv4_address || '',
    location: initialData?.location || '',
    status: initialData?.status || 'ACTIVE',
    tenant_id: initialData?.tenant_id || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        serial_number: initialData.serial_number,
        ipv4_address: initialData.ipv4_address,
        location: initialData.location || '',
        status: initialData.status,
        tenant_id: initialData.tenant_id,
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Gateway name is required';
    }

    if (!formData.serial_number.trim()) {
      newErrors.serial_number = 'Serial number is required';
    }

    if (!formData.ipv4_address.trim()) {
      newErrors.ipv4_address = 'IP address is required';
    } else {
      // Basic IPv4 validation
      const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
      if (!ipv4Regex.test(formData.ipv4_address)) {
        newErrors.ipv4_address = 'Please enter a valid IPv4 address';
      } else {
        // Check if each octet is between 0-255
        const octets = formData.ipv4_address.split('.');
        const invalidOctet = octets.find(octet => {
          const num = parseInt(octet, 10);
          return isNaN(num) || num < 0 || num > 255;
        });
        if (invalidOctet) {
          newErrors.ipv4_address = 'Each octet must be between 0 and 255';
        }
      }
    }

    if (!formData.tenant_id) {
      newErrors.tenant_id = 'Please select a tenant';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const submitData = {
        ...formData,
        location: formData.location || undefined,
      };
      onSubmit(submitData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Gateway Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.name ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Enter gateway name"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="serial_number" className="block text-sm font-medium text-gray-700 mb-1">
          Serial Number *
        </label>
        <input
          type="text"
          id="serial_number"
          name="serial_number"
          value={formData.serial_number}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono ${
            errors.serial_number ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Enter serial number"
        />
        {errors.serial_number && <p className="mt-1 text-sm text-red-600">{errors.serial_number}</p>}
      </div>

      <div>
        <label htmlFor="ipv4_address" className="block text-sm font-medium text-gray-700 mb-1">
          IPv4 Address *
        </label>
        <input
          type="text"
          id="ipv4_address"
          name="ipv4_address"
          value={formData.ipv4_address}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono ${
            errors.ipv4_address ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="192.168.1.100"
        />
        {errors.ipv4_address && <p className="mt-1 text-sm text-red-600">{errors.ipv4_address}</p>}
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Building A, Floor 2, Room 201"
        />
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
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="DECOMMISSIONED">Decommissioned</option>
        </select>
      </div>

      <div>
        <label htmlFor="tenant_id" className="block text-sm font-medium text-gray-700 mb-1">
          Tenant *
        </label>
        <select
          id="tenant_id"
          name="tenant_id"
          value={formData.tenant_id}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.tenant_id ? 'border-red-300' : 'border-gray-300'
          }`}
        >
          <option value="">Select a tenant</option>
          {tenants.map((tenant) => (
            <option key={tenant.id} value={tenant.id}>
              {tenant.name}
            </option>
          ))}
        </select>
        {errors.tenant_id && <p className="mt-1 text-sm text-red-600">{errors.tenant_id}</p>}
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
          {isLoading ? 'Saving...' : initialData ? 'Update Gateway' : 'Create Gateway'}
        </Button>
      </div>
    </form>
  );
};
