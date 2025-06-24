
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

const sampleEvents = [
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
  },
  {
    id: "3",
    name: "Workshop on Innovation",
    date: "May 25, 2024",
    status: "Completed" as const,
    attendance: "45/50",
  },
  {
    id: "4",
    name: "Networking Event",
    date: "April 10, 2024",
    status: "Completed" as const,
    attendance: "75/100",
  },
  {
    id: "5",
    name: "Product Launch",
    date: "March 5, 2024",
    status: "Completed" as const,
    attendance: "150/200",
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
                  <TableHead className="font-medium text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => (
                  <TableRow key={event.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{event.name}</TableCell>
                    <TableCell className="text-muted-foreground">{event.date}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getStatusColor(event.status)}>
                        {event.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{event.attendance}</TableCell>
                    <TableCell className="text-center">
                      <Button asChild variant="outline" size="sm" className="text-meetcheck-blue border-meetcheck-blue hover:bg-meetcheck-light-blue">
                        <Link to={`/events/${event.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Bottom left New Event button */}
      <div className="fixed bottom-6 left-6">
        <Button asChild className="bg-meetcheck-blue hover:bg-blue-600 shadow-lg">
          <Link to="/create-event" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Event
          </Link>
        </Button>
      </div>
    </div>
  );
}
