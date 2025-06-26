import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api';
import EventCreationFlow from './EventCreationFlow';
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
  created_at: string;
  participant_count?: number;
  checkin_count?: number;
}

interface EventManagementDashboardProps {
  showCreateFlow?: boolean;
  onCreateComplete?: () => void;
}

export const EventManagementDashboard: React.FC<EventManagementDashboardProps> = ({ 
  showCreateFlow = false, 
  onCreateComplete 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<AcademicEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreationFlow, setShowCreationFlow] = useState(showCreateFlow);

  useEffect(() => {
    loadEvents();
  }, [user]);

  const loadEvents = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userEvents = await apiClient.getEvents();
      setEvents(userEvents);
    } catch (error) {
      console.error('Failed to load events:', error);
      toast({
        title: "Loading Error",
        description: "Failed to load your academic events.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateComplete = (eventId: string) => {
    setShowCreationFlow(false);
    loadEvents();
    if (onCreateComplete) {
      onCreateComplete();
    }
    
    // Navigate to QR code page
    window.location.href = `/events/${eventId}/qr`;
  };

  const handleViewQRCode = (eventId: string) => {
    window.open(`/events/${eventId}/qr`, '_blank');
  };

  const handleToggleCheckin = async (eventId: string, enabled: boolean) => {
    try {
      await apiClient.updateEvent(eventId, { checkin_enabled: enabled });
      await loadEvents();
      
      toast({
        title: enabled ? "Check-in Enabled" : "Check-in Disabled",
        description: enabled 
          ? "Students can now check in to this event." 
          : "Check-in has been disabled for this event.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update check-in status.",
        variant: "destructive"
      });
    }
  };

  const getEventStatus = (event: AcademicEvent) => {
    const eventDateTime = new Date(`${event.date}T${event.time}`);
    const now = new Date();
    
    if (eventDateTime > now) {
      return { status: 'upcoming', color: 'bg-blue-100 text-blue-800' };
    } else if (eventDateTime.toDateString() === now.toDateString()) {
      return { status: 'today', color: 'bg-green-100 text-green-800' };
    } else {
      return { status: 'completed', color: 'bg-gray-100 text-gray-800' };
    }
  };

  if (showCreationFlow) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setShowCreationFlow(false)}
          >
            ← Back to Events
          </Button>
        </div>
        <EventCreationFlow onComplete={handleCreateComplete} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
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
                <p className="text-2xl font-bold">{events.length}</p>
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
                <p className="text-2xl font-bold">
                  {events.filter(e => e.checkin_enabled && getEventStatus(e).status !== 'completed').length}
                </p>
              </div>
              <QrCode className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold">
                  {events.reduce((sum, event) => sum + (event.checkin_count || 0), 0)}
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
                <p className="text-2xl font-bold">
                  {events.length > 0 
                    ? Math.round(events.reduce((sum, event) => sum + (event.checkin_count || 0), 0) / events.length)
                    : 0}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {events.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Academic Events Yet</h3>
              <p className="text-gray-600 mb-4">
                Create your first academic event to start tracking student attendance
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
            const eventStatus = getEventStatus(event);
            const attendanceRate = event.capacity > 0 
              ? Math.round(((event.checkin_count || 0) / event.capacity) * 100) 
              : 0;

            return (
              <Card key={event.id} className="border-l-4 border-l-purple-500">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                        <Badge className={eventStatus.color}>
                          {eventStatus.status}
                        </Badge>
                        {event.checkin_enabled ? (
                          <Badge className="bg-green-100 text-green-800">Check-in Active</Badge>
                        ) : (
                          <Badge variant="secondary">Check-in Disabled</Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(event.date + 'T' + event.time).toLocaleString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          {event.checkin_count || 0} / {event.capacity} students ({attendanceRate}%)
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewQRCode(event.id)}
                      >
                        <QrCode className="h-4 w-4 mr-1" />
                        QR Code
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleCheckin(event.id, !event.checkin_enabled)}
                      >
                        {event.checkin_enabled ? 'Disable' : 'Enable'} Check-in
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`/events/${event.id}/analytics`, '_blank')}
                      >
                        <TrendingUp className="h-4 w-4 mr-1" />
                        Analytics
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
};

export default EventManagementDashboard;