import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Server, 
  Users, 
  Wifi, 
  Smartphone, 
  Settings, 
  Home,
  FileText
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Tenants", href: "/tenants", icon: Users },
  { name: "Gateways", href: "/gateways", icon: Server },
  { name: "Devices", href: "/devices", icon: Smartphone },
  { name: "Device Types", href: "/device-types", icon: Settings },
  { name: "Logs", href: "/logs", icon: FileText },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r border-border">
      <div className="flex h-16 items-center px-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="rounded-lg bg-gradient-primary p-2">
            <Wifi className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">IoT Gateway</h1>
            <p className="text-xs text-muted-foreground">Management System</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 transition-colors",
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground group-hover:text-accent-foreground"
                )}
              />
              <span className="flex-1">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-gradient-secondary" />
          <div className="text-sm">
            <p className="font-medium text-foreground">Admin User</p>
            <p className="text-muted-foreground">admin@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}