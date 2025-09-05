# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Gateway Management Frontend

A modern React TypeScript frontend application for managing IoT gateways and their peripheral devices. Built with Vite, React Router, TanStack Query, and Tailwind CSS.

## 🚀 Features

- **Modern React Stack**: React 18 with TypeScript, Vite for fast development
- **Responsive UI**: Clean, modern interface built with Tailwind CSS
- **State Management**: TanStack Query for server state management
- **Routing**: React Router for client-side navigation
- **API Integration**: Axios-based API client for backend communication
- **Component Library**: Custom UI components with consistent design
- **Real-time Dashboard**: Overview of gateways, devices, and system health

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── layout/        # Layout components (Sidebar, etc.)
│   │   └── ui/            # Basic UI components (Button, Card, etc.)
│   ├── pages/             # Page components
│   │   └── Dashboard.tsx  # Main dashboard page
│   ├── services/          # API service layer
│   │   ├── api.ts         # Axios configuration
│   │   └── gateway.service.ts # API endpoints
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts       # Shared types for API responses
│   ├── App.tsx            # Main application component
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles with Tailwind
├── public/                # Static assets
├── dist/                  # Build output
└── package.json           # Dependencies and scripts
```

## 🛠 Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **UI Components**: Custom components with Headless UI

## 🔧 Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Gateway Management Backend API running on port 3000

## 📦 Installation

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment**:
   Create or update `.env` file:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   VITE_APP_NAME=Gateway Manager
   VITE_APP_VERSION=1.0.0
   ```

## 🚀 Development

1. **Start development server**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

2. **Build for production**:
   ```bash
   npm run build
   ```

3. **Preview production build**:
   ```bash
   npm run preview
   ```

## 📱 Application Features

### Dashboard
- **System Overview**: Key metrics and statistics
- **Recent Activity**: Latest gateway and device events
- **System Health**: Status indicators for various components
- **Quick Stats**: Total gateways, devices, tenants, and online status

### Navigation
- **Sidebar Navigation**: Clean navigation with icons
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Active States**: Visual indication of current page

### API Integration
- **Type-safe API calls**: Full TypeScript support
- **Error handling**: Comprehensive error management
- **Loading states**: User feedback during API calls
- **Response caching**: Optimized performance with TanStack Query

## 🔗 API Integration

The frontend connects to the Gateway Management Backend API with the following endpoints:

### Tenants
- `GET /api/tenants` - List all tenants
- `POST /api/tenants` - Create new tenant
- `PUT /api/tenants/:id` - Update tenant
- `DELETE /api/tenants/:id` - Delete tenant

### Gateways
- `GET /api/gateways` - List all gateways
- `POST /api/gateways` - Create new gateway
- `PUT /api/gateways/:id` - Update gateway
- `DELETE /api/gateways/:id` - Delete gateway
- `POST /api/gateways/:id/devices` - Attach device
- `DELETE /api/gateways/:id/devices/:deviceId` - Detach device

### Devices
- `GET /api/devices` - List all devices
- `POST /api/devices` - Create new device
- `PUT /api/devices/:id` - Update device
- `DELETE /api/devices/:id` - Delete device
- `GET /api/devices/orphans` - Get unassigned devices

## 🎨 UI Components

### Basic Components
- **Button**: Multiple variants (primary, secondary, danger, outline)
- **Card**: Flexible card component with header, title, and content
- **Loading states**: Spinner and skeleton components

### Layout Components
- **Sidebar**: Navigation with icons and active states
- **Main Layout**: Responsive layout container

## 🔧 Development Guidelines

### Adding New Pages
1. Create component in `src/pages/`
2. Add route in `App.tsx`
3. Update navigation in `Sidebar.tsx`

### API Integration
1. Define types in `src/types/index.ts`
2. Add API methods in `src/services/gateway.service.ts`
3. Use TanStack Query hooks in components

### Styling
- Use Tailwind CSS classes
- Follow existing design patterns
- Maintain responsive design principles

## 🚦 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:3000/api` |
| `VITE_APP_NAME` | Application name | `Gateway Manager` |
| `VITE_APP_VERSION` | Application version | `1.0.0` |

## 🔮 Future Enhancements

1. **Complete CRUD Operations**: Full implementation for all entities
2. **Authentication**: User login and access control
3. **Real-time Updates**: WebSocket integration for live data
4. **Advanced Filtering**: Search and filter capabilities
5. **Data Visualization**: Charts and graphs for analytics
6. **Export Features**: Download reports and data
7. **Mobile App**: React Native version
8. **Dark Mode**: Theme switching capability

## 🤝 Contributing

1. Follow TypeScript best practices
2. Use semantic commit messages
3. Maintain test coverage
4. Follow existing code patterns
5. Update documentation for new features

## 📄 License

This project is part of the Gateway Management System.

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
