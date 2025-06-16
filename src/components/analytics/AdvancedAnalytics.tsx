
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  MapPin, 
  Target, 
  Brain,
  AlertTriangle,
  BarChart3,
  PieChart,
  Download
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, FunnelChart, Funnel } from 'recharts';

const realTimeData = [
  { time: '09:00', checkIns: 45, registrations: 120 },
  { time: '09:30', checkIns: 78, registrations: 135 },
  { time: '10:00', checkIns: 120, registrations: 150 },
  { time: '10:30', checkIns: 145, registrations: 160 },
];

const funnelData = [
  { stage: 'Event Views', value: 1000, color: '#8884d8' },
  { stage: 'Registrations', value: 300, color: '#83a6ed' },
  { stage: 'Check-ins', value: 240, color: '#8dd1e1' },
  { stage: 'Engagement', value: 180, color: '#82ca9d' },
];

const segmentData = [
  { segment: '18-25', count: 45, percentage: 30 },
  { segment: '26-35', count: 60, percentage: 40 },
  { segment: '36-45', count: 30, percentage: 20 },
  { segment: '46+', count: 15, percentage: 10 },
];

const cohortData = [
  { month: 'Jan', newAttendees: 120, returning: 80 },
  { month: 'Feb', newAttendees: 150, returning: 90 },
  { month: 'Mar', newAttendees: 180, returning: 110 },
  { month: 'Apr', newAttendees: 160, returning: 140 },
];

const AdvancedAnalytics = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [selectedSegment, setSelectedSegment] = useState('all');

  const handleExportReport = (format: 'csv' | 'excel') => {
    // TODO: Implement actual export functionality
    console.log(`Exporting ${format} report...`);
  };

  return (
    <div className="space-y-6">
      {/* Real-time Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Advanced Analytics</h2>
          <p className="text-gray-600">Real-time insights and predictive analytics</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Live Data
          </Badge>
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Real-time Alerts */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <div>
              <h4 className="font-medium text-orange-800">Real-time Alert</h4>
              <p className="text-sm text-orange-700">Check-in rate is 15% below expected for this time. Consider sending reminder notifications.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="realtime" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
          <TabsTrigger value="funnel">Funnel Analysis</TabsTrigger>
          <TabsTrigger value="segmentation">Segmentation</TabsTrigger>
          <TabsTrigger value="cohort">Cohort Analysis</TabsTrigger>
          <TabsTrigger value="predictive">Predictive</TabsTrigger>
        </TabsList>

        {/* Real-time Dashboard */}
        <TabsContent value="realtime">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Live Check-ins</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">145</div>
                <p className="text-xs text-green-600">+12% from last hour</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Check-in Rate</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">72%</div>
                <p className="text-xs text-red-600">-3% from expected</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Check-in Time</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.3m</div>
                <p className="text-xs text-green-600">-30s improvement</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Peak Hour</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">10:30 AM</div>
                <p className="text-xs text-muted-foreground">Next: 2:00 PM</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Real-time Check-in Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={realTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="checkIns" stroke="#8884d8" strokeWidth={2} name="Check-ins" />
                    <Line type="monotone" dataKey="registrations" stroke="#82ca9d" strokeWidth={2} name="Registrations" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Funnel Analysis */}
        <TabsContent value="funnel">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {funnelData.map((stage, index) => (
                    <div key={stage.stage} className="flex items-center space-x-4">
                      <div className="w-24 text-sm font-medium">{stage.stage}</div>
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-4">
                          <div 
                            className="h-4 rounded-full" 
                            style={{ 
                              width: `${(stage.value / funnelData[0].value) * 100}%`,
                              backgroundColor: stage.color 
                            }}
                          />
                        </div>
                      </div>
                      <div className="w-16 text-sm font-bold">{stage.value}</div>
                      {index > 0 && (
                        <div className="w-12 text-xs text-gray-500">
                          {Math.round((stage.value / funnelData[index - 1].value) * 100)}%
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Drop-off Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h4 className="font-medium text-red-800">Highest Drop-off</h4>
                    <p className="text-sm text-red-600">Registration → Check-in: 20% drop-off</p>
                    <p className="text-xs text-red-500 mt-1">Recommendation: Send check-in reminders 1 hour before event</p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium text-yellow-800">Moderate Drop-off</h4>
                    <p className="text-sm text-yellow-600">Check-in → Engagement: 25% drop-off</p>
                    <p className="text-xs text-yellow-500 mt-1">Recommendation: Improve welcome experience and signage</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Segmentation */}
        <TabsContent value="segmentation">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Age Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        dataKey="count"
                        data={segmentData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ segment, percentage }) => `${segment}: ${percentage}%`}
                      >
                        {segmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(${index * 90}, 70%, 60%)`} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement by Segment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {segmentData.map((segment) => (
                    <div key={segment.segment} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">{segment.segment} years</h4>
                        <p className="text-sm text-gray-600">{segment.count} attendees</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{segment.percentage}%</div>
                        <p className="text-xs text-gray-500">of total</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Cohort Analysis */}
        <TabsContent value="cohort">
          <Card>
            <CardHeader>
              <CardTitle>Attendee Retention Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cohortData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="newAttendees" fill="#8884d8" name="New Attendees" />
                    <Bar dataKey="returning" fill="#82ca9d" name="Returning Attendees" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800">Retention Rate</h4>
                  <p className="text-2xl font-bold text-blue-900">68%</p>
                  <p className="text-sm text-blue-600">Average across all events</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800">Growth Rate</h4>
                  <p className="text-2xl font-bold text-green-900">+15%</p>
                  <p className="text-sm text-green-600">Month-over-month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Predictive Analytics */}
        <TabsContent value="predictive">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>Attendance Forecast</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800">Next Event Prediction</h4>
                    <p className="text-2xl font-bold text-blue-900">285 attendees</p>
                    <p className="text-sm text-blue-600">Confidence: 87%</p>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-medium">Influencing Factors:</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Historical attendance pattern (+15%)</li>
                      <li>• Day of week effect (+8%)</li>
                      <li>• Weather forecast (-3%)</li>
                      <li>• Marketing campaign reach (+12%)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border-l-4 border-green-500 bg-green-50">
                    <h4 className="font-medium text-green-800">Capacity Optimization</h4>
                    <p className="text-sm text-green-700">Increase venue capacity by 20% based on predicted demand</p>
                  </div>
                  <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                    <h4 className="font-medium text-blue-800">Marketing Timing</h4>
                    <p className="text-sm text-blue-700">Send final reminder 2 days before event for optimal check-in rates</p>
                  </div>
                  <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50">
                    <h4 className="font-medium text-yellow-800">Resource Allocation</h4>
                    <p className="text-sm text-yellow-700">Deploy 3 additional check-in stations during peak hours (10-11 AM)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export Advanced Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Button onClick={() => handleExportReport('csv')} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={() => handleExportReport('excel')} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedAnalytics;
