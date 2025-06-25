
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { Toaster } from './components/ui/toaster';
import ErrorBoundary from './components/ErrorBoundary';

// Pages
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Signup from './pages/Signup';
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
                <Route path="/events" element={<Events />} />
                <Route path="/events/create" element={<CreateEvent />} />
                <Route path="/events/:id/analytics" element={<Analytics />} />
                <Route path="/events/:id/checkin" element={<CheckIn />} />
                <Route path="/events/:id/qr" element={<QRCode />} />
                <Route path="/checkin/:eventId" element={<PublicCheckIn />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/templates" element={<Templates />} />
                <Route path="/upgrade" element={<Upgrade />} />
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </div>
          </Router>
          <Toaster />
        </SubscriptionProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
