import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api';
import { EventCreationFlow } from './EventCreationFlow';
import { 
  QrCode, 
  Users, 
  Calendar, 
  MapPin, 
  Download,
  Share2,
  Eye,
  Settings,
  Plus,
  BookOpen,
  TrendingUp
} from 'lucide-react';

interface AcademicEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  checkin_enabled: boolean;
  checkin_deadline: string | null;
  current_attendees: number;
  total_checked_in: number;
  status: 'upcoming' | 'today' | 'completed';
}

interface EventManagementDashboardProps {
  showCreateFlow?: boolean;
  onCreateComplete?: () => void;
}

export default function EventManagementDashboard({ 
  showCreateFlow = false, 
  onCreateComplete 
}: EventManagementDashboardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: events = [], isLoading: loading } = useEvents();
  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent();
  const deleteEventMutation = useDeleteEvent();
  const [showCreationFlow, setShowCreationFlow] = useState(showCreateFlow);

  useEffect(() => {
    loadEvents();
    
    // Check if we should show creation flow with template or direct create
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('useTemplate') === 'true' || urlParams.get('create') === 'true') {
      setShowCreationFlow(true);
      // Clear URL parameter after processing
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [user]);

  const loadEvents = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userEvents = await apiClient.getEvents();
      setEvents(userEvents || []);
    } catch (error: any) {
      console.error('Failed to load events:', error);
      toast({
        title: "Loading Error",
        description: error?.message || "Failed to load your academic events.",
        variant: "destructive"
      });
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEventCreated = (newEvent: any) => {
    setEvents(prev => [newEvent, ...prev]);
    setShowCreationFlow(false);
    onCreateComplete?.();
    toast({
      title: "Academic Event Created",
      description: `${newEvent.title} has been created successfully.`,
    });
  };

  const getEventStatus = (event: any) => {
    const eventDate = new Date(event.date);
    const today = new Date();
    
    if (eventDate.toDateString() === today.toDateString()) {
      return 'today';
    } else if (eventDate > today) {
      return 'upcoming';
    } else {
      return 'completed';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'today':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'Upcoming';
      case 'today':
        return 'Today';
      case 'completed':
        return 'Completed';
      default:
        return 'Unknown';
    }
  };

  // Show creation flow if requested
  if (showCreationFlow) {
    return (
      <EventCreationFlow
        onComplete={handleEventCreated}
      />
    );
  }

  // Show loading state
  if (loading) {
    return <EventManagementSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-purple-600" />
            Academic Events
          </h2>
          <p className="text-gray-600 mt-1">Manage your course events and student attendance</p>
        </div>
        <Button
          onClick={() => setShowCreationFlow(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Academic Event
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{events.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Events</p>
                <p className="text-2xl font-bold text-gray-900">
                  {events.filter(e => getEventStatus(e) === 'today').length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">
                  {events.reduce((sum, event) => sum + (event.current_attendees || 0), 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Attendance</p>
                <p className="text-2xl font-bold text-gray-900">87%</p>
              </div>
              <BookOpen className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Academic Events</h3>
        
        {events.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Academic Events Yet</h3>
              <p className="text-gray-600 mb-4">
                Create your first academic event to start tracking student attendance and engagement.
              </p>
              <Button
                onClick={() => setShowCreationFlow(true)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Event
              </Button>
            </CardContent>
          </Card>
        ) : (
          events.map((event) => {
            const status = getEventStatus(event);
            return (
              <Card key={event.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">{event.title}</h4>
                        <Badge className={getStatusColor(status)}>
                          {getStatusText(status)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {event.current_attendees || 0} / {event.capacity} students
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          <QrCode className="h-4 w-4 mr-1" />
                          QR Code
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Export
                        </Button>
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      <Button size="sm" variant="ghost">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}