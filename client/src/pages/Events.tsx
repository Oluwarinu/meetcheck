import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from '@tanstack/react-query'; // Import useQueryClient
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventManagement } from "@/components/EventManagement";
import { useAuth } from "@/contexts/AuthContext";
import { useEventsQuery } from "@/hooks/useEventsQuery"; // Import useEventsQuery
import { 
  Plus, 
  Search, 
  Calendar, 
  Users, 
  MapPin, 
  Clock,
  Eye,
  QrCode,
  MoreHorizontal,
  Edit,
  Trash2,
  GraduationCap,
  BookOpen
} from "lucide-react";

export default function Events() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: events = [], isLoading: loading, error } = useEventsQuery();
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Effect for error display
  useEffect(() => {
    if (error) {
      console.error("Failed to fetch events:", error);
      // Optionally: show a toast or an error message in the UI
    }
  }, [error]);

  useEffect(() => {
    let filtered = events || []; // Ensure events is not undefined

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status tab
    if (activeTab !== "all") {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        const today = new Date();
        
        switch (activeTab) {
          case "upcoming":
            return eventDate >= today;
          case "completed":
            return eventDate < today;
          default:
            return true;
        }
      });
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, activeTab]);

  const getEventStatus = (event: any) => {
    const eventDate = new Date(event.date);
    const today = new Date();
    
    if (eventDate < today) {
      return "Completed";
    } else if (eventDate.toDateString() === today.toDateString()) {
      return "In Progress";
    } else {
      return "Upcoming";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Upcoming":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "Completed":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const handleEventUpdate = (updatedEvent: any) => {
    // Optimistically update the UI or invalidate query
    queryClient.setQueryData(['events'], (oldData: any[] | undefined) =>
      oldData ? oldData.map(event => event.id === updatedEvent.id ? updatedEvent : event) : []
    );
    // Optionally, could also do: queryClient.invalidateQueries({ queryKey: ['events'] });
    // For more complex updates or if backend returns the full list.
  };

  const handleEventDelete = (eventId: string) => {
    // Optimistically update the UI or invalidate query
    queryClient.setQueryData(['events'], (oldData: any[] | undefined) =>
      oldData ? oldData.filter(event => event.id !== eventId) : []
    );
    // Optionally: queryClient.invalidateQueries({ queryKey: ['events'] });
  };

  const eventsData = events || []; // Use eventsData for calculations to ensure it's an array

  const upcomingCount = eventsData.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= new Date();
  }).length;

  const completedCount = eventsData.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate < new Date();
  }).length;

  // Filter events for educators to show only academic events
  // This filtering logic is applied on the client side after fetching all events.
  // This remains the same, just ensure `filteredEvents` is derived correctly from `eventsData`.
  // The `useEffect` that sets `filteredEvents` already handles this with `events` (now from `useEventsQuery`).

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            {user?.user_role === 'educator' ? (
              <GraduationCap className="h-8 w-8 text-purple-600" />
            ) : (
              <Calendar className="h-8 w-8 text-blue-600" />
            )}
            {user?.user_role === 'educator' ? 'Academic Events' : 'Events'}
          </h1>
          <p className="text-gray-600 mt-1">
            {user?.user_role === 'educator' 
              ? 'Manage your classes, lectures, and academic activities'
              : 'Manage your events and track attendance'
            }
          </p>
        </div>
        <Button asChild className={user?.user_role === 'educator' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'}>
          <Link to="/events/create" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {user?.user_role === 'educator' ? 'Create Academic Event' : 'New Event'}
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All ({events.length})</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming ({upcomingCount})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedCount})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <EventsGrid 
            events={filteredEvents} 
            loading={loading}
            onEventUpdate={handleEventUpdate}
            onEventDelete={handleEventDelete}
            getEventStatus={getEventStatus}
            getStatusColor={getStatusColor}
          />
        </TabsContent>

        <TabsContent value="upcoming" className="mt-6">
          <EventsGrid 
            events={filteredEvents} 
            loading={loading}
            onEventUpdate={handleEventUpdate}
            onEventDelete={handleEventDelete}
            getEventStatus={getEventStatus}
            getStatusColor={getStatusColor}
          />
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <EventsGrid 
            events={filteredEvents} 
            loading={loading}
            onEventUpdate={handleEventUpdate}
            onEventDelete={handleEventDelete}
            getEventStatus={getEventStatus}
            getStatusColor={getStatusColor}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface EventsGridProps {
  events: any[];
  loading: boolean;
  onEventUpdate: (event: any) => void;
  onEventDelete: (eventId: string) => void;
  getEventStatus: (event: any) => string;
  getStatusColor: (status: string) => string;
}

function EventsGrid({ 
  events, 
  loading, 
  onEventUpdate, 
  onEventDelete, 
  getEventStatus, 
  getStatusColor 
}: EventsGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
        <p className="text-gray-600 mb-6">Get started by creating your first event.</p>
        <Button asChild>
          <Link to="/events/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => {
        const status = getEventStatus(event);
        return (
          <Card key={event.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
                  <CardDescription className="line-clamp-2 mt-1">
                    {event.description}
                  </CardDescription>
                </div>
                <EventManagement
                  event={event}
                  onEventUpdate={onEventUpdate}
                  onEventDelete={onEventDelete}
                />
              </div>
              
              <div className="flex items-center justify-between mt-3">
                <Badge variant="secondary" className={getStatusColor(status)}>
                  {status}
                </Badge>
                <div className="flex gap-1">
                  <Button asChild variant="ghost" size="sm">
                    <Link to={`/events/${event.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <Link to={`/events/${event.id}/qr`}>
                      <QrCode className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {/* Event Details */}
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{event.date}</span>
                  {event.time && (
                    <>
                      <Clock className="h-4 w-4 ml-2" />
                      <span>{event.time}</span>
                    </>
                  )}
                </div>
                
                {event.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{event.location}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>
                    {event.attendees || 0}
                    {event.capacity ? `/${event.capacity}` : ""} attendees
                  </span>
                </div>
              </div>

              {/* Check-in Status */}
              {event.checkin_enabled && (
                <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                  ✓ Check-in enabled
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}