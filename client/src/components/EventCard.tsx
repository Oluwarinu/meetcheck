
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

interface Event {
  id: string;
  name: string;
  date: string;
  status: "Upcoming" | "In Progress" | "Completed";
  attendance: string;
  location?: string;
}

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Upcoming":
        return "bg-blue-100 text-blue-800";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">{event.name}</h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{event.attendance}</span>
              </div>
              {event.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>
          </div>
          <Badge className={getStatusColor(event.status)}>
            {event.status}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to={`/events/${event.id}`}>View</Link>
          </Button>
          <Button asChild size="sm" className="bg-meetcheck-blue hover:bg-blue-600">
            <Link to={`/events/${event.id}/qr`}>QR Code</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
