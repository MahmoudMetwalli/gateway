import React from 'react';
import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';
import { 
  Home, 
  Building, 
  Server, 
  Cpu 
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Tenants', href: '/tenants', icon: Building },
  { name: 'Gateways', href: '/gateways', icon: Server },
  { name: 'Devices', href: '/devices', icon: Cpu },
];

export const Sidebar: React.FC = () => {
  return (
    <div className="flex flex-col w-64 bg-gray-800">
      <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
        <Server className="h-8 w-8 text-white" />
        <span className="ml-2 text-white text-lg font-semibold">
          Gateway Manager
        </span>
      </div>
      <nav className="mt-5 flex-1 px-2 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              clsx(
                isActive
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
              )
            }
          >
            <item.icon
              className="mr-3 h-6 w-6 flex-shrink-0"
              aria-hidden="true"
            />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
