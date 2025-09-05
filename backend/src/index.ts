import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { PORT } from './config';
import { swaggerSpec } from './config/swagger';

// Import routers
import tenantRouter from './routers/tenant.router';
import gatewayRouter from './routers/geteway.router';
import deviceRouter from './routers/device.router';
import deviceTypeRouter from './routers/deviceType.router';

const app = express();

// Middleware
// app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Debug endpoint to check swagger spec
app.get('/swagger.json', (req, res) => {
  res.json(swaggerSpec);
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Gateway Management API is running!',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
      tenants: '/api/tenants',
      gateways: '/api/gateways', 
      devices: '/api/devices',
      deviceTypes: '/api/device-types'
    }
  });
});

// API Routes
app.use('/api/tenants', tenantRouter);
app.use('/api/gateways', gatewayRouter);
app.use('/api/devices', deviceRouter);
app.use('/api/device-types', deviceTypeRouter);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
