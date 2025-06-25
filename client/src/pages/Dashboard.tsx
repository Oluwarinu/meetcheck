import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/StatsCard";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";
import { Plus, Calendar, Users, TrendingUp, Clock, Eye, QrCode } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalAttendees: 0,
    checkinRate: 0,
    avgCheckinTime: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const userEvents = await apiClient.getEvents();
        setEvents(userEvents);
        
        // Calculate stats
        const totalEvents = userEvents.length;
        const totalAttendees = userEvents.reduce((sum: number, event: any) => 
          sum + (event.attendees || 0), 0);
        
        setStats({
          totalEvents,
          totalAttendees,
          checkinRate: 87, // Mock data for now
          avgCheckinTime: 2.3 // Mock data for now
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

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

  const recentEvents = events.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your events.</p>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link to="/events/create" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Event
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Events"
          value={stats.totalEvents}
          subtitle="Active events"
          icon={<Calendar className="h-5 w-5" />}
        />
        <StatsCard
          title="Total Attendees"
          value={stats.totalAttendees.toLocaleString()}
          subtitle="All time"
          icon={<Users className="h-5 w-5" />}
        />
        <StatsCard
          title="Check-in Rate"
          value={`${stats.checkinRate}%`}
          subtitle="+3% from last month"
          trend="+3%"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatsCard
          title="Avg. Check-in Time"
          value={`${stats.avgCheckinTime} min`}
          subtitle="Per attendee"
          icon={<Clock className="h-5 w-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Events */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Recent Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading events...</div>
              ) : recentEvents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No recent events found.</p>
                  <Button asChild className="mt-4" variant="outline">
                    <Link to="/events/create">Create Your First Event</Link>
                  </Button>
                </div>
              ) : (
                recentEvents.map((event) => {
                  const status = getEventStatus(event);
                  return (
                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{event.title}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {event.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {event.capacity ? `0/${event.capacity}` : "No limit"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
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
                    </div>
                  );
                })
              )}
              
              {recentEvents.length > 0 && (
                <div className="text-center pt-4">
                  <Button asChild variant="outline">
                    <Link to="/events">View All Events</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <Link to="/events/create" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create New Event
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full">
                <Link to="/checkin" className="flex items-center gap-2">
                  <QrCode className="h-4 w-4" />
                  Quick Check-in
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full">
                <Link to="/analytics" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  View Reports
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}