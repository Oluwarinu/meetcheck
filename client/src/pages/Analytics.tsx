import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/StatsCard";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";
import EducatorDashboard from "@/components/educator/EducatorDashboard";
import { 
  Search, 
  Users, 
  Clock, 
  TrendingUp, 
  Download, 
  FileText,
  Crown,
  GraduationCap
} from "lucide-react";

export default function Analytics() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // If user is educator, show educator-specific analytics
  if (user?.user_role === 'educator') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <GraduationCap className="h-8 w-8 text-purple-600" />
              Academic Analytics
            </h1>
            <p className="text-gray-600 mt-1">Comprehensive insights into student performance and engagement</p>
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Academic Report
          </Button>
        </div>
        <EducatorDashboard userRole="educator" />
      </div>
    );
  }


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Event Analytics</h1>
          <p className="text-gray-600 mt-1">Track attendance, engagement, and more for your events.</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Attendance"
          value={analytics.totalAttendance}
          icon={<Users className="h-5 w-5" />}
        />
        <StatsCard
          title="Average Check-in Time"
          value={analytics.averageCheckinTime}
          icon={<Clock className="h-5 w-5" />}
        />
        <StatsCard
          title="Unique Attendees"
          value={analytics.uniqueAttendees}
          icon={<Users className="h-5 w-5" />}
        />
      </div>

      {/* Attendance Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Attendance Trends
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-green-600">
            <TrendingUp className="h-3 w-3" />
            +15% Last 30 Days +15%
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Simple chart representation */}
            <div className="h-64 bg-gray-50 rounded-lg flex items-end justify-center p-4">
              <div className="flex items-end gap-4 h-full">
                {analytics.attendanceTrends.map((data, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="bg-blue-500 rounded-t w-12 min-h-4"
                      style={{ height: `${(data.attendees / 250) * 100}%` }}
                    />
                    <span className="text-xs text-gray-600 mt-2">{data.week}</span>
                    <span className="text-xs font-medium">{data.attendees}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session Attendance */}
      <Card>
        <CardHeader>
          <CardTitle>Session Attendance</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download CSV
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download Excel
            </Button>
            <Button variant="default" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Session</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Start Time</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">End Time</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Attendees</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Check-in Rate</th>
                </tr>
              </thead>
              <tbody>
                {sessionData.map((session, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{session.session}</td>
                    <td className="py-3 px-4 text-gray-600">{session.startTime}</td>
                    <td className="py-3 px-4 text-gray-600">{session.endTime}</td>
                    <td className="py-3 px-4">{session.attendees}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${session.checkinRate}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{session.checkinRate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Features */}
      <Card className="bg-orange-50 border-orange-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-orange-600" />
            <CardTitle className="text-orange-900">Upgrade Features</CardTitle>
          </div>
          <CardDescription className="text-orange-700">
            Unlock powerful features to enhance your event analytics experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <table className="w-full">
              <thead>
                <tr className="border-b border-orange-200">
                  <th className="text-left py-3 font-medium text-orange-900">Feature Name</th>
                  <th className="text-left py-3 font-medium text-orange-900">Description</th>
                  <th className="text-left py-3 font-medium text-orange-900">Current Plan</th>
                  <th className="text-left py-3 font-medium text-orange-900">Required Plan</th>
                  <th className="text-left py-3 font-medium text-orange-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {upgradeFeatures.map((feature, index) => (
                  <tr key={index} className="border-b border-orange-100">
                    <td className="py-3 font-medium text-orange-900">{feature.name}</td>
                    <td className="py-3 text-orange-800">{feature.description}</td>
                    <td className="py-3">
                      <Badge variant="outline" className="border-orange-300 text-orange-700">
                        {feature.currentPlan}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Badge className="bg-orange-600 hover:bg-orange-700">
                        {feature.requiredPlan}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                        Upgrade Now
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="text-center pt-4">
              <p className="text-orange-800 mb-4">
                Unlock all these features and many more with a subscription upgrade
              </p>
              <Button className="bg-orange-600 hover:bg-orange-700">
                View All Plans
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}