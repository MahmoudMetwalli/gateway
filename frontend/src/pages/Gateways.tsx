import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Search, MapPin, Hash, Wifi, Clock, Settings, Link, Unlink } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { gatewayApi } from "@/services/gateway.service";
import { listTenants } from "@/services/tenant.service";
import { getOrphanDevices } from "@/services/device.service";
import type { Gateway, CreateGatewayRequest, Tenant, PeripheralDevice } from "@/types";
import { formatDate } from "@/utils/dateUtils";

export default function Gateways() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeviceManageDialogOpen, setIsDeviceManageDialogOpen] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState<Gateway | null>(null);
  const [editingGateway, setEditingGateway] = useState<Gateway | null>(null);
  const [newGateway, setNewGateway] = useState({
    serial_number: "",
    name: "",
    ipv4_address: "",
    location: "",
    tenant_id: ""
  });

  // Fetch gateways and tenants
  const { data: gatewaysResponse, isLoading: gatewaysLoading, error: gatewaysError } = useQuery({
    queryKey: ['gateways'],
    queryFn: () => gatewayApi.getAll(),
  });

  const { data: tenants = [] } = useQuery({
    queryKey: ['tenants'],
    queryFn: listTenants,
  });

  const { data: orphanDevices = [], refetch: refetchOrphanDevices } = useQuery({
    queryKey: ['orphan-devices'],
    queryFn: getOrphanDevices,
  });

  const gateways = gatewaysResponse?.data || [];

  // Get fresh gateway data when managing devices
  const freshSelectedGateway = selectedGateway 
    ? gateways.find(g => g.id === selectedGateway.id) || selectedGateway
    : null;

  // Create gateway mutation
  const createMutation = useMutation({
    mutationFn: gatewayApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gateways'] });
      setIsCreateDialogOpen(false);
      setNewGateway({
        serial_number: "",
        name: "",
        ipv4_address: "",
        location: "",
        tenant_id: ""
      });
    },
  });

  // Update gateway mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => gatewayApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gateways'] });
      setIsEditDialogOpen(false);
      setEditingGateway(null);
    },
  });

  // Delete gateway mutation
  const deleteMutation = useMutation({
    mutationFn: gatewayApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gateways'] });
    },
  });

  // Attach device mutation
  const attachDeviceMutation = useMutation({
    mutationFn: ({ gatewayId, deviceId }: { gatewayId: string; deviceId: string }) =>
      gatewayApi.attachDevice(gatewayId, { deviceId }),
    onSuccess: async () => {
      // Invalidate all related queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['gateways'] }),
        queryClient.invalidateQueries({ queryKey: ['orphan-devices'] }),
        queryClient.invalidateQueries({ queryKey: ['devices'] })
      ]);
      // Manually refetch to ensure immediate UI update
      await refetchOrphanDevices();
    },
  });

  // Detach device mutation
  const detachDeviceMutation = useMutation({
    mutationFn: ({ gatewayId, deviceId }: { gatewayId: string; deviceId: string }) =>
      gatewayApi.detachDevice(gatewayId, deviceId),
    onSuccess: async () => {
      // Invalidate all related queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['gateways'] }),
        queryClient.invalidateQueries({ queryKey: ['orphan-devices'] }),
        queryClient.invalidateQueries({ queryKey: ['devices'] })
      ]);
      // Manually refetch to ensure immediate UI update
      await refetchOrphanDevices();
    },
  });

  const filteredGateways = gateways.filter(gateway => {
    const matchesSearch = gateway.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gateway.serial_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gateway.ipv4_address.includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || gateway.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateGateway = () => {
    if (newGateway.serial_number && newGateway.name && newGateway.ipv4_address && newGateway.tenant_id) {
      createMutation.mutate(newGateway as CreateGatewayRequest);
    }
  };

  const handleEditGateway = (gateway: Gateway) => {
    setEditingGateway(gateway);
    setIsEditDialogOpen(true);
  };

  const handleUpdateGateway = () => {
    if (editingGateway) {
      updateMutation.mutate({
        id: editingGateway.id,
        data: {
          name: editingGateway.name,
          ipv4_address: editingGateway.ipv4_address,
          location: editingGateway.location,
          status: editingGateway.status,
        }
      });
    }
  };

  const handleDeleteGateway = (gatewayId: string) => {
    if (confirm('Are you sure you want to delete this gateway?')) {
      deleteMutation.mutate(gatewayId);
    }
  };

  const handleManageDevices = async (gateway: Gateway) => {
    setSelectedGateway(gateway);
    setIsDeviceManageDialogOpen(true);
    // Refresh data when opening the dialog
    await refetchOrphanDevices();
    await queryClient.refetchQueries({ queryKey: ['gateways'] });
  };

  const handleAttachDevice = (deviceId: string) => {
    if (selectedGateway) {
      attachDeviceMutation.mutate({
        gatewayId: selectedGateway.id,
        deviceId
      });
    }
  };

  const handleDetachDevice = (deviceId: string) => {
    if (selectedGateway) {
      detachDeviceMutation.mutate({
        gatewayId: selectedGateway.id,
        deviceId
      });
    }
  };

  // Remove the duplicate formatDate function since we're importing it
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gateways</h1>
          <p className="text-muted-foreground">
            Manage IoT gateways and their connections
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:bg-primary-dark">
              <Plus className="mr-2 h-4 w-4" />
              Add Gateway
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Gateway</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Gateway Name</Label>
                <Input 
                  id="name" 
                  placeholder="Gateway-NYC-01"
                  value={newGateway.name}
                  onChange={(e) => setNewGateway(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serial">Serial Number</Label>
                <Input 
                  id="serial" 
                  placeholder="GW001234567"
                  value={newGateway.serial_number}
                  onChange={(e) => setNewGateway(prev => ({ ...prev, serial_number: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ip">IPv4 Address</Label>
                <Input 
                  id="ip" 
                  placeholder="192.168.1.100"
                  value={newGateway.ipv4_address}
                  onChange={(e) => setNewGateway(prev => ({ ...prev, ipv4_address: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  placeholder="New York Office - Floor 1"
                  value={newGateway.location}
                  onChange={(e) => setNewGateway(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tenant">Tenant</Label>
                <Select value={newGateway.tenant_id} onValueChange={(value) => setNewGateway(prev => ({ ...prev, tenant_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tenant" />
                  </SelectTrigger>
                  <SelectContent>
                    {tenants.map((tenant) => (
                      <SelectItem key={tenant.id} value={tenant.id}>
                        {tenant.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  className="bg-gradient-primary"
                  onClick={handleCreateGateway}
                  disabled={createMutation.isPending || !newGateway.serial_number || !newGateway.name || !newGateway.ipv4_address || !newGateway.tenant_id}
                >
                  {createMutation.isPending ? "Creating..." : "Create Gateway"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Gateway Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Gateway</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Gateway Name</Label>
              <Input 
                id="edit-name" 
                placeholder="Gateway-NYC-01"
                value={editingGateway?.name || ""}
                onChange={(e) => setEditingGateway(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-serial">Serial Number</Label>
              <Input 
                id="edit-serial" 
                placeholder="GW001234567"
                value={editingGateway?.serial_number || ""}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">Serial number cannot be changed</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-ip">IPv4 Address</Label>
              <Input 
                id="edit-ip" 
                placeholder="192.168.1.100"
                value={editingGateway?.ipv4_address || ""}
                onChange={(e) => setEditingGateway(prev => prev ? ({ ...prev, ipv4_address: e.target.value }) : null)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-location">Location</Label>
              <Input 
                id="edit-location" 
                placeholder="New York Office - Floor 1"
                value={editingGateway?.location || ""}
                onChange={(e) => setEditingGateway(prev => prev ? ({ ...prev, location: e.target.value }) : null)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select 
                value={editingGateway?.status || "ACTIVE"} 
                onValueChange={(value) => setEditingGateway(prev => prev ? ({ ...prev, status: value as any }) : null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="DECOMMISSIONED">Decommissioned</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-gradient-primary"
                onClick={handleUpdateGateway}
                disabled={updateMutation.isPending || !editingGateway?.name || !editingGateway?.ipv4_address}
              >
                {updateMutation.isPending ? "Updating..." : "Update Gateway"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between space-y-2">
            <CardTitle>All Gateways</CardTitle>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search gateways..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="DECOMMISSIONED">Decommissioned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {gatewaysLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-muted-foreground">Loading gateways...</div>
            </div>
          ) : gatewaysError ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-destructive">Error loading gateways: {gatewaysError.message}</div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Gateway</TableHead>
                  <TableHead>Network</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Devices</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGateways.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {searchTerm || statusFilter !== "all" 
                        ? 'No gateways found matching your filters.' 
                        : 'No gateways found. Create your first gateway to get started.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredGateways.map((gateway) => (
                    <TableRow key={gateway.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                        <Wifi className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{gateway.name}</p>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <Hash className="h-3 w-3" />
                          <span>{gateway.serial_number}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge variant="outline" className="font-mono text-xs">
                        {gateway.ipv4_address}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{gateway.location || "Not specified"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge 
                      variant={gateway.status.toLowerCase() as any}
                    >
                      {gateway.status}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {gateway.devices?.length || 0} connected
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{formatDate(gateway.updated_at)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleManageDevices(gateway)}
                      >
                        <Settings className="h-4 w-4 mr-1" />
                        Devices
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditGateway(gateway)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteGateway(gateway.id)}
                        disabled={deleteMutation.isPending}
                      >
                        {deleteMutation.isPending ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Device Management Dialog */}
      <Dialog open={isDeviceManageDialogOpen} onOpenChange={setIsDeviceManageDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Manage Devices - {freshSelectedGateway?.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Connected Devices */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Connected Devices</h3>
              {freshSelectedGateway?.devices && freshSelectedGateway.devices.length > 0 ? (
                <div className="space-y-2">
                  {freshSelectedGateway.devices.map((device) => (
                    <div key={device.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded bg-gradient-primary flex items-center justify-center">
                          <Hash className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{device.uid}</p>
                          <p className="text-sm text-muted-foreground">{device.vendor}</p>
                        </div>
                        <Badge variant="outline">{device.device_type?.name}</Badge>
                        <StatusBadge variant={device.status.toLowerCase() as any}>
                          {device.status}
                        </StatusBadge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDetachDevice(device.id)}
                        disabled={detachDeviceMutation.isPending}
                      >
                        <Unlink className="h-4 w-4 mr-1" />
                        Detach
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No devices connected to this gateway
                </p>
              )}
            </div>

            {/* Available Devices */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Available Devices</h3>
              {orphanDevices.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {orphanDevices.map((device) => (
                    <div key={device.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded bg-secondary flex items-center justify-center">
                          <Hash className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">{device.uid}</p>
                          <p className="text-sm text-muted-foreground">{device.vendor}</p>
                        </div>
                        <Badge variant="outline">{device.device_type?.name}</Badge>
                        <StatusBadge variant={device.status.toLowerCase() as any}>
                          {device.status}
                        </StatusBadge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAttachDevice(device.id)}
                        disabled={attachDeviceMutation.isPending}
                      >
                        <Link className="h-4 w-4 mr-1" />
                        Attach
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No unassigned devices available
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setIsDeviceManageDialogOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}