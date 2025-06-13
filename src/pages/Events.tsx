
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { EventCard } from "@/components/EventCard";

const sampleEvents = [
  {
    id: "1",
    name: "Tech Meetup",
    date: "July 15, 2024",
    status: "Upcoming" as const,
    attendance: "0/50",
    location: "Innovation Center"
  },
  {
    id: "2",
    name: "Community Gathering",
    date: "June 20, 2024",
    status: "In Progress" as const,
    attendance: "25/100",
    location: "Community Hall"
  },
  {
    id: "3",
    name: "Workshop on Innovation",
    date: "May 25, 2024",
    status: "Completed" as const,
    attendance: "45/50",
    location: "Tech Hub"
  },
  {
    id: "4",
    name: "Networking Event",
    date: "April 10, 2024",
    status: "Completed" as const,
    attendance: "75/100",
    location: "Business Center"
  },
  {
    id: "5",
    name: "Product Launch",
    date: "March 5, 2024",
    status: "Completed" as const,
    attendance: "150/200",
    location: "Convention Center"
  }
];

export default function Events() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredEvents = sampleEvents.filter(event => {
    if (activeTab === "all") return true;
    if (activeTab === "upcoming") return event.status === "Upcoming";
    if (activeTab === "completed") return event.status === "Completed";
    return false;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-muted-foreground">Manage your events and track attendance</p>
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
