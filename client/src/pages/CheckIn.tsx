` tags.

```xml
<replit_final_file>
import React, { useState, useEffect } from 'react';
import { QrCode, MapPin, Clock, Users, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

type LocationStatus = 'pending' | 'granted' | 'denied' | 'unavailable';

interface CheckInEvent {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  capacity: number;
  checkedIn: number;
}

export default function CheckIn() {
  const { user } = useAuth();
  const [event, setEvent] = useState<CheckInEvent | null>(null);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>('pending');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [checkInCode, setCheckInCode] = useState('');
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [checkInSuccess, setCheckInSuccess] = useState(false);

  useEffect(() => {
    requestLocation();
    // Mock event data
    setEvent({
      id: '1',
      title: 'Team Meeting',
      location: 'Conference Room A',
      date: '2024-01-15',
      time: '10:00 AM',
      capacity: 20,
      checkedIn: 12
    });
  }, []);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('unavailable');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationStatus('granted');
      },
      (error) => {
        console.error('Location error:', error);
        setLocationStatus('denied');
      }
    );
  };

  const retryLocation = () => {
    setLocationStatus('pending');
    requestLocation();
  };

  const handleCheckIn = async () => {
    if (!event || !userLocation) return;

    setIsCheckingIn(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCheckInSuccess(true);
    } catch (error) {
      console.error('Check-in failed:', error);
    } finally {
      setIsCheckingIn(false);
    }
  };

  if (checkInSuccess) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <Card className="text-center">
          <CardContent className="pt-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Check-in Successful!</h2>
            <p className="text-gray-600">
              You've been checked in to {event?.title}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!event) {
    return <div className="p-6">Loading event details...</div>;
  }

  return (
    <div className="p-6 max-w-md mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Event Check-In
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">{event.title}</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {event.location}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {event.date} at {event.time}
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {event.checkedIn}/{event.capacity} checked in
              </div>
            </div>
          </div>

          {/* Location Status */}
          {locationStatus === 'denied' && (
            <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
              <p className="text-sm text-red-800 mb-2">
                Location access is required for secure check-in. Please:
              </p>
              <ul className="text-xs text-red-700 list-disc ml-4 mb-3">
                <li>Click the location icon in your browser's address bar</li>
                <li>Allow location access for this site</li>
                <li>Refresh the page</li>
              </ul>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={retryLocation}
                className="text-red-700 border-red-300"
              >
                Retry Location Access
              </Button>
            </div>
          )}

          {/* Check-in Form */}
          <div className="space-y-3">
            <Input
              placeholder="Enter check-in code (optional)"
              value={checkInCode}
              onChange={(e) => setCheckInCode(e.target.value)}
            />

            <Button
              onClick={handleCheckIn}
              disabled={isCheckingIn || locationStatus !== 'granted'}
              className="w-full"
            >
              {isCheckingIn ? 'Checking In...' : 'Check In'}
            </Button>
          </div>

          {locationStatus === 'pending' && (
            <p className="text-sm text-gray-500 text-center">
              Requesting location access...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}