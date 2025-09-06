import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/layout";
import Dashboard from "./pages/Dashboard";
import Tenants from "./pages/Tenants";
import Gateways from "./pages/Gateways";
import Devices from "./pages/Devices";
import DeviceTypes from "./pages/DeviceTypes";
import Logs from "./pages/Logs";
import TestApi from "./pages/TestApi";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tenants" element={<Tenants />} />
            <Route path="/gateways" element={<Gateways />} />
            <Route path="/devices" element={<Devices />} />
            <Route path="/device-types" element={<DeviceTypes />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/test-api" element={<TestApi />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
