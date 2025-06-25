import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Activity, 
  TrendingUp, 
  Users, 
  Calendar, 
  Clock, 
  Target,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const realTimeData = [
  { time: '10:00', checkIns: 45, expectedCheckIns: 50 },
  { time: '10:15', checkIns: 78, expectedCheckIns: 80 },
  { time: '10:30', checkIns: 120, expectedCheckIns: 110 },
  { time: '10:45', checkIns: 156, expectedCheckIns: 140 },
  { time: '11:00', checkIns: 189, expectedCheckIns: 170 },
];

const funnelData = [
  { stage: 'Registered', value: 300, percentage: 100 },
  { stage: 'Confirmed', value: 250, percentage: 83 },
  { stage: 'Checked In', value: 200, percentage: 67 },
  { stage: 'Engaged', value: 150, percentage: 50 },
];

const segmentationData = [
  { name: 'First-time', value: 120, color: '#8884d8' },
  { name: 'Returning', value: 80, color: '#82ca9d' },
  { name: 'VIP', value: 40, color: '#ffc658' },
  { name: 'Corporate', value: 60, color: '#ff7300' },
];

const cohortData = [
  { cohort: 'Jan 2024', week1: 100, week2: 85, week3: 70, week4: 60 },
  { cohort: 'Feb 2024', week1: 120, week2: 100, week3: 85, week4: 75 },
  { cohort: 'Mar 2024', week1: 150, week2: 130, week3: 110, week4: 95 },
];

const predictiveData = [
  { month: 'Jan', actual: 240, predicted: 250 },
  { month: 'Feb', actual: 280, predicted: 275 },
  { month: 'Mar', actual: 320, predicted: 315 },
  { month: 'Apr', actual: null, predicted: 350 },
  { month: 'May', actual: null, predicted: 380 },
];

const AdvancedAnalytics = () => {
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Advanced Analytics</h2>
          <p className="text-gray-600">Professional insights for data-driven decisions</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`h-3 w-3 rounded-full ${isLiveMode ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <span className="text-sm text-gray-600">
              {isLiveMode ? 'Live Mode' : 'Historical Mode'}
            </span>
          </div>
          <Button
            onClick={() => setIsLiveMode(!isLiveMode)}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Toggle Mode</span>
          </Button>
        </div>
      </div>

      {/* Real-time Alerts */}
      {alertsEnabled && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <h4 className="font-medium text-green-800">Check-in Rate Above Target</h4>
                  <p className="text-sm text-green-600">89% check-in rate (Target: 85%)</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-amber-500">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <div>
                  <h4 className="font-medium text-amber-800">Slow Check-in Detected</h4>
                  <p className="text-sm text-amber-600">Consider opening additional registration desk</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="realtime" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="realtime">Real-Time</TabsTrigger>
          <TabsTrigger value="funnel">Funnel Analysis</TabsTrigger>
          <TabsTrigger value="segmentation">Segmentation</TabsTrigger>
          <TabsTrigger value="cohort">Cohort Analysis</TabsTrigger>
          <TabsTrigger value="predictive">Predictive</TabsTrigger>
        </TabsList>

        {/* Real-Time Dashboard */}
        <TabsContent value="realtime" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium">Live Check-ins</span>
                </div>
                <div className="text-2xl font-bold">189</div>
                <div className="flex items-center space-x-1 text-sm">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">+12% vs expected</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium">Avg Check-in Time</span>
                </div>
                <div className="text-2xl font-bold">2.3m</div>
                <div className="text-sm text-gray-600">Per attendee</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium">Check-in Rate</span>
                </div>
                <div className="text-2xl font-bold">89%</div>
                <div className="text-sm text-green-600">Above target</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="h-5 w-5 text-indigo-600" />
                  <span className="text-sm font-medium">Active Now</span>
                </div>
                <div className="text-2xl font-bold">156</div>
                <div className="text-sm text-gray-600">In venue</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Real-Time Check-in Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={realTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="checkIns" 
                      stroke="#2563eb" 
                      strokeWidth={3}
                      name="Actual Check-ins"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="expectedCheckIns" 
                      stroke="#9ca3af" 
                      strokeDasharray="5 5"
                      name="Expected Check-ins"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Funnel Analysis */}
        <TabsContent value="funnel" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendee Journey Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {funnelData.map((stage, index) => (
                  <div key={stage.stage} className="flex items-center space-x-4">
                    <div className="w-24 text-sm font-medium">{stage.stage}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">{stage.value} attendees</span>
                        <span className="text-sm font-medium">{stage.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                          style={{ width: `${stage.percentage}%` }}
                        />
                      </div>
                    </div>
                    {index > 0 && (
                      <div className="w-16 text-sm text-red-600">
                        -{funnelData[index-1].value - stage.value}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Drop-off Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="text-sm">Registration → Confirmation</span>
                    <Badge variant="destructive">17% drop-off</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                    <span className="text-sm">Confirmation → Check-in</span>
                    <Badge className="bg-amber-500">20% drop-off</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span className="text-sm">Check-in → Engagement</span>
                    <Badge className="bg-orange-500">25% drop-off</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Optimization Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border-l-4 border-l-blue-500 bg-blue-50">
                    <h4 className="font-medium text-blue-900">Send Reminder Emails</h4>
                    <p className="text-sm text-blue-700">Reduce confirmation drop-off by 8-12%</p>
                  </div>
                  <div className="p-3 border-l-4 border-l-green-500 bg-green-50">
                    <h4 className="font-medium text-green-900">Streamline Check-in</h4>
                    <p className="text-sm text-green-700">QR codes can improve check-in by 15%</p>
                  </div>
                  <div className="p-3 border-l-4 border-l-purple-500 bg-purple-50">
                    <h4 className="font-medium text-purple-900">Gamify Experience</h4>
                    <p className="text-sm text-purple-700">Increase engagement by 20%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Segmentation */}
        <TabsContent value="segmentation" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendee Segments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={segmentationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {segmentationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Segment Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {segmentationData.map((segment) => (
                    <div key={segment.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: segment.color }}
                        />
                        <span className="font-medium">{segment.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{segment.value}</div>
                        <div className="text-sm text-gray-600">
                          {((segment.value / 300) * 100).toFixed(1)}% of total
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Cohort Analysis */}
        <TabsContent value="cohort" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cohort Retention Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cohortData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="cohort" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="week1" stroke="#8884d8" name="Week 1" />
                    <Line type="monotone" dataKey="week2" stroke="#82ca9d" name="Week 2" />
                    <Line type="monotone" dataKey="week3" stroke="#ffc658" name="Week 3" />
                    <Line type="monotone" dataKey="week4" stroke="#ff7300" name="Week 4" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Predictive Analytics */}
        <TabsContent value="predictive" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Forecasting</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={predictiveData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="actual" 
                      stroke="#2563eb" 
                      strokeWidth={3}
                      name="Actual Attendance"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="predicted" 
                      stroke="#dc2626" 
                      strokeDasharray="5 5"
                      strokeWidth={2}
                      name="Predicted Attendance"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Forecasting Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900">Growth Trend</h4>
                    <p className="text-sm text-blue-700">Expected 15% increase in April attendance</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900">Seasonal Pattern</h4>
                    <p className="text-sm text-green-700">Spring events show 20% higher attendance</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900">Confidence Level</h4>
                    <p className="text-sm text-purple-700">87% accuracy based on historical data</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actionable Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border-l-4 border-l-blue-500 bg-blue-50">
                    <h4 className="font-medium text-blue-900">Increase Capacity</h4>
                    <p className="text-sm text-blue-700">Consider larger venue for May event</p>
                  </div>
                  <div className="p-3 border-l-4 border-l-green-500 bg-green-50">
                    <h4 className="font-medium text-green-900">Staff Planning</h4>
                    <p className="text-sm text-green-700">Add 2 more registration staff for April</p>
                  </div>
                  <div className="p-3 border-l-4 border-l-orange-500 bg-orange-50">
                    <h4 className="font-medium text-orange-900">Marketing Budget</h4>
                    <p className="text-sm text-orange-700">Increase by 25% to meet demand</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalytics;
