
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Users, TrendingUp, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { StatsCard } from "@/components/StatsCard";
import { EventCard } from "@/components/EventCard";

const recentEvents = [
  {
    id: "1",
    name: "Tech Meetup",
    date: "July 15, 2024",
    status: "Upcoming" as const,
    attendance: "0/50",
  },
  {
    id: "2",
    name: "Community Gathering",
    date: "June 20, 2024",
    status: "In Progress" as const,
    attendance: "25/100",
  }
];

export default function Index() {
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
        <StatsCard
          title="Total Events"
          value="12"
          subtitle="Active events"
          icon={<Calendar className="h-4 w-4" />}
        />
        <StatsCard
          title="Total Attendees"
          value="1,234"
          subtitle="All time"
          icon={<Users className="h-4 w-4" />}
        />
        <StatsCard
          title="Check-in Rate"
          value="87%"
          trend="+5% from last month"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatsCard
          title="Avg. Check-in Time"
          value="2.3 min"
          subtitle="Per attendee"
          icon={<Clock className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
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
