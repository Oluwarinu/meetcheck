import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { Toaster } from './components/ui/toaster';
import ErrorBoundary from './components/ErrorBoundary';
import { AppLayout } from './components/layout/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import CreateEvent from './pages/CreateEvent';
import Analytics from './pages/Analytics';
import CheckIn from './pages/CheckIn';
import PublicCheckIn from './pages/PublicCheckIn';
import QRCode from './pages/QRCode';
import Settings from './pages/Settings';
import Pricing from './pages/Pricing';
import Resources from './pages/Resources';
import Templates from './pages/Templates';
import Upgrade from './pages/Upgrade';
import ForgotPassword from './pages/ForgotPassword';
import NotFound from './pages/NotFound';
import RoleSelection from './pages/RoleSelection';
import EducatorEvents from './pages/EducatorEvents';
import EducatorDashboard from './pages/EducatorDashboard';
import ManageTemplatesPage from './pages/ManageTemplatesPage'; // Import the new page

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SubscriptionProvider>
            <Router>
              <div className="min-h-screen bg-background">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/role-selection" element={<RoleSelection />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/checkin/:eventId" element={<PublicCheckIn />} />
                
                {/* Protected Routes with App Layout */}
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
                  <Route path="/events/create" element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} />
                  <Route path="/events/:eventId/qr" element={<ProtectedRoute><QRCode /></ProtectedRoute>} />
                  <Route path="/events/:eventId/checkin" element={<ProtectedRoute><CheckIn /></ProtectedRoute>} />
                  <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                  <Route path="/templates" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                  <Route path="/upgrade" element={<ProtectedRoute><Upgrade /></ProtectedRoute>} />
                  <Route path="/educator/dashboard" element={<ProtectedRoute><EducatorDashboard /></ProtectedRoute>} />
                  <Route path="/educator/events" element={<ProtectedRoute><EducatorEvents /></ProtectedRoute>} />
                  <Route path="/manage-templates" element={<ProtectedRoute><ManageTemplatesPage /></ProtectedRoute>} /> {/* Add new route */}
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Toaster />
          </Router>
        </SubscriptionProvider>
      </AuthProvider>
    </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;