import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { EventManagement } from "@/components/EventManagement";
import { useToast } from "@/hooks/use-toast";

export default function Events() {
  const [activeTab, setActiveTab] = useState("all");
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleEventUpdate = (updatedEvent: any) => {
    setEvents(prev => prev.map(event => 
      event.id === updatedEvent.id ? { ...event, ...updatedEvent } : event
    ));
  };

  const handleEventDelete = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  useEffect(() => {
    const fetchEvents = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const userEvents = await apiClient.getEvents();
        setEvents(userEvents);
      } catch (error) {
        console.error("Failed to fetch events:", error);
        toast({
          title: "Error",
          description: "Failed to load events",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user, toast]);

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

  const filteredEvents = events.filter(event => {
    if (activeTab === "all") return true;
    const status = getEventStatus(event);
    return activeTab === "upcoming" ? status === "Upcoming" : status === "Completed";
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
        </div>
        <Button asChild className="bg-meetcheck-blue hover:bg-blue-600">
          <Link to="/create-event" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Event
          </Link>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="bg-white rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-medium">Event Name</TableHead>
                  <TableHead className="font-medium">Date</TableHead>
                  <TableHead className="font-medium">Status</TableHead>
                  <TableHead className="font-medium">Attendance</TableHead>
                  <TableHead className="font-medium">Check-in Status</TableHead>
                  <TableHead className="font-medium text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading events...
                    </TableCell>
                  </TableRow>
                ) : filteredEvents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No events found. Create your first event to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEvents.map((event) => {
                    const status = getEventStatus(event);
                    return (
                      <TableRow key={event.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{event.title}</TableCell>
                        <TableCell className="text-muted-foreground">{event.date}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={getStatusColor(status)}>
                            {status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {event.capacity ? `0/${event.capacity}` : "No limit"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${event.checkin_enabled !== false ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className="text-sm">
                              {event.checkin_enabled !== false ? 'Active' : 'Disabled'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex gap-2 justify-center">
                            <Button asChild variant="outline" size="sm" className="text-meetcheck-blue border-meetcheck-blue hover:bg-meetcheck-light-blue">
                              <Link to={`/events/${event.id}/qr`}>View QR</Link>
                            </Button>
                            <EventManagement 
                              event={event}
                              onEventUpdate={handleEventUpdate}
                              onEventDelete={handleEventDelete}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}