# Gateway Management API

A robust Node.js REST API for managing IoT gateways and their peripheral devices, built with TypeScript, Express, Prisma, and PostgreSQL.

## 🚀 Features

- **Gateway Management**: Create, read, update, and delete gateways
- **Device Management**: Manage peripheral devices and their relationships with gateways
- **Tenant Management**: Multi-tenant architecture support
- **Data Validation**: Runtime validation using Zod schemas
- **Type Safety**: Full TypeScript implementation
- **Database Management**: Prisma ORM with PostgreSQL
- **Error Handling**: Comprehensive error handling and logging
- **API Documentation**: RESTful endpoints with clear response formats

## 📁 Project Structure

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
│   ├── repositories/          # Data access layer
│   │   ├── device.repository.ts
│   │   ├── gateway.repository.ts
│   │   └── tenant.repository.ts
│   ├── routers/              # Route definitions
│   │   ├── device.router.ts
│   │   ├── gateway.router.ts (geteway.router.ts)
│   │   └── tenant.router.ts
│   ├── schemas/              # Zod validation schemas
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
└── test-api.sh              # API testing script
```

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod
- **Development**: tsx (TypeScript execution)
- **Migration**: Atlas

## 📊 Database Schema

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

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- npm/yarn

### Installation

1. **Clone and install dependencies**:
   ```bash
   cd gateway
   npm install
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
   
   # Run migrations (if using Atlas)
   atlas migrate apply --url "postgres://username:password@localhost:5432/gateway_db?sslmode=disable"
   ```

4. **Build and Run**:
   ```bash
   # Development with hot reload
   npm run dev
   
   # Production build
   npm run build
   npm start
   ```

## 📡 API Endpoints

### Health Check
- `GET /` - API health check

### Tenants
- `GET /api/tenants` - List all tenants
- `POST /api/tenants` - Create new tenant
- `GET /api/tenants/:id` - Get tenant by ID
- `PUT /api/tenants/:id` - Update tenant
- `DELETE /api/tenants/:id` - Delete tenant

### Gateways
- `GET /api/gateways` - List all gateways
- `POST /api/gateways` - Create new gateway
- `GET /api/gateways/:id` - Get gateway by ID
- `PUT /api/gateways/:id` - Update gateway
- `DELETE /api/gateways/:id` - Delete gateway
- `POST /api/gateways/:id/devices` - Attach device to gateway
- `DELETE /api/gateways/:id/devices/:deviceId` - Detach device

### Devices
- `GET /api/devices` - List all devices
- `POST /api/devices` - Create new device
- `GET /api/devices/:id` - Get device by ID
- `PUT /api/devices/:id` - Update device
- `DELETE /api/devices/:id` - Delete device
- `GET /api/devices/orphans` - Get unassigned devices

## 🔍 Key Features Implemented

### 1. Repository Pattern
Clean separation of data access logic from business logic:
```typescript
// Example repository method
export async function createGateway(data: Prisma.GatewayCreateInput) {
  const gateway = await prisma.gateway.create({ 
    data,
    include: { devices: true, tenant: true }
  });
  return gateway;
}
```

### 2. Validation Middleware
DRY principle implementation with Zod:
```typescript
// Reusable validation middleware
export const validateRequest = (schemas: ValidationSchemas) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Validates body, params, and query simultaneously
  };
};
```

### 3. Type-Safe DTOs
Runtime validation with TypeScript inference:
```typescript
export const CreateGatewaySchema = z.object({
  name: z.string().min(1).max(255),
  status: GatewayStatusSchema,
  serial_number: z.string().min(1).max(50),
  ipv4_address: z.string().ip(),
  tenant_id: z.string().uuid(),
  location: z.string().max(500).optional()
});
```

### 4. Error Handling
Consistent error responses across all endpoints:
```typescript
// Global error handler
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  if (error.name === 'ZodError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.errors
    });
  }
  // Handle other error types...
});
```

## 🧪 Testing

Run the basic API tests:
```bash
./test-api.sh
```

## 🚦 Business Rules Implemented

1. **Gateway Limits**: Each gateway can have a maximum of 10 devices (enforced via database trigger)
2. **Unique Constraints**: Gateway serial numbers and IPv4 addresses must be unique
3. **Device UIDs**: Device UIDs are unique across the entire system
4. **Tenant Isolation**: Gateways belong to specific tenants
5. **Orphan Devices**: Devices can exist without being assigned to a gateway

## 🔮 Next Steps

1. Add authentication and authorization
2. Implement comprehensive logging
3. Add rate limiting
4. Create API documentation with Swagger/OpenAPI
5. Add comprehensive test suite
6. Implement caching
7. Add monitoring and metrics
8. Deploy to production environment

## 🤝 Development

The project follows clean architecture principles:
- **Controllers**: Handle HTTP requests/responses
- **Repositories**: Database operations
- **Schemas**: Data validation
- **Middlewares**: Cross-cutting concerns
- **Configuration**: Environment-specific settings

This structure ensures maintainability, testability, and scalability of the application.
