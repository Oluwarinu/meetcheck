import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface EventData {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  participant_fields: any[];
  checkin_enabled: boolean;
  checkin_deadline: string | null;
}

export default function PublicCheckIn() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle');
  const [ipAddress, setIpAddress] = useState<string>('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/public/events/${eventId}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to load event');
        }
        
        setEvent(data);
        
        // Initialize form data with default values
        const initialData: Record<string, any> = {};
        data.participant_fields?.forEach((field: any) => {
          initialData[field.id] = field.type === 'checkbox' ? false : '';
        });
        setFormData(initialData);
        
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  useEffect(() => {
    // Get user's IP address
    const getIpAddress = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setIpAddress(data.ip);
      } catch (error) {
        console.error('Failed to get IP address:', error);
        setIpAddress('unknown');
      }
    };

    getIpAddress();

    // Request location permission
    setLocationStatus('requesting');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationData({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
          setLocationStatus('granted');
        },
        (error) => {
          console.error('Location error:', error);
          setLocationStatus('denied');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    } else {
      setLocationStatus('denied');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!event) return;
    
    // Validate required fields
    const requiredFields = event.participant_fields.filter(field => field.required);
    const missingFields = requiredFields.filter(field => !formData[field.id] || formData[field.id] === '');
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Required Fields",
        description: `Please fill in: ${missingFields.map(f => f.label).join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    // Check location verification requirement
    if (event.location_verification && locationStatus !== 'granted') {
      toast({
        title: "Location Required",
        description: "This event requires location verification. Please allow location access to check in.",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const response = await fetch(`/api/public/events/${eventId}/checkin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name || '',
          email: formData.email || '',
          data: formData,
          location_data: locationData,
          ip_address: ipAddress
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Check-in failed');
      }

      setProgress(100);
      
      toast({
        title: "Check-in Successful!",
        description: "You have been successfully checked into the event.",
      });

      // Show success state for a moment before redirecting
      setTimeout(() => {
        navigate('/', { state: { checkInSuccess: true } });
      }, 2000);

    } catch (error: any) {
      toast({
        title: "Check-in Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      clearInterval(progressInterval);
      setSubmitting(false);
    }
  };

  const updateFormData = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const renderField = (field: any) => {
    const commonProps = {
      id: field.id,
      required: field.required
    };

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <Input
            {...commonProps}
            type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
            placeholder={field.placeholder || ''}
            value={formData[field.id] || ''}
            onChange={(e) => updateFormData(field.id, e.target.value)}
          />
        );
      
      case 'textarea':
        return (
          <Textarea
            {...commonProps}
            placeholder={field.placeholder || ''}
            value={formData[field.id] || ''}
            onChange={(e) => updateFormData(field.id, e.target.value)}
          />
        );
      
      case 'select':
        return (
          <Select
            value={formData[field.id] || ''}
            onValueChange={(value) => updateFormData(field.id, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || 'Select an option'} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option: string, index: number) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'radio':
        return (
          <RadioGroup
            value={formData[field.id] || ''}
            onValueChange={(value) => updateFormData(field.id, value)}
          >
            {field.options?.map((option: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${index}`} />
                <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.id}
              checked={formData[field.id] || false}
              onCheckedChange={(checked) => updateFormData(field.id, checked)}
            />
            <Label htmlFor={field.id}>{field.label}</Label>
          </div>
        );
      
      default:
        return (
          <Input
            {...commonProps}
            value={formData[field.id] || ''}
            onChange={(e) => updateFormData(field.id, e.target.value)}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Event Not Found</h2>
            <p className="text-gray-600">The event you're looking for doesn't exist or is no longer available.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* MeetCheck Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-xl mr-3">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 cursor-pointer" onClick={() => navigate('/')}>
              MeetCheck
            </h1>
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-blue-900">{event.title}</CardTitle>
            <CardDescription>{event.description}</CardDescription>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-4 text-sm text-gray-600">
              <div className="flex items-center justify-center">
                <Calendar className="h-4 w-4 mr-1" />
                {event.date}
              </div>
              <div className="flex items-center justify-center">
                <Clock className="h-4 w-4 mr-1" />
                {event.time}
              </div>
              <div className="flex items-center justify-center">
                <MapPin className="h-4 w-4 mr-1" />
                {event.location}
              </div>
            </div>

            {/* QR Code Expiry Timer */}
            {event.checkin_deadline && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center justify-center text-yellow-800">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">
                    Check-in closes: {new Date(event.checkin_deadline).toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* Event Flier */}
            {event.flier_data && (
              <div className="mt-4">
                <img 
                  src={event.flier_data} 
                  alt="Event Flier" 
                  className="w-full max-w-md mx-auto rounded-lg shadow-sm"
                />
              </div>
            )}
          </CardHeader>

          <CardContent>
            {submitting && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Processing check-in...</span>
                  <span className="text-sm text-gray-500">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {event.participant_fields?.map((field) => (
                <div key={field.id} className="space-y-2">
                  {field.type !== 'checkbox' && (
                    <Label htmlFor={field.id} className="flex items-center">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                  )}
                  {renderField(field)}
                </div>
              ))}

              {/* Location Status Indicators */}
              {event.location_verification && (
                <div className="space-y-2">
                  {locationStatus === 'requesting' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                        <span className="text-sm text-blue-800">
                          Requesting location access...
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {locationStatus === 'granted' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        <span className="text-sm text-green-800">
                          Location verified successfully
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {locationStatus === 'denied' && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                        <span className="text-sm text-red-800">
                          Location access is required for this event. Please allow location access to continue.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {!event.location_verification && locationStatus === 'denied' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                    <span className="text-sm text-yellow-800">
                      Location access was denied. Your check-in will still be recorded.
                    </span>
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={submitting || (event.location_verification && locationStatus !== 'granted')}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Checking In...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Check In to Event
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}