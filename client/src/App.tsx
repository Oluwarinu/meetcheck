import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import ErrorBoundary from "@/components/ErrorBoundary";
import HomePage from "./pages/HomePage";
import Index from "./pages/Index";
import Events from "./pages/Events";
import CreateEvent from "./pages/CreateEvent";
import QRCode from "./pages/QRCode";
import CheckIn from "./pages/CheckIn";
import PublicCheckIn from "./pages/PublicCheckIn";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Templates from "./pages/Templates";
import Pricing from "./pages/Pricing";
import Resources from "./pages/Resources";
import Upgrade from "./pages/Upgrade";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import { AuthProvider } from './contexts/AuthContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error && typeof error === 'object' && 'status' in error) {
          const status = (error as any).status;
          if (status >= 400 && status < 500) {
            return false;
          }
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SubscriptionProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <PWAInstallPrompt />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/upgrade" element={<Upgrade />} />
                <Route path="/dashboard" element={<DashboardLayout><Index /></DashboardLayout>} />
                <Route path="/events" element={<DashboardLayout><Events /></DashboardLayout>} />
                <Route path="/create-event" element={<DashboardLayout><CreateEvent /></DashboardLayout>} />
                <Route path="/events/:id/qr" element={<DashboardLayout><QRCode /></DashboardLayout>} />
                <Route path="/check-in" element={<DashboardLayout><CheckIn /></DashboardLayout>} />
                <Route path="/public/checkin/:eventId" element={<PublicCheckIn />} />
                <Route path="/analytics" element={<DashboardLayout><Analytics /></DashboardLayout>} />
                <Route path="/templates" element={<DashboardLayout><Templates /></DashboardLayout>} />
                <Route path="/settings" element={<DashboardLayout><Settings /></DashboardLayout>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

const DashboardLayout = ({ children }: { children?: React.ReactNode }) => (
  <ErrorBoundary>
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="mb-4">
            <SidebarTrigger />
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
  </ErrorBoundary>
);

export default App;
