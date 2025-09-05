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

// Global error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', error);
  
  if (error.name === 'ZodError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.errors
    });
  }

  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}/api`);
});
