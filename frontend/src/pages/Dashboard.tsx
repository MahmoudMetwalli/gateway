import { StatsCard } from "@/components/dashboard/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { useQuery } from "@tanstack/react-query";
import { 
  Server, 
  Users, 
  Smartphone, 
  Activity,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import { listTenants } from "@/services/tenant.service";
import { listDevices } from "@/services/device.service";
import { gatewayApi } from "@/services/gateway.service";

export default function Dashboard() {
  // Fetch real data from backend
  const { data: tenants = [] } = useQuery({
    queryKey: ['tenants'],
    queryFn: listTenants,
  });

  const { data: devices = [] } = useQuery({
    queryKey: ['devices'],
    queryFn: listDevices,
  });

  const { data: gatewaysResponse } = useQuery({
    queryKey: ['gateways'],
    queryFn: () => gatewayApi.getAll(),
  });
  
  const gateways = gatewaysResponse?.data || [];

  // Calculate stats from real data
  const stats = {
    totalTenants: tenants.length,
    totalGateways: gateways.length,
    totalDevices: devices.length,
    activeDevices: devices.filter(device => device.status === 'ONLINE').length,
  };

  // Get recent gateways (last 3)
  const recentGateways = gateways.slice(-3).map(gateway => ({
    id: gateway.id,
    name: gateway.name,
    status: gateway.status,
    devices: gateway.devices?.length || 0,
    tenant: gateway.tenant?.name || 'Unknown'
  }));

  // Get devices that need attention
  const alertDevices = devices
    .filter(device => device.status === 'OFFLINE' || device.status === 'MAINTENANCE')
    .slice(0, 3)
    .map(device => ({
      id: device.id,
      name: `${device.vendor} Device #${device.uid}`,
      status: device.status,
      gateway: device.gateway?.name || 'Unassigned'
    }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your IoT gateway management system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Tenants"
          value={stats.totalTenants}
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Active Gateways"
          value={stats.totalGateways}
          icon={Server}
          trend={{ value: 8, isPositive: true }}
          variant="success"
        />
        <StatsCard
          title="Connected Devices"
          value={stats.totalDevices}
          icon={Smartphone}
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title="Online Devices"
          value={`${stats.activeDevices}/${stats.totalDevices}`}
          icon={Activity}
          trend={{ value: 2, isPositive: false }}
          variant="warning"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Gateways */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Server className="h-5 w-5" />
              <span>Recent Gateways</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentGateways.map((gateway) => (
                <div key={gateway.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">{gateway.name}</p>
                    <p className="text-sm text-muted-foreground">{gateway.tenant}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{gateway.devices} devices</Badge>
                    <StatusBadge 
                      variant={gateway.status.toLowerCase() as any}
                    >
                      {gateway.status}
                    </StatusBadge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Device Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <span>Device Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alertDevices.map((device) => (
                <div key={device.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">{device.name}</p>
                    <p className="text-sm text-muted-foreground">{device.gateway}</p>
                  </div>
                  <StatusBadge 
                    variant={device.status.toLowerCase() as any}
                  >
                    {device.status}
                  </StatusBadge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>System Health</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Gateway Uptime</span>
                <span className="text-sm text-success">98.5%</span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div className="h-2 rounded-full bg-success" style={{ width: "98.5%" }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Device Connectivity</span>
                <span className="text-sm text-success">94.2%</span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div className="h-2 rounded-full bg-success" style={{ width: "94.2%" }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Network Performance</span>
                <span className="text-sm text-warning">87.1%</span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div className="h-2 rounded-full bg-warning" style={{ width: "87.1%" }} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}