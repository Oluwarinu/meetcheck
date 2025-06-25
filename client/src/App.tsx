import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SubscriptionProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/checkin/:eventId" element={<PublicCheckIn />} />
                
                {/* Protected Routes with App Layout */}
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
                  <Route path="/events/create" element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} />
                  <Route path="/events/:id/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                  <Route path="/events/:id/checkin" element={<ProtectedRoute><CheckIn /></ProtectedRoute>} />
                  <Route path="/events/:id/qr" element={<ProtectedRoute><QRCode /></ProtectedRoute>} />
                  <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                  <Route path="/templates" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                  <Route path="/pricing" element={<ProtectedRoute><Pricing /></ProtectedRoute>} />
                  <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
                  <Route path="/upgrade" element={<ProtectedRoute><Upgrade /></ProtectedRoute>} />
                </Route>
                
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </div>
            <Toaster />
          </Router>
        </SubscriptionProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;