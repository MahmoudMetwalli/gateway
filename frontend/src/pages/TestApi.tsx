import { useQuery } from "@tanstack/react-query";
import { listTenants } from "@/services/tenant.service";
import { listDevices } from "@/services/device.service";
import { gatewayApi } from "@/services/gateway.service";

export default function TestApi() {
  const { data: tenants, isLoading: tenantsLoading, error: tenantsError } = useQuery({
    queryKey: ['tenants'],
    queryFn: listTenants,
  });

  const { data: devices, isLoading: devicesLoading, error: devicesError } = useQuery({
    queryKey: ['devices'],
    queryFn: listDevices,
  });

  const { data: gatewaysResponse, isLoading: gatewaysLoading, error: gatewaysError } = useQuery({
    queryKey: ['gateways'],
    queryFn: () => gatewayApi.getAll(),
  });

  const gateways = gatewaysResponse?.data || [];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">API Test Page</h1>
      
      <div className="grid gap-6 md:grid-cols-3">
        {/* Tenants */}
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Tenants</h2>
          {tenantsLoading && <p>Loading tenants...</p>}
          {tenantsError && <p className="text-red-500">Error: {tenantsError.message}</p>}
          {tenants && (
            <div>
              <p>Count: {tenants.length}</p>
              <pre className="text-xs bg-gray-100 p-2 rounded mt-2">
                {JSON.stringify(tenants, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Gateways */}
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Gateways</h2>
          {gatewaysLoading && <p>Loading gateways...</p>}
          {gatewaysError && <p className="text-red-500">Error: {gatewaysError.message}</p>}
          {gateways && (
            <div>
              <p>Count: {gateways.length}</p>
              <pre className="text-xs bg-gray-100 p-2 rounded mt-2">
                {JSON.stringify(gateways.slice(0, 1), null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Devices */}
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Devices</h2>
          {devicesLoading && <p>Loading devices...</p>}
          {devicesError && <p className="text-red-500">Error: {devicesError.message}</p>}
          {devices && (
            <div>
              <p>Count: {devices.length}</p>
              <pre className="text-xs bg-gray-100 p-2 rounded mt-2">
                {JSON.stringify(devices.slice(0, 1), null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
