import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gatewayApi, tenantApi } from '../services/gateway.service';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { GatewayForm } from '../components/forms/GatewayForm';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Plus, Edit, Trash2, Server, MapPin, Wifi, WifiOff, Wrench } from 'lucide-react';
import type { Gateway, CreateGatewayRequest, UpdateGatewayRequest } from '../types';

export const Gateways: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingGateway, setEditingGateway] = useState<Gateway | null>(null);
  const [deletingGateway, setDeletingGateway] = useState<Gateway | null>(null);
  
  const queryClient = useQueryClient();

  // Fetch gateways
  const { data: gateways, isLoading, error } = useQuery({
    queryKey: ['gateways'],
    queryFn: async () => {
      const response = await gatewayApi.getAll();
      return response.data;
    },
  });

  // Fetch tenants for the form
  const { data: tenants } = useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      const response = await tenantApi.getAll();
      return response.data;
    },
  });

  // Create gateway mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateGatewayRequest) => gatewayApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gateways'] });
      setIsCreateModalOpen(false);
    },
  });

  // Update gateway mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGatewayRequest }) =>
      gatewayApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gateways'] });
      setEditingGateway(null);
    },
  });

  // Delete gateway mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => gatewayApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gateways'] });
      setDeletingGateway(null);
    },
  });

  const handleCreate = (data: CreateGatewayRequest | UpdateGatewayRequest) => {
    createMutation.mutate(data as CreateGatewayRequest);
  };

  const handleUpdate = (data: CreateGatewayRequest | UpdateGatewayRequest) => {
    if (editingGateway) {
      updateMutation.mutate({ id: editingGateway.id, data: data as UpdateGatewayRequest });
    }
  };

  const handleDelete = () => {
    if (deletingGateway) {
      deleteMutation.mutate(deletingGateway.id);
    }
  };

  const getStatusIcon = (status: Gateway['status']) => {
    switch (status) {
      case 'ACTIVE':
        return <Wifi className="h-4 w-4 text-green-500" />;
      case 'INACTIVE':
        return <WifiOff className="h-4 w-4 text-gray-500" />;
      case 'DECOMMISSIONED':
        return <Wrench className="h-4 w-4 text-red-500" />;
      default:
        return <WifiOff className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Gateway['status']) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800';
      case 'DECOMMISSIONED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
          <p className="text-red-800">Error loading gateways. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gateways</h1>
          <p className="text-gray-600">Manage your IoT gateways</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Gateway
        </Button>
      </div>

      {/* Gateways Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gateways?.map((gateway) => (
          <Card key={gateway.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">
                {gateway.name}
              </CardTitle>
              <div className="flex items-center gap-2">
                {getStatusIcon(gateway.status)}
                <Server className="h-5 w-5 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(gateway.status)}`}>
                    {gateway.status}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Serial Number</p>
                  <p className="text-sm font-medium font-mono">{gateway.serial_number}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">IP Address</p>
                  <p className="text-sm font-medium font-mono">{gateway.ipv4_address}</p>
                </div>

                {gateway.location && (
                  <div className="flex items-start gap-1">
                    <MapPin className="h-3 w-3 text-gray-400 mt-0.5" />
                    <p className="text-sm text-gray-600">{gateway.location}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-600">Tenant</p>
                  <p className="text-sm font-medium">{gateway.tenant?.name || 'Unknown'}</p>
                </div>

                <div className="text-xs text-gray-500">
                  {gateway.devices?.length || 0} devices connected
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingGateway(gateway)}
                    className="flex items-center gap-1"
                  >
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setDeletingGateway(gateway)}
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
      {gateways?.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Server className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No gateways found
            </h3>
            <p className="text-gray-600 mb-4">
              Get started by adding your first gateway
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Gateway
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Gateway"
        size="lg"
      >
        <GatewayForm
          tenants={tenants || []}
          onSubmit={handleCreate}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={createMutation.isPending}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingGateway}
        onClose={() => setEditingGateway(null)}
        title="Edit Gateway"
        size="lg"
      >
        {editingGateway && (
          <GatewayForm
            initialData={editingGateway}
            tenants={tenants || []}
            onSubmit={handleUpdate}
            onCancel={() => setEditingGateway(null)}
            isLoading={updateMutation.isPending}
          />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingGateway}
        onClose={() => setDeletingGateway(null)}
        onConfirm={handleDelete}
        title="Delete Gateway"
        message={`Are you sure you want to delete "${deletingGateway?.name}"? This action cannot be undone and will disconnect all associated devices.`}
        confirmText="Delete"
        isLoading={deleteMutation.isPending}
        variant="danger"
      />
    </div>
  );
};
