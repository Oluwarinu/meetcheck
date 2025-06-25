import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { Toaster } from './components/ui/sonner';
import EnvChecker from './components/EnvChecker';

// Import pages
import Index from './pages/Index';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Events from './pages/Events';
import CreateEvent from './pages/CreateEvent';
import Analytics from './pages/Analytics';
import CheckIn from './pages/CheckIn';
import PublicCheckIn from './pages/PublicCheckIn';
import QRCode from './pages/QRCode';
import Settings from './pages/Settings';
import Templates from './pages/Templates';
import Pricing from './pages/Pricing';
import Resources from './pages/Resources';
import Upgrade from './pages/Upgrade';
import NotFound from './pages/NotFound';

function App() {
  return (
    <EnvChecker>
      <AuthProvider>
        <SubscriptionProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/events" element={<Events />} />
                <Route path="/create-event" element={<CreateEvent />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/checkin/:eventId" element={<CheckIn />} />
                <Route path="/public/checkin/:eventId" element={<PublicCheckIn />} />
                <Route path="/qr/:eventId" element={<QRCode />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/templates" element={<Templates />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/upgrade" element={<Upgrade />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Toaster />
          </Router>
        </SubscriptionProvider>
      </AuthProvider>
    </EnvChecker>
  );
}

export default App;