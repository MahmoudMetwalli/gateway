import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deviceApi, gatewayApi } from '../services/gateway.service';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { DeviceForm } from '../components/forms/DeviceForm';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Plus, Edit, Trash2, Smartphone, Activity, AlertCircle, CheckCircle, XCircle, Unplug } from 'lucide-react';
import type { PeripheralDevice, CreateDeviceRequest, UpdateDeviceRequest } from '../types';

export const Devices: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<PeripheralDevice | null>(null);
  const [deletingDevice, setDeletingDevice] = useState<PeripheralDevice | null>(null);
  
  const queryClient = useQueryClient();

  // Fetch devices
  const { data: devices, isLoading, error } = useQuery({
    queryKey: ['devices'],
    queryFn: async () => {
      const response = await deviceApi.getAll();
      return response.data;
    },
  });

  // Fetch gateways for the form
  const { data: gateways } = useQuery({
    queryKey: ['gateways'],
    queryFn: async () => {
      const response = await gatewayApi.getAll();
      return response.data;
    },
  });

  // Create device mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateDeviceRequest) => deviceApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      setIsCreateModalOpen(false);
    },
  });

  // Update device mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDeviceRequest }) =>
      deviceApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      setEditingDevice(null);
    },
  });

  // Delete device mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deviceApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      setDeletingDevice(null);
    },
  });

  const handleCreate = (data: CreateDeviceRequest | UpdateDeviceRequest) => {
    createMutation.mutate(data as CreateDeviceRequest);
  };

  const handleUpdate = (data: CreateDeviceRequest | UpdateDeviceRequest) => {
    if (editingDevice) {
      updateMutation.mutate({ id: editingDevice.id, data: data as UpdateDeviceRequest });
    }
  };

  const handleDelete = () => {
    if (deletingDevice) {
      deleteMutation.mutate(deletingDevice.id);
    }
  };

  const getStatusIcon = (status: PeripheralDevice['status']) => {
    switch (status) {
      case 'ONLINE':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'OFFLINE':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'MAINTENANCE':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: PeripheralDevice['status']) => {
    switch (status) {
      case 'ONLINE':
        return 'bg-green-100 text-green-800';
      case 'OFFLINE':
        return 'bg-red-100 text-red-800';
      case 'MAINTENANCE':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatLastSeen = (lastSeen: string | null) => {
    if (!lastSeen) return 'Never';
    
    const date = new Date(lastSeen);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">Error loading devices. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Devices</h1>
          <p className="text-gray-600">Manage your IoT devices</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Device
        </Button>
      </div>

      {/* Devices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices?.map((device) => (
          <Card key={device.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">
                {device.device_type?.name || 'Unknown Device'}
              </CardTitle>
              <div className="flex items-center gap-2">
                {getStatusIcon(device.status)}
                <Smartphone className="h-5 w-5 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(device.status)}`}>
                    {device.status}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Device UID</p>
                  <p className="text-sm font-medium font-mono">{device.uid}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Vendor</p>
                  <p className="text-sm font-medium">{device.vendor}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="text-sm font-medium">{device.device_type?.name || 'Unknown'}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Gateway</p>
                  <div className="flex items-center gap-1">
                    {device.gateway ? (
                      <p className="text-sm font-medium">{device.gateway.name}</p>
                    ) : (
                      <div className="flex items-center gap-1 text-orange-600">
                        <Unplug className="h-3 w-3" />
                        <p className="text-sm font-medium">Unassigned</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-1">
                  <Activity className="h-3 w-3 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-600">Last Seen</p>
                    <p className="text-xs font-medium">{formatLastSeen(device.last_seen_at || null)}</p>
                  </div>
                </div>

                {device.device_type?.description && (
                  <div>
                    <p className="text-sm text-gray-600">Description</p>
                    <p className="text-sm text-gray-800 line-clamp-2">{device.device_type.description}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingDevice(device)}
                    className="flex items-center gap-1"
                  >
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setDeletingDevice(device)}
                    className="flex items-center gap-1"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {devices?.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Smartphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No devices found
            </h3>
            <p className="text-gray-600 mb-4">
              Get started by adding your first device
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Device
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Device"
        size="lg"
      >
        <DeviceForm
          gateways={gateways || []}
          onSubmit={handleCreate}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={createMutation.isPending}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingDevice}
        onClose={() => setEditingDevice(null)}
        title="Edit Device"
        size="lg"
      >
        {editingDevice && (
          <DeviceForm
            initialData={editingDevice}
            gateways={gateways || []}
            onSubmit={handleUpdate}
            onCancel={() => setEditingDevice(null)}
            isLoading={updateMutation.isPending}
          />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingDevice}
        onClose={() => setDeletingDevice(null)}
        onConfirm={handleDelete}
        title="Delete Device"
        message={`Are you sure you want to delete device "${deletingDevice?.uid}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={deleteMutation.isPending}
        variant="danger"
      />
    </div>
  );
};
