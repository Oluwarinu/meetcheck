
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Clock, Users, TrendingUp, Download, FileText } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSubscription } from "@/contexts/SubscriptionContext";
import { SubscriptionGuard } from "@/components/SubscriptionGuard";
import { hasFeatureAccess } from "@/utils/subscriptionTiers";
import AdvancedAnalytics from "@/components/analytics/AdvancedAnalytics";
import { useToast } from "@/hooks/use-toast";

const attendanceData = [
  { week: 'Week 1', attendance: 180 },
  { week: 'Week 2', attendance: 220 },
  { week: 'Week 3', attendance: 200 },
  { week: 'Week 4', attendance: 280 },
];

const sessionData = [
  {
    session: 'Session 1: Keynote',
    startTime: '9:00 AM',
    endTime: '10:00 AM',
    attendees: 150,
    checkInRate: 80
  },
  {
    session: 'Session 2: Workshop',
    startTime: '11:00 AM',
    endTime: '12:00 PM',
    attendees: 100,
    checkInRate: 75
  },
  {
    session: 'Session 3: Networking',
    startTime: '1:00 PM',
    endTime: '2:00 PM',
    attendees: 80,
    checkInRate: 60
  }
];

export default function Analytics() {
  const { tier } = useSubscription();
  const { toast } = useToast();

  const handleDownloadCSV = () => {
    // TODO: Implement actual CSV download
    toast({
      title: "Downloading CSV",
      description: "Your CSV report is being generated and will download shortly.",
    });
  };

  const handleDownloadExcel = () => {
    // TODO: Implement actual Excel download
    toast({
      title: "Downloading Excel Report",
      description: "Your Excel report is being generated and will download shortly.",
    });
  };

  const handleDownloadReport = () => {
    // TODO: Implement actual report download
    toast({
      title: "Downloading Report",
      description: "Your detailed report is being generated and will download shortly.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Event Analytics</h1>
        <p className="text-muted-foreground">Track attendance, engagement, and more for your events.</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search events" className="pl-10" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Total Attendance"
          value="250"
          icon={<Users className="h-4 w-4" />}
        />
        <StatsCard
          title="Average Check-in Time"
          value="10:30 AM"
          icon={<Clock className="h-4 w-4" />}
        />
        <StatsCard
          title="Unique Attendees"
          value="200"
          icon={<Users className="h-4 w-4" />}
        />
      </div>

      {/* Basic Analytics - Available to all tiers */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="font-semibold text-green-600">+15%</span>
              <span className="text-muted-foreground">Last 30 Days +15%</span>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="attendance" stroke="hsl(var(--meetcheck-blue))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Session Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">Session</th>
                  <th className="text-left py-2 font-medium">Start Time</th>
                  <th className="text-left py-2 font-medium">End Time</th>
                  <th className="text-left py-2 font-medium">Attendees</th>
                  <th className="text-left py-2 font-medium">Check-in Rate</th>
                </tr>
              </thead>
              <tbody>
                {sessionData.map((session, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3">{session.session}</td>
                    <td className="py-3 text-muted-foreground">{session.startTime}</td>
                    <td className="py-3 text-muted-foreground">{session.endTime}</td>
                    <td className="py-3">{session.attendees}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-meetcheck-blue h-2 rounded-full" 
                            style={{ width: `${session.checkInRate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm">{session.checkInRate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Download Options with Tier Restrictions */}
          <div className="flex gap-2 mt-4">
            {/* CSV Download - Available to all tiers */}
            <Button onClick={handleDownloadCSV} variant="outline" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Download CSV</span>
            </Button>
            
            {/* Excel Download - Professional/Enterprise only */}
            {hasFeatureAccess(tier, 'hasAdvancedAnalytics') ? (
              <Button onClick={handleDownloadExcel} variant="outline" className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Download Excel</span>
              </Button>
            ) : (
              <SubscriptionGuard
                requiredFeature="hasAdvancedAnalytics"
                fallbackTitle="Excel Export Requires Upgrade"
                fallbackDescription="Excel downloads are available for Professional and Enterprise users only."
              >
                <Button disabled variant="outline" className="flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Download Excel</span>
                </Button>
              </SubscriptionGuard>
            )}
            
            {/* Report Download - Professional/Enterprise only */}
            {hasFeatureAccess(tier, 'hasAdvancedAnalytics') ? (
              <Button onClick={handleDownloadReport} className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Generate Report</span>
              </Button>
            ) : (
              <SubscriptionGuard
                requiredFeature="hasAdvancedAnalytics"
                fallbackTitle="Advanced Reports Require Upgrade"
                fallbackDescription="Detailed reports are available for Professional and Enterprise users only."
              >
                <Button disabled className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Generate Report</span>
                </Button>
              </SubscriptionGuard>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Analytics - Professional/Enterprise Only */}
      <SubscriptionGuard
        requiredFeature="hasAdvancedAnalytics"
        fallbackTitle="Advanced Analytics Available with Professional Plan"
        fallbackDescription="Unlock real-time dashboards, funnel analysis, segmentation, and predictive analytics with our Professional or Enterprise plans."
      >
        <AdvancedAnalytics />
      </SubscriptionGuard>
    </div>
  );
}
