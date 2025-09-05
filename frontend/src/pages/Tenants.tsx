import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantApi } from '../services/gateway.service';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { TenantForm } from '../components/forms/TenantForm';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Plus, Edit, Trash2, Building, Calendar } from 'lucide-react';
import type { Tenant, CreateTenantRequest, UpdateTenantRequest } from '../types';

export const Tenants: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [deletingTenant, setDeletingTenant] = useState<Tenant | null>(null);
  
  const queryClient = useQueryClient();

  // Fetch tenants
  const { data: tenants, isLoading, error } = useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      const response = await tenantApi.getAll();
      return response.data;
    },
  });

  // Create tenant mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateTenantRequest) => tenantApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      setIsCreateModalOpen(false);
    },
  });

  // Update tenant mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTenantRequest }) =>
      tenantApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      setEditingTenant(null);
    },
  });

  // Delete tenant mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => tenantApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      setDeletingTenant(null);
    },
  });

  const handleCreate = (data: CreateTenantRequest | UpdateTenantRequest) => {
    createMutation.mutate(data as CreateTenantRequest);
  };

  const handleUpdate = (data: CreateTenantRequest | UpdateTenantRequest) => {
    if (editingTenant) {
      updateMutation.mutate({ id: editingTenant.id, data: data as UpdateTenantRequest });
    }
  };

  const handleDelete = () => {
    if (deletingTenant) {
      deleteMutation.mutate(deletingTenant.id);
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
          <p className="text-red-800">Error loading tenants. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tenants</h1>
          <p className="text-gray-600">Manage your organization tenants</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Tenant
        </Button>
      </div>

      {/* Tenants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tenants?.map((tenant) => (
          <Card key={tenant.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">
                {tenant.name}
              </CardTitle>
              <Building className="h-5 w-5 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Contact Information</p>
                  <p className="text-sm font-medium">
                    {tenant.contact_info?.email || 'No email provided'}
                  </p>
                  <p className="text-sm">
                    {tenant.contact_info?.phone || 'No phone provided'}
                  </p>
                </div>
                
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="h-3 w-3 mr-1" />
                  Created {new Date(tenant.created_at).toLocaleDateString()}
                </div>

                <div className="flex items-center text-xs text-gray-500">
                  <Building className="h-3 w-3 mr-1" />
                  {tenant.gateways?.length || 0} gateways
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingTenant(tenant)}
                    className="flex items-center gap-1"
                  >
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setDeletingTenant(tenant)}
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
      {tenants?.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tenants found
            </h3>
            <p className="text-gray-600 mb-4">
              Get started by creating your first tenant
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Tenant
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Tenant"
      >
        <TenantForm
          onSubmit={handleCreate}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={createMutation.isPending}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingTenant}
        onClose={() => setEditingTenant(null)}
        title="Edit Tenant"
      >
        {editingTenant && (
          <TenantForm
            initialData={editingTenant}
            onSubmit={handleUpdate}
            onCancel={() => setEditingTenant(null)}
            isLoading={updateMutation.isPending}
          />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingTenant}
        onClose={() => setDeletingTenant(null)}
        onConfirm={handleDelete}
        title="Delete Tenant"
        message={`Are you sure you want to delete "${deletingTenant?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={deleteMutation.isPending}
        variant="danger"
      />
    </div>
  );
};
