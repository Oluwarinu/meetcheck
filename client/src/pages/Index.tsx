
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Users, TrendingUp, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { StatsCard } from "@/components/StatsCard";
import { EventCard } from "@/components/EventCard";
import { apiClient } from "@/lib/api";

export default function Index() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalAttendees: 0,
    upcomingEvents: 0,
    completedEvents: 0
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const events = await apiClient.getEvents();
        
        // Calculate stats from real data
        const now = new Date();
        const upcoming = events.filter(event => new Date(event.date) > now);
        const completed = events.filter(event => new Date(event.date) <= now);
        
        // Get total attendees from all events
        let totalAttendees = 0;
        for (const event of events) {
          try {
            const checkIns = await apiClient.getEventCheckIns(event.id);
            totalAttendees += checkIns.length;
          } catch (error) {
            console.log('Could not fetch check-ins for event:', event.id);
          }
        }
        
        setStats({
          totalEvents: events.length,
          totalAttendees,
          upcomingEvents: upcoming.length,
          completedEvents: completed.length
        });
        
        // Set recent events (last 5)
        const recent = events
          .sort((a, b) => new Date(b.created_at || b.date).getTime() - new Date(a.created_at || a.date).getTime())
          .slice(0, 5)
          .map(event => ({
            id: event.id,
            name: event.title,
            date: event.date,
            attendees: 0, // Will be updated when we get check-ins
            status: new Date(event.date) > now ? "Upcoming" : "Completed"
          }));
        
        setRecentEvents(recent);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your events.
          </p>
        </div>
        <Button asChild className="bg-meetcheck-blue hover:bg-blue-600">
          <Link to="/create-event" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Event
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            <div className="h-24 bg-gray-200 animate-pulse rounded-lg"></div>
            <div className="h-24 bg-gray-200 animate-pulse rounded-lg"></div>
            <div className="h-24 bg-gray-200 animate-pulse rounded-lg"></div>
            <div className="h-24 bg-gray-200 animate-pulse rounded-lg"></div>
          </>
        ) : (
          <>
            <StatsCard
              title="Total Events"
              value={stats.totalEvents}
              subtitle="All time"
              icon={<Calendar className="h-4 w-4" />}
            />
            <StatsCard
              title="Total Attendees"
              value={stats.totalAttendees}
              subtitle="All events"
              icon={<Users className="h-4 w-4" />}
            />
            <StatsCard
              title="Upcoming Events"
              value={stats.upcomingEvents}
              subtitle="This month"
              icon={<TrendingUp className="h-4 w-4" />}
            />
            <StatsCard
              title="Completed Events"
              value={stats.completedEvents}
              subtitle="This month"
              icon={<Clock className="h-4 w-4" />}
            />
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <>
                <div className="h-16 bg-gray-200 animate-pulse rounded-lg"></div>
                <div className="h-16 bg-gray-200 animate-pulse rounded-lg"></div>
                <div className="h-16 bg-gray-200 animate-pulse rounded-lg"></div>
              </>
            ) : recentEvents.length > 0 ? (
              recentEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No events found. Create your first event to get started!</p>
                <Button asChild className="mt-4">
                  <Link to="/create-event">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </Link>
                </Button>
              </div>
            )}
            <Button asChild variant="outline" className="w-full">
              <Link to="/events">View All Events</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full bg-meetcheck-blue hover:bg-blue-600">
              <Link to="/create-event" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create New Event
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/check-in">Quick Check-in</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/reports">View Reports</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
