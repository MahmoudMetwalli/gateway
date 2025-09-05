import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { PORT } from './config';

// Import routers
import tenantRouter from './routers/tenant.router';
import gatewayRouter from './routers/geteway.router';
import deviceRouter from './routers/device.router';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Gateway Management API is running!',
    version: '1.0.0',
    endpoints: {
      tenants: '/api/tenants',
      gateways: '/api/gateways', 
      devices: '/api/devices'
    }
  });
});

// API Routes
app.use('/api/tenants', tenantRouter);
app.use('/api/gateways', gatewayRouter);
app.use('/api/devices', deviceRouter);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
