import api from './api';
import { GatewayLog } from '../types';

export const logsService = {
  // Get all logs
  getAllLogs: async (): Promise<GatewayLog[]> => {
    const response = await api.get('/gateways/logs');
    return response.data;
  },
};
