import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { MapPin, Clock, Globe, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface CheckInData {
  name: string;
  email: string;
  company: string;
  location: LocationData | null;
  timestamp: string;
  ipAddress: string;
}

export default function CheckIn() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: ""
  });
  const [checkInData, setCheckInData] = useState<CheckInData>({
    name: "",
    email: "",
    company: "",
    location: null,
    timestamp: "",
    ipAddress: ""
  });
  const [isChecking, setIsChecking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [locationStatus, setLocationStatus] = useState<'requesting' | 'granted' | 'denied' | 'unavailable'>('requesting');
  const [locationAccuracy, setLocationAccuracy] = useState<number>(0);
  const [eventData, setEventData] = useState<{
    title?: string;
    flierData?: string | null;
  } | null>(null);
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Get user's IP address
  useEffect(() => {
    const fetchIP = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setCheckInData(prev => ({ ...prev, ipAddress: data.ip }));
      } catch (error) {
        console.log('Could not fetch IP address:', error);
        // Fallback to a placeholder or handle gracefully
        setCheckInData(prev => ({ ...prev, ipAddress: 'Unable to detect' }));
      }
    };
    
    fetchIP();
  }, []);

  // Get event data from URL parameters or localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('eventId');
    
    if (eventId) {
      // In a real app, you'd fetch from backend
      // For now, we'll try to get from localStorage or use sample data
      const storedEventData = localStorage.getItem(`event-${eventId}`);
      if (storedEventData) {
        setEventData(JSON.parse(storedEventData));
      }
    }
  }, []);

  // Request location permission and get coordinates
  useEffect(() => {
    const requestLocation = () => {
      if (!navigator.geolocation) {
        setLocationStatus('unavailable');
        toast({
          title: "Location Not Supported",
          description: "Your browser doesn't support location services.",
          variant: "destructive"
        });
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          
          setCheckInData(prev => ({ ...prev, location: locationData }));
          setLocationAccuracy(position.coords.accuracy);
          setLocationStatus('granted');
          
          toast({
            title: "Location Verified",
            description: `Location detected with ${Math.round(position.coords.accuracy)}m accuracy.`,
          });
        },
        (error) => {
          setLocationStatus('denied');
          let errorMessage = "Location access is required for check-in.";
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location permission denied. Please enable location access.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out.";
              break;
          }
          
          toast({
            title: "Location Required",
            description: errorMessage,
            variant: "destructive"
          });
        },
        options
      );
    };

    requestLocation();
  }, [toast]);

  const handleCheckIn = () => {
    if (!checkInData.location) {
      toast({
        title: "Location Required",
        description: "Please allow location access to check in.",
        variant: "destructive"
      });
      return;
    }

    setIsChecking(true);
    setProgress(0);
    
    // Set the timestamp when check-in starts
    const timestamp = new Date().toISOString();
    
    const finalCheckInData: CheckInData = {
      ...formData,
      location: checkInData.location,
      timestamp: timestamp,
      ipAddress: checkInData.ipAddress
    };

    console.log('Check-in data:', finalCheckInData);
    
    // Simulate check-in process with security validation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsChecking(false);
          
          toast({
            title: "Check-in Successful",
            description: "Your attendance has been recorded with location verification.",
          });
          
          // Here you would normally send the data to your backend
          console.log('Final check-in data submitted:', finalCheckInData);
          
          return 100;
        }
        return prev + 20;
      });
    }, 300);
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const retryLocation = () => {
    setLocationStatus('requesting');
    window.location.reload();
  };

  const isFormValid = formData.name && formData.email && locationStatus === 'granted';

  return (
    <div className="max-w-md mx-auto">
      {/* Event Flier Display */}
      {eventData?.flierData && (
        <Card className="mb-6">
          <CardContent className="p-0">
            <img 
              src={eventData.flierData} 
              alt="Event Flier" 
              className="w-full h-auto rounded-t-lg"
            />
            {eventData.title && (
              <div className="p-4">
                <h2 className="font-semibold text-center">{eventData.title}</h2>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="text-center">
          <div className="w-8 h-8 bg-meetcheck-blue rounded-lg flex items-center justify-center mx-auto mb-2">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <CardTitle>Secure Event Check-In</CardTitle>
          <p className="text-sm text-muted-foreground">
            Location verification and timestamp recording for accurate attendance.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Security Status Indicators */}
          <div className="bg-gray-50 p-3 rounded-lg space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security Verification
            </h4>
            
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4" />
              <span>Location: </span>
              {locationStatus === 'requesting' && <span className="text-yellow-600">Requesting...</span>}
              {locationStatus === 'granted' && (
                <span className="text-green-600">
                  Verified ({Math.round(locationAccuracy)}m accuracy)
                </span>
              )}
              {locationStatus === 'denied' && (
                <span className="text-red-600">Access Denied</span>
              )}
              {locationStatus === 'unavailable' && (
                <span className="text-red-600">Not Available</span>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              <span>Timestamp: Auto-captured on submission</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4" />
              <span>IP Address: {checkInData.ipAddress || 'Detecting...'}</span>
            </div>
          </div>

          {/* Location Error Handling */}
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

          {/* Form Fields */}
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => updateFormData("name", e.target.value)}
              className="mt-1"
              disabled={locationStatus !== 'granted'}
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={(e) => updateFormData("email", e.target.value)}
              className="mt-1"
              disabled={locationStatus !== 'granted'}
            />
          </div>
          
          <div>
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              placeholder="Enter your company name"
              value={formData.company}
              onChange={(e) => updateFormData("company", e.target.value)}
              className="mt-1"
              disabled={locationStatus !== 'granted'}
            />
          </div>

          {/* Check-in Progress */}
          {isChecking && (
            <div className="space-y-2">
              <p className="text-sm text-center">Verifying and Recording Check-in...</p>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Submit Button */}
          <Button
            onClick={handleCheckIn}
            disabled={!isFormValid || isChecking}
            className="w-full bg-meetcheck-blue hover:bg-blue-600"
          >
            {isChecking ? "Processing Secure Check-in..." : "Secure Check-In"}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            By checking in, you consent to location tracking and data collection for attendance verification.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
