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
import { Plus, Search, Smartphone, Hash, Clock, Server, Edit, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listDevices, createDevice, updateDevice, deleteDevice } from "@/services/device.service";
import { gatewayApi } from "@/services/gateway.service";
import { listDeviceTypes } from "@/services/deviceType.service";
import type { PeripheralDevice, CreateDeviceRequest, UpdateDeviceRequest, Gateway, DeviceType } from "@/types";
import { formatDate, formatDateTime } from "@/utils/dateUtils";

export default function Devices() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<PeripheralDevice | null>(null);
  const [newDevice, setNewDevice] = useState({
    uid: "",
    vendor: "",
    device_type_id: "",
    gateway_id: ""
  });

  // Fetch data from API
  const { data: devices = [], isLoading: devicesLoading, error: devicesError } = useQuery({
    queryKey: ['devices'],
    queryFn: listDevices,
  });

  const { data: gatewaysResponse } = useQuery({
    queryKey: ['gateways'],
    queryFn: () => gatewayApi.getAll(),
  });

  const { data: deviceTypes = [] } = useQuery({
    queryKey: ['device-types'],
    queryFn: listDeviceTypes,
  });

  const gateways = gatewaysResponse?.data || [];

  // Create device mutation
  const createMutation = useMutation({
    mutationFn: createDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      queryClient.invalidateQueries({ queryKey: ['gateways'] });
      queryClient.invalidateQueries({ queryKey: ['orphan-devices'] });
      setIsCreateDialogOpen(false);
      setNewDevice({
        uid: "",
        vendor: "",
        device_type_id: "",
        gateway_id: ""
      });
    },
  });

  // Update device mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, device }: { id: string; device: UpdateDeviceRequest }) => 
      updateDevice(id, device),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      queryClient.invalidateQueries({ queryKey: ['gateways'] });
      queryClient.invalidateQueries({ queryKey: ['orphan-devices'] });
      setIsEditDialogOpen(false);
      setEditingDevice(null);
    },
  });

  // Delete device mutation
  const deleteMutation = useMutation({
    mutationFn: deleteDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      queryClient.invalidateQueries({ queryKey: ['gateways'] });
      queryClient.invalidateQueries({ queryKey: ['orphan-devices'] });
    },
  });

  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.uid.includes(searchTerm) ||
                         device.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.device_type?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || device.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateDevice = () => {
    if (newDevice.uid && newDevice.vendor && newDevice.device_type_id) {
      createMutation.mutate({
        uid: newDevice.uid,
        vendor: newDevice.vendor,
        device_type_id: parseInt(newDevice.device_type_id),
        status: "ONLINE",
        ...(newDevice.gateway_id && { gateway_id: newDevice.gateway_id })
      });
    }
  };

  const handleEditDevice = (device: PeripheralDevice) => {
    setEditingDevice(device);
    setIsEditDialogOpen(true);
  };

  const handleUpdateDevice = () => {
    if (editingDevice) {
      updateMutation.mutate({
        id: editingDevice.id,
        device: {
          vendor: editingDevice.vendor,
          status: editingDevice.status,
          ...(editingDevice.gateway_id && { gateway_id: editingDevice.gateway_id })
        }
      });
    }
  };

  const handleDeleteDevice = (deviceId: string) => {
    if (confirm('Are you sure you want to delete this device?')) {
      deleteMutation.mutate(deviceId);
    }
  };

  // Remove the duplicate formatting functions since we're importing them
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Devices</h1>
          <p className="text-muted-foreground">
            Manage peripheral devices connected to gateways
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:bg-primary-dark">
              <Plus className="mr-2 h-4 w-4" />
              Add Device
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Device</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="uid">Device UID</Label>
                <Input 
                  id="uid" 
                  placeholder="1234567890123456789"
                  value={newDevice.uid}
                  onChange={(e) => setNewDevice(prev => ({...prev, uid: e.target.value}))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vendor">Vendor</Label>
                <Input 
                  id="vendor" 
                  placeholder="SensorTech"
                  value={newDevice.vendor}
                  onChange={(e) => setNewDevice(prev => ({...prev, vendor: e.target.value}))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="device-type">Device Type</Label>
                <Select
                  value={newDevice.device_type_id}
                  onValueChange={(value) => setNewDevice(prev => ({...prev, device_type_id: value}))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select device type" />
                  </SelectTrigger>
                  <SelectContent>
                    {deviceTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gateway">Gateway (Optional)</Label>
                <Select
                  value={newDevice.gateway_id || "none"}
                  onValueChange={(value) => setNewDevice(prev => ({...prev, gateway_id: value === "none" ? "" : value}))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gateway (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Unassigned</SelectItem>
                    {gateways.map((gateway) => (
                      <SelectItem key={gateway.id} value={gateway.id}>
                        {gateway.name} ({gateway.serial_number})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-gradient-primary" onClick={handleCreateDevice}>
                  Create Device
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Device Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Device</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-uid">Device UID</Label>
                <Input
                  id="edit-uid"
                  value={editingDevice?.uid || ""}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-vendor">Vendor</Label>
                <Input
                  id="edit-vendor"
                  value={editingDevice?.vendor || ""}
                  onChange={(e) => 
                    setEditingDevice(prev => prev ? {...prev, vendor: e.target.value} : null)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-device-type">Device Type</Label>
                <Select
                  value={editingDevice?.device_type_id?.toString() || ""}
                  disabled
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Device type (read-only)" />
                  </SelectTrigger>
                  <SelectContent>
                    {deviceTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-gateway">Gateway</Label>
                <Select
                  value={editingDevice?.gateway_id || "none"}
                  onValueChange={(value) => 
                    setEditingDevice(prev => prev ? {...prev, gateway_id: value === "none" ? null : value} : null)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gateway (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Unassigned</SelectItem>
                    {gateways.map((gateway) => (
                      <SelectItem key={gateway.id} value={gateway.id}>
                        {gateway.name} ({gateway.serial_number})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={editingDevice?.status || "ONLINE"}
                  onValueChange={(value) => 
                    setEditingDevice(prev => prev ? {...prev, status: value as any} : null)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ONLINE">Online</SelectItem>
                    <SelectItem value="OFFLINE">Offline</SelectItem>
                    <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-gradient-primary" onClick={handleUpdateDevice}>
                  Update Device
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between space-y-2">
            <CardTitle>All Devices</CardTitle>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search devices..."
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
                  <SelectItem value="ONLINE">Online</SelectItem>
                  <SelectItem value="OFFLINE">Offline</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Gateway</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Seen</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDevices.map((device) => (
                <TableRow key={device.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-secondary flex items-center justify-center">
                        <Smartphone className="h-5 w-5 text-secondary-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{device.vendor}</p>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <Hash className="h-3 w-3" />
                          <span className="font-mono">{device.uid}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{device.device_type?.name}</p>
                      <p className="text-xs text-muted-foreground">{device.device_type?.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {device.gateway_id ? (
                      <div className="flex items-center space-x-2">
                        <Server className="h-4 w-4 text-muted-foreground" />
                        <Badge variant="outline">{device.gateway_id}</Badge>
                      </div>
                    ) : (
                      <Badge variant="secondary">Unassigned</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge 
                      variant={device.status.toLowerCase() as any}
                    >
                      {device.status}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{formatDateTime(device.last_seen_at)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{formatDate(device.created_at)}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEditDevice(device)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDeleteDevice(device.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}