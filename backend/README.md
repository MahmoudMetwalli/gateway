# Gateway Management API

A robust Node.js REST API for managing gateways and their peripheral devices, built with TypeScript, Express, Prisma, and PostgreSQL.

- **Gateway Management**: Create, read, update, and delete gateways
- **Device Management**: Manage peripheral devices and their relationships with gateways
- **Tenant Management**: Multi-tenant architecture support
- **Data Validation**: Runtime validation using Zod schemas
- **Type Safety**: Full TypeScript implementation
- **Database Management**: Prisma ORM with PostgreSQL
- **Error Handling**: Comprehensive error handling and logging
- **API Documentation**: RESTful endpoints with clear response formats

## Project Structure

```
gateway/
├── src/
│   ├── config/                 # Configuration files
│   │   ├── database.ts        # Database configuration
│   │   ├── index.ts           # Config exports
│   │   └── port.ts            # Port configuration
│   ├── controllers/           # Request handlers
│   │   ├── device.controller.ts
│   │   ├── gateway.controller.ts
│   │   └── tenant.controller.ts
│   ├── middlewares/           # Express middlewares
│   │   └── validation.middleware.ts
│   ├── services/              # Data access layer
│   │   ├── device.service.ts
│   │   ├── gateway.service.ts
│   │   └── tenant.service.ts
│   ├── routers/               # Route definitions
│   │   ├── device.router.ts
│   │   ├── gateway.router.ts (geteway.router.ts)
│   │   └── tenant.router.ts
│   ├── schemas/               # Zod validation schemas
│   │   ├── device.schema.ts
│   │   ├── deviceType.schema.ts
│   │   ├── gateway.schema.ts
│   │   ├── miscellaneous.schema.ts
│   │   └── tenant.schema.ts
│   └── index.ts              # Application entry point
├── prisma/
│   └── schema/               # Prisma schema files
│       ├── device.prisma
│       ├── gateway.prisma
│       ├── main.prisma
│       └── tenant.prisma
├── atlas/                    # Database migrations
└── tests/unit                # tests
```

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod
- **Development**: tsx (TypeScript execution)
- **Migration**: Atlas
- **API Documentation**: Swagger

## Database Schema

### Core Entities

1. **Tenant** - Organization/customer entity
   - `id` (UUID)
   - `name` (String)
   - `contact_info` (JSON)
   - `created_at`, `updated_at` (DateTime)

2. **Gateway** - IoT gateway devices
   - `id` (UUID)
   - `name` (String)
   - `status` (ACTIVE | INACTIVE | DECOMMISSIONED)
   - `serial_number` (String, unique)
   - `ipv4_address` (String, unique)
   - `location` (String, optional)
   - `tenant_id` (Foreign Key)

3. **PeripheralDevice** - Devices connected to gateways
   - `id` (UUID)
   - `uid` (BigInt, unique)
   - `vendor` (String)
   - `status` (ONLINE | OFFLINE | MAINTENANCE)
   - `device_type_id` (Foreign Key)
   - `gateway_id` (Foreign Key, optional)
   - `last_seen_at` (DateTime, optional)

4. **DeviceType** - Device categorization
   - `id` (Integer)
   - `name` (String)
   - `description` (String, optional)

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- npm/yarn
- atlas

### Installation

1. **Clone and install dependencies**:
   ```bash
   cd gateway/backend
   npm ci
   ```

2. **Environment Setup**:
   Create a `.env` file:
   ```env
   DATABASE_URL="postgres://username:password@localhost:5432/gateway_db?sslmode=disable"
   PORT=3000
   ```

3. **Database Setup**:
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run migrations
   atlas migrate apply --env local
   ```
   Don't Include the seeding data migration if not needed
4. **Build and Run**:
   ```bash
   # Development with hot reload
   npm run dev
   
   # Production build
   npm run build
   npm start
   ```

## Docker Setup

### Prerequisites for Docker
- Docker Engine 20.10+
- Docker Compose 2.0+

### Manual Docker Build

1. **Build production image**:
   ```bash
   docker build -t gateway-backend .
   ```

2. **Run with external database**:
   ```bash
   docker run -d \
     --name gateway-backend \
     -p 3000:3000 \
     -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
     -e NODE_ENV=production \
     gateway-backend
   ```

### Docker Services

The Docker setup includes:

- **PostgreSQL**: Database with persistent volume
- **Backend API**: Node.js application with PM2 process management
- **Development Mode**: Hot reload support with volume mounting
- **PM2 Features**: Clustering, auto-restart, memory monitoring

### PM2 Process Management

The production container uses PM2 for:
- **Clustering**: Utilizes all CPU cores with `instances: "max"`
- **Auto-restart**: Automatic restart on crashes or memory limits
- **Memory monitoring**: Restart when memory usage exceeds 300MB
- **Log management**: Centralized logging with rotation
- **Health checks**: Built-in process monitoring

### Environment Variables for Docker

```env
# Database
DATABASE_URL=postgresql://gateway_user:gateway_pass@postgres:5432/gateway_db

# Application
NODE_ENV=production
PORT=3000
```

### Docker Health Checks

- **Database**: PostgreSQL connection check
- **Backend**: HTTP health endpoint check
- **Restart Policy**: Automatic restart unless stopped

### Development Debugging

Access the development container:
```bash
# Execute shell in running container
docker-compose exec backend-dev sh

# View real-time logs
docker-compose logs -f backend-dev

# Debug with VS Code
# The development container exposes port 9229 for debugging
```

### PM2 Management Commands

Monitor and manage the PM2 processes in production:
```bash
# Access the production container
docker-compose exec backend sh

# View PM2 status
pm2 status

# View logs
pm2 logs gateway-api

# Monitor resources
pm2 monit

# Restart application
pm2 restart gateway-api

# Reload application (zero-downtime)
pm2 reload gateway-api

# View PM2 dashboard
pm2 web
```

## API Endpoints

### Health Check
- `GET /` - API health check

### Tenants
- `GET /api/tenants` - List all tenants
- `POST /api/tenants` - Create new tenant
- `GET /api/tenants/:id` - Get tenant by ID
- `PATCH /api/tenants/:id` - Update tenant
- `DELETE /api/tenants/:id` - Delete tenant

### Gateways
- `GET /api/gateways` - List all gateways
- `POST /api/gateways` - Create new gateway
- `GET /api/gateways/:id` - Get gateway by ID
- `PATCH /api/gateways/:id` - Update gateway
- `DELETE /api/gateways/:id` - Delete gateway
- `POST /api/gateways/:id/devices` - Attach device to gateway
- `DELETE /api/gateways/:id/devices/:deviceId` - Detach device

### Devices
- `GET /api/devices` - List all devices
- `POST /api/devices` - Create new device
- `GET /api/devices/:id` - Get device by ID
- `PATCH /api/devices/:id` - Update device
- `DELETE /api/devices/:id` - Delete device
- `GET /api/devices/orphans` - Get unassigned devices


### Devices Types
- `GET /api/device-types` - List all device types
- `POST /api/device-types` - Create new device type
- `GET /api/device-types/:id` - Get device type by ID
- `PATCH /api/device-types/:id` - Update device type
- `DELETE /api/device-types/:id` - Delete device type


## Testing

Run the unit tests:
```bash
npm run test
```

## API Documentation

- `/api-docs` - Swagger API Docs

## Business Rules Implemented

1. **Gateway Limits**: Each gateway can have a maximum of 10 devices (enforced via database trigger)
2. **Unique Constraints**: Gateway serial numbers and IPv4 addresses must be unique
3. **Device UIDs**: Device UIDs are unique across the entire system
4. **Tenant Isolation**: Gateways belong to specific tenants
5. **Orphan Devices**: Devices can exist without being assigned to a gateway
