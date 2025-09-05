import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import type { Tenant, CreateTenantRequest, UpdateTenantRequest } from '../../types';

interface TenantFormProps {
  initialData?: Tenant;
  onSubmit: (data: CreateTenantRequest | UpdateTenantRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const TenantForm: React.FC<TenantFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    contact_info: {
      email: initialData?.contact_info?.email || '',
      phone: initialData?.contact_info?.phone || '',
      address: initialData?.contact_info?.address || '',
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        contact_info: {
          email: initialData.contact_info?.email || '',
          phone: initialData.contact_info?.phone || '',
          address: initialData.contact_info?.address || '',
        },
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tenant name is required';
    }

    if (formData.contact_info.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_info.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const submitData = {
        name: formData.name,
        contact_info: {
          ...formData.contact_info,
        },
      };
      onSubmit(submitData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('contact_info.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        contact_info: {
          ...prev.contact_info,
          [field]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    const errorKey = name.includes('.') ? name.split('.')[1] : name;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Tenant Name *
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
          placeholder="Enter tenant name"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
        
        <div>
          <label htmlFor="contact_info.email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="contact_info.email"
            name="contact_info.email"
            value={formData.contact_info.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="contact@example.com"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="contact_info.phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            id="contact_info.phone"
            name="contact_info.phone"
            value={formData.contact_info.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div>
          <label htmlFor="contact_info.address" className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <textarea
            id="contact_info.address"
            name="contact_info.address"
            value={formData.contact_info.address}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter address"
          />
        </div>
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
          {isLoading ? 'Saving...' : initialData ? 'Update Tenant' : 'Create Tenant'}
        </Button>
      </div>
    </form>
  );
};
