
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import HomePage from "./pages/HomePage";
import Index from "./pages/Index";
import Events from "./pages/Events";
import CreateEvent from "./pages/CreateEvent";
import QRCode from "./pages/QRCode";
import CheckIn from "./pages/CheckIn";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardLayout />} />
          <Route path="/events" element={<DashboardLayout><Events /></DashboardLayout>} />
          <Route path="/create-event" element={<DashboardLayout><CreateEvent /></DashboardLayout>} />
          <Route path="/events/:id/qr" element={<DashboardLayout><QRCode /></DashboardLayout>} />
          <Route path="/check-in" element={<DashboardLayout><CheckIn /></DashboardLayout>} />
          <Route path="/analytics" element={<DashboardLayout><Analytics /></DashboardLayout>} />
          <Route path="/templates" element={<DashboardLayout><Analytics /></DashboardLayout>} />
          <Route path="/settings" element={<DashboardLayout><Analytics /></DashboardLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

const DashboardLayout = ({ children }: { children?: React.ReactNode }) => (
  <SidebarProvider>
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <main className="flex-1 p-6">
        <div className="mb-4">
          <SidebarTrigger />
        </div>
        {children || <Index />}
      </main>
    </div>
  </SidebarProvider>
);

export default App;
