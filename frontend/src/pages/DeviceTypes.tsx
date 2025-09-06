import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
import { Label } from "@/components/ui/label";
import { Plus, Search, Settings, Package, Edit, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listDeviceTypes, createDeviceType, updateDeviceType, deleteDeviceType } from "@/services/deviceType.service";
import type { DeviceType, CreateDeviceTypeRequest, UpdateDeviceTypeRequest } from "@/types";

export default function DeviceTypes() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingDeviceType, setEditingDeviceType] = useState<DeviceType | null>(null);
  const [newDeviceType, setNewDeviceType] = useState({
    name: "",
    description: ""
  });

  // Fetch device types from API
  const { data: deviceTypes = [], isLoading, error } = useQuery({
    queryKey: ['device-types'],
    queryFn: listDeviceTypes,
  });

  // Create device type mutation
  const createMutation = useMutation({
    mutationFn: createDeviceType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['device-types'] });
      setIsCreateDialogOpen(false);
      setNewDeviceType({ name: "", description: "" });
    },
  });

  // Update device type mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateDeviceTypeRequest }) => 
      updateDeviceType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['device-types'] });
      setIsEditDialogOpen(false);
      setEditingDeviceType(null);
    },
  });

  // Delete device type mutation
  const deleteMutation = useMutation({
    mutationFn: deleteDeviceType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['device-types'] });
    },
  });

  const filteredDeviceTypes = deviceTypes.filter(deviceType =>
    deviceType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deviceType.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateDeviceType = () => {
    if (newDeviceType.name) {
      createMutation.mutate({
        name: newDeviceType.name,
        description: newDeviceType.description,
      } as CreateDeviceTypeRequest);
    }
  };

  const handleEditDeviceType = (deviceType: DeviceType) => {
    setEditingDeviceType(deviceType);
    setIsEditDialogOpen(true);
  };

  const handleUpdateDeviceType = () => {
    if (editingDeviceType) {
      updateMutation.mutate({
        id: editingDeviceType.id,
        data: {
          name: editingDeviceType.name,
          description: editingDeviceType.description,
        },
      });
    }
  };

  const handleDeleteDeviceType = (id: number) => {
    if (confirm('Are you sure you want to delete this device type?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Device Types</h1>
          <p className="text-muted-foreground">
            Manage device categories and specifications
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:bg-primary-dark">
              <Plus className="mr-2 h-4 w-4" />
              Add Device Type
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Device Type</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Type Name</Label>
                <Input 
                  id="name" 
                  placeholder="Temperature Sensor"
                  value={newDeviceType.name}
                  onChange={(e) => setNewDeviceType(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="IoT temperature monitoring device for environmental control"
                  rows={3}
                  value={newDeviceType.description}
                  onChange={(e) => setNewDeviceType(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  className="bg-gradient-primary"
                  onClick={handleCreateDeviceType}
                  disabled={createMutation.isPending || !newDeviceType.name}
                >
                  {createMutation.isPending ? "Creating..." : "Create Device Type"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Device Type</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Type Name</Label>
                <Input 
                  id="edit-name" 
                  placeholder="Temperature Sensor"
                  value={editingDeviceType?.name || ""}
                  onChange={(e) => setEditingDeviceType(prev => 
                    prev ? { ...prev, name: e.target.value } : null
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea 
                  id="edit-description" 
                  placeholder="IoT temperature monitoring device for environmental control"
                  rows={3}
                  value={editingDeviceType?.description || ""}
                  onChange={(e) => setEditingDeviceType(prev => 
                    prev ? { ...prev, description: e.target.value } : null
                  )}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  className="bg-gradient-primary"
                  onClick={handleUpdateDeviceType}
                  disabled={updateMutation.isPending || !editingDeviceType?.name}
                >
                  {updateMutation.isPending ? "Updating..." : "Update Device Type"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="text-muted-foreground">Loading device types...</div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center py-8">
          <div className="text-destructive">Error loading device types: {error.message}</div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDeviceTypes.length === 0 ? (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              {searchTerm ? 'No device types found matching your search.' : 'No device types found. Create your first device type to get started.'}
            </div>
          ) : (
            filteredDeviceTypes.map((deviceType) => (
              <Card key={deviceType.id} className="transition-all duration-200 hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-secondary flex items-center justify-center">
                        <Settings className="h-5 w-5 text-secondary-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{deviceType.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">ID: {deviceType.id}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="ml-auto">
                      <Package className="mr-1 h-3 w-3" />
                      {deviceType.devices?.length || 0}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {deviceType.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-foreground">
                        Active Devices: {deviceType.devices?.length || 0}
                      </span>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditDeviceType(deviceType)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteDeviceType(deviceType.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          {deleteMutation.isPending ? "Deleting..." : "Delete"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Device Types</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search device types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Active Devices</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeviceTypes.map((deviceType) => (
                <TableRow key={deviceType.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-lg bg-gradient-secondary flex items-center justify-center">
                        <Settings className="h-4 w-4 text-secondary-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{deviceType.name}</p>
                        <p className="text-sm text-muted-foreground">ID: {deviceType.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-muted-foreground max-w-md">
                      {deviceType.description}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {deviceType.devices?.length || 0} devices
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Delete</Button>
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