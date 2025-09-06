# IoT Gateway Management System

A comprehensive IoT Gateway management platform built with modern web technologies, designed to manage IoT gateways, devices, and tenants in a scalable and secure environment.

## Features

### Core Functionality
- **Gateway Management**: Create, read, update, and delete IoT gateways
- **Device Management**: Handle peripheral devices and their connections to gateways
- **Tenant Management**: Multi-tenant architecture with isolated data
- **Device Types**: Manage different types of IoT devices
- **Real-time Status Monitoring**: Track gateway and device status in real-time

### Technical Features
- **RESTful API**: Comprehensive REST API with OpenAPI/Swagger documentation
- **Database Integration**: PostgreSQL with Prisma ORM
- **Type Safety**: Full TypeScript implementation across frontend and backend
- **Authentication & Authorization**: JWT-based authentication system
- **Input Validation**: Comprehensive validation using Zod schemas
- **Error Handling**: Centralized error handling and logging
- **Testing**: Comprehensive test coverage with Jest
- **Containerization**: Docker support with PM2 process management


## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    Frontend     │    │     Backend     │    │    Database     │
│   (React/Vite)  │◄──►│  (Express/TS)   │◄──►│  (PostgreSQL)   │
│                 │    │                 │    │                 │
│ • React 18      │    │ • Express.js    │    │ • PostgreSQL    │
│ • TypeScript    │    │ • TypeScript    │    │ • Prisma ORM    │
│ • Vite          │    │ • Prisma        │    │ • Atlas Migrations│
│ • TanStack Query│    │ • Zod Validation│    │                 │
│ • shadcn/ui     │    │ • JWT Auth      │    │                 │
│ • Tailwind CSS  │    │ • Swagger/OpenAPI│    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Project Structure

```
gateway/
├── backend/                 # Backend API server
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── services/        # Business logic
│   │   ├── repositories/    # Data access layer
│   │   ├── middlewares/     # Express middlewares
│   │   ├── schemas/         # Zod validation schemas
│   │   ├── routers/         # Route definitions
│   │   └── config/          # Configuration files
│   ├── tests/               # Test files
│   ├── prisma/              # Database schema and migrations
│   ├── dist/                # Compiled JavaScript
│   ├── Dockerfile           # Docker configuration
│   ├── ecosystem.config.json # PM2 configuration
│   └── package.json
│
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service layer
│   │   ├── hooks/           # Custom React hooks
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils/           # Utility functions
│   ├── public/              # Static assets
│   └── package.json
│
└── README.md               # This file
```

## Getting Started

### Prerequisites

- **Node.js** (v18 or later)
- **PostgreSQL** (v12 or later)
- **Docker** (optional, for containerized deployment)
- **npm** or **yarn**

### Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE gateway_db;
CREATE USER it_admin WITH PASSWORD 'system_admin567';
GRANT ALL PRIVILEGES ON DATABASE gateway_db TO it_admin;
```

2. Set up the database URL in your environment variables.

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm ci

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Generate Prisma client
npx prisma generate

# Run database migrations
atlas migrate apply --env local

# Start development server
npm run dev
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm ci

# Set up environment variables
cp .env.example .env
# Edit .env with your API endpoint

# Start development server
npm run dev
```

### Docker Deployment

For production deployment using Docker:

```bash
# Backend
cd backend
docker build -t gateway-backend .
docker run -p 3000:3000 \
  -e DATABASE_URL="postgres://user:pass@host:5432/db" \
  gateway-backend

# Frontend
cd frontend
docker build -t gateway-frontend .
docker run -p 80:80 gateway-frontend
```

## Testing

### Backend Tests
```bash
cd backend
npm run test        # Run all tests
npm run test:watch  # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```


## API Documentation

The API documentation is available via Swagger UI when the backend server is running:

- **Development**: http://localhost:3000/api-docs
- **Production**: https://your-domain.com/api-docs

### API Endpoints

#### Gateways
- `GET /api/gateways` - List all gateways
- `POST /api/gateways` - Create a new gateway
- `GET /api/gateways/:id` - Get gateway by ID
- `PATCH /api/gateways/:id` - Update gateway
- `DELETE /api/gateways/:id` - Delete gateway
- `POST /api/gateways/:id/devices` - Attach device to gateway
- `DELETE /api/gateways/:gatewayId/devices/:deviceId` - Detach device

#### Devices
- `GET /api/devices` - List all devices
- `POST /api/devices` - Create a new device
- `GET /api/devices/:id` - Get device by ID
- `PATCH /api/devices/:id` - Update device
- `DELETE /api/devices/:id` - Delete device

#### Tenants
- `GET /api/tenants` - List all tenants
- `POST /api/tenants` - Create a new tenant
- `GET /api/tenants/:id` - Get tenant by ID
- `PATCH /api/tenants/:id` - Update tenant
- `DELETE /api/tenants/:id` - Delete tenant

## Configuration

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL="postgres://user:password@localhost:5432/gateway_db"
PORT=3000
JWT_SECRET="your-secret-key"
NODE_ENV="development"
```

#### Frontend (.env)
```env
VITE_API_BASE_URL="http://localhost:3000/api"
VITE_APP_TITLE="IoT Gateway Management"
```


### Database Management

- **Prisma**: Type-safe database access
- **Migrations**: Version-controlled schema changes
- **Atlas**: Advanced migration tooling
- **Seeding**: Database seeding for development



## Author

**Mahmoud Metwalli**
- GitHub: [@MahmoudMetwalli](https://github.com/MahmoudMetwalli)
- LinkedIn: [Mahmoud Metwalli](https://linkedin.com/in/mahmoud-metwalli)



---

For more detailed information about specific components, check the individual README files in the `backend/` and `frontend/` directories.
