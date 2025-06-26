import React, { useEffect, useState } from 'react'; // Added useState back for stats
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useEventsQuery } from '@/hooks/useEventsQuery';
import { 
  BookOpen, 
  Users, 
  Calendar, 
  TrendingUp,
  Plus,
  Eye,
  BarChart3,
  FileText,
  Clock,
  CheckCircle
} from 'lucide-react';

export default function EducatorDashboard() {
  const { user } = useAuth();
  const { data: events = [], isLoading: loading, error } = useEventsQuery(); // Use events from hook, provide default
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    totalStudents: 0,
    avgAttendance: 87
  });

  useEffect(() => {
    if (events && events.length > 0) {
      const today = new Date();
      const activeEventsCount = events.filter((event: any) => {
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === today.toDateString();
      }).length;
      
      const totalStudentsCount = events.reduce((sum: number, event: any) =>
        sum + (event.current_attendees || 0), 0);
      
      setStats({
        totalEvents: events.length,
        activeEvents: activeEventsCount,
        totalStudents: totalStudentsCount,
        avgAttendance: 87 // Assuming this is calculated elsewhere or is static for now
      });
    } else if (!loading) { // If not loading and events is empty or undefined
      setStats({
        totalEvents: 0,
        activeEvents: 0,
        totalStudents: 0,
        avgAttendance: 0
      });
    }
  }, [events, loading]);

  if (error) {
    // Handle error state, e.g., display an error message
    return <div className="text-red-500 p-4">Error loading dashboard data: {error.message}</div>;
  }

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

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-48"></div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions & Recent Events Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Quick Actions Skeleton */}
          <Card>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="h-8 bg-gray-200 rounded w-full"></div>
              <div className="h-8 bg-gray-200 rounded w-full"></div>
              <div className="h-8 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>

          {/* Recent Events Skeleton */}
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded w-16 ml-2"></div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const recentEvents = events.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-purple-600" />
            Educator Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.full_name}</p>
        </div>
        <Link to="/educator/events?create=true">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Academic Event
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalEvents}</p>
                <p className="text-xs text-gray-500 mt-1">All time</p>
              </div>
              <Calendar className="h-10 w-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Today</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeEvents}</p>
                <p className="text-xs text-gray-500 mt-1">Events happening today</p>
              </div>
              <Clock className="h-10 w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalStudents}</p>
                <p className="text-xs text-gray-500 mt-1">Across all events</p>
              </div>
              <Users className="h-10 w-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Attendance</p>
                <p className="text-3xl font-bold text-gray-900">{stats.avgAttendance}%</p>
                <p className="text-xs text-gray-500 mt-1">Student participation</p>
              </div>
              <TrendingUp className="h-10 w-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-purple-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/educator/events?create=true">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Create New Event
              </Button>
            </Link>
            <Link to="/templates">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Browse Templates
              </Button>
            </Link>
            <Link to="/analytics">
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                Recent Events
              </CardTitle>
              <Link to="/educator/events">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentEvents.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No events created yet</p>
                <Link to="/educator/events?create=true">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Create Your First Event
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentEvents.map((event) => {
                  const status = getEventStatus(event);
                  return (
                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{event.title}</h4>
                          <Badge className={getStatusColor(status)}>
                            {status === 'today' ? 'Today' : status === 'upcoming' ? 'Upcoming' : 'Completed'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                          <span>{event.location}</span>
                          <span>{event.current_attendees || 0} / {event.capacity} students</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {status === 'today' && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Check-in
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}