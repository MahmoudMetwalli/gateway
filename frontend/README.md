# Gateway Management Frontend

A modern React-based web application for managing IoT gateways and peripheral devices, built with TypeScript, React 18, Vite, and shadcn/ui components.

- **Gateway Management**: Interactive dashboard for gateway CRUD operations
- **Device Management**: Comprehensive device lifecycle management
- **Tenant Administration**: Multi-tenant interface support

## Project Structure

```
frontend/
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── dashboard/        # Dashboard-specific components
│   │   ├── layout/           # Layout components (Header, Sidebar)
│   │   └── ui/               # shadcn/ui component library
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility libraries and configurations
│   ├── pages/                # Page components (routes)
│   │   ├── Dashboard.tsx     # Main dashboard
│   │   ├── Devices.tsx       # Device management
│   │   ├── DeviceTypes.tsx   # Device type management
│   │   ├── Gateways.tsx      # Gateway management
│   │   ├── Logs.tsx          # System logs viewer
│   │   └── Tenants.tsx       # Tenant management
│   ├── services/             # API service layer
│   │   ├── devices.service.ts
│   │   ├── gateways.service.ts
│   │   ├── logs.service.ts
│   │   └── tenants.service.ts
│   ├── types/                # TypeScript type definitions
│   ├── utils/                # Utility functions
│   ├── App.tsx               # Main application component
│   └── main.tsx              # Application entry point
├── public/                   # Static assets
├── index.html               # HTML template
└── package.json             # Dependencies and scripts
```

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Charts**: Recharts
- **Date Handling**: date-fns

## Features

### Core Functionality

1. **Dashboard** - Overview with key metrics and charts
   - Gateway status distribution
   - Device health monitoring
   - Recent activity logs
   - Quick action buttons

2. **Gateway Management** - Complete gateway lifecycle
   - Create, read, update, delete gateways
   - Gateway status management (Active/Inactive)
   - Device attachment/detachment
   - Location and network configuration

3. **Device Management** - Peripheral device administration
   - Device CRUD operations
   - Device type categorization
   - Gateway assignment management
   - Device status tracking (Online/Offline/Maintenance)

4. **Tenant Management** - Multi-tenant support
   - Tenant CRUD operations
   - Contact information management
   - Gateway-tenant relationships

5. **System Logs** - Activity monitoring
   - Real-time log viewing
   - Action filtering and search
   - Gateway-specific log filtering

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- npm/yarn
- Backend API running on localhost:3000 Change Accordingly from .env

### Installation

1. **Clone and install dependencies**:
   ```bash
   cd gateway/frontend
   npm ci
   ```

2. **Environment Setup**:
   Create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:3000/api Update with you URL
   ```

3. **Development Server**:
   ```bash
   # Start development server with hot reload
   npm run dev
   
   # The app will be available at http://localhost:8080
   ```

4. **Build for Production**:
   ```bash
   # Production build
   npm run build
   
   # Development build
   npm run build:dev
   
   # Preview production build
   npm run preview
   ```
