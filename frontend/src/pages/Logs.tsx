import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RefreshCw, Search, Filter } from 'lucide-react';
import { logsService } from '../services/logs.service';
import { GatewayLog } from '../types';
import { formatDateTime } from '../utils/dateUtils';

const getActionColor = (action: string) => {
  switch (action) {
    case 'CREATED':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'DELETED':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'DEVICE_ATTACHED':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'DEVICE_DETACHED':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    case 'UPDATED':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

const formatDetails = (details: string) => {
  try {
    const parsed = JSON.parse(details);
    if (typeof parsed === 'object') {
      return Object.entries(parsed)
        .filter(([key]) => !key.includes('_data') && key !== 'user')
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
    }
    return details;
  } catch {
    return details;
  }
};

export default function Logs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');

  const {
    data: logs,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['logs'],
    queryFn: logsService.getAllLogs,
  });

  const filteredLogs = logs?.filter((log) => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.gateway?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.gateway?.serial_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.gateway?.tenant?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = actionFilter === 'all' || log.action === actionFilter;

    return matchesSearch && matchesAction;
  });

  const uniqueActions = Array.from(new Set(logs?.map(log => log.action) || []));

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">System Logs</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Failed to load logs. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Logs</h1>
          <p className="text-muted-foreground">
            View all gateway activity and system events
          </p>
        </div>
        <Button
          onClick={() => refetch()}
          variant="outline"
          size="sm"
          className="ml-auto"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Logs</CardTitle>
          <CardDescription>
            Complete history of gateway operations and events
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {uniqueActions.map((action) => (
                  <SelectItem key={action} value={action}>
                    {action.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading logs...</span>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Gateway</TableHead>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        {searchTerm || actionFilter !== 'all' 
                          ? 'No logs match your filters.' 
                          : 'No logs found.'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLogs?.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-sm">
                          {formatDateTime(log.created_at)}
                        </TableCell>
                        <TableCell>
                          <Badge className={getActionColor(log.action)}>
                            {log.action.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {log.gateway ? (
                            <div className="space-y-1">
                              <div className="font-medium">{log.gateway.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {log.gateway.serial_number}
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground italic">
                              Gateway Deleted
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {log.gateway?.tenant ? (
                            <span className="font-medium">
                              {log.gateway.tenant.name}
                            </span>
                          ) : (
                            <span className="text-muted-foreground italic">
                              N/A
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="max-w-md">
                          <div className="text-sm truncate" title={formatDetails(log.details)}>
                            {formatDetails(log.details)}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
