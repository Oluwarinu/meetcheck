import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Building2, 
  GraduationCap, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  AlertTriangle, 
  Calendar,
  BarChart3,
  CheckCircle,
  Clock,
  DollarSign,
  UserCheck,
  Brain,
  Award,
  Zap
} from 'lucide-react';

interface DashboardMetric {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
}

interface SmartAlert {
  type: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  action?: string;
  icon: React.ComponentType<any>;
}

interface IndustryDashboardProps {
  industryType: 'corporate' | 'education' | 'networking';
  userRole: string;
}

const DASHBOARD_CONFIG = {
  corporate: {
    title: 'Corporate Training Dashboard',
    subtitle: 'Training Management Portal',
    icon: Building2,
    color: 'from-blue-600 to-blue-700',
    quickActions: [
      { label: 'Create Training', icon: Calendar, color: 'bg-blue-600' },
      { label: 'View Compliance', icon: BarChart3, color: 'bg-emerald-600' },
      { label: 'Manage Teams', icon: Users, color: 'bg-purple-600' }
    ],
    metrics: [
      { label: 'Avg Completion', value: '89%', change: '+5% vs LM', trend: 'up' as const, icon: Target, color: 'text-green-600' },
      { label: 'Overdue Trainings', value: 3, change: 'Need Action', trend: 'neutral' as const, icon: AlertTriangle, color: 'text-amber-600' },
      { label: 'Due This Week', value: 5, change: '', trend: 'neutral' as const, icon: Clock, color: 'text-blue-600' }
    ],
    alerts: [
      { type: 'high' as const, title: 'Sales Team Compliance Due Tomorrow', description: 'Product security training deadline approaching', action: 'Send Reminder', icon: AlertTriangle },
      { type: 'medium' as const, title: 'IT Security Training Low Attendance', description: 'Current attendance: 45% - Consider rescheduling', action: 'View Details', icon: TrendingDown },
      { type: 'low' as const, title: 'Optimal Scheduling Opportunity', description: 'Marketing workshop perfect time: 2PM Tuesday', action: 'Schedule', icon: Brain }
    ]
  },
  
  education: {
    title: 'Educational Institution Dashboard',
    subtitle: 'Professor Portal',
    icon: GraduationCap,
    color: 'from-emerald-600 to-emerald-700',
    quickActions: [
      { label: 'Create Lecture', icon: Calendar, color: 'bg-emerald-600' },
      { label: 'Student Analytics', icon: BarChart3, color: 'bg-blue-600' },
      { label: 'Grade Correlation', icon: Award, color: 'bg-purple-600' }
    ],
    metrics: [
      { label: 'Avg Attendance', value: '92%', change: 'This Week', trend: 'up' as const, icon: UserCheck, color: 'text-green-600' },
      { label: 'Top Performing Class', value: 'CS-201', change: '96% Rate', trend: 'up' as const, icon: Award, color: 'text-purple-600' },
      { label: 'Students at Risk', value: 3, change: '<60% Attendance', trend: 'neutral' as const, icon: AlertTriangle, color: 'text-amber-600' }
    ],
    alerts: [
      { type: 'high' as const, title: 'Student Attendance Alert', description: '3 students with <60% attendance showing grade risk correlation', action: 'Contact Students', icon: AlertTriangle },
      { type: 'medium' as const, title: 'CS-301 Engagement Drop', description: 'Attendance down 12% since midterm week', action: 'Analyze Pattern', icon: TrendingDown },
      { type: 'low' as const, title: 'Optimal Class Time Identified', description: 'Tuesday 10AM shows highest engagement rates', action: 'Consider Schedule', icon: Brain }
    ]
  },
  
  networking: {
    title: 'Networking Event Dashboard',
    subtitle: 'Event Success Center',
    icon: Users,
    color: 'from-purple-600 to-purple-700',
    quickActions: [
      { label: 'Create Event', icon: Calendar, color: 'bg-purple-600' },
      { label: 'Lead Tracking', icon: Target, color: 'bg-emerald-600' },
      { label: 'ROI Analysis', icon: DollarSign, color: 'bg-blue-600' }
    ],
    metrics: [
      { label: 'New Connections', value: 156, change: 'Made Today', trend: 'up' as const, icon: Users, color: 'text-purple-600' },
      { label: 'Follow-ups Pending', value: 234, change: 'Active Leads', trend: 'neutral' as const, icon: Zap, color: 'text-amber-600' },
      { label: 'Estimated Pipeline', value: '$45K', change: 'Potential Value', trend: 'up' as const, icon: DollarSign, color: 'text-green-600' }
    ],
    alerts: [
      { type: 'high' as const, title: 'High-Value Lead Identified', description: 'C-Level executive from Fortune 500 company checked in', action: 'Priority Follow-up', icon: Target },
      { type: 'medium' as const, title: 'Industry Cluster Forming', description: 'FinTech professionals showing high engagement', action: 'Facilitate Connections', icon: Users },
      { type: 'low' as const, title: 'Optimal Networking Window', description: 'Peak connection activity: 3-4PM coffee break', action: 'Send Notification', icon: Brain }
    ]
  }
};

export default function IndustryDashboard({ industryType, userRole }: IndustryDashboardProps) {
  const config = DASHBOARD_CONFIG[industryType];
  const DashboardIcon = config.icon;

  const getTrendIcon = (trend?: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getAlertColor = (type: 'high' | 'medium' | 'low') => {
    switch (type) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-amber-200 bg-amber-50';
      case 'low':
        return 'border-blue-200 bg-blue-50';
    }
  };

  const getAlertBadgeColor = (type: 'high' | 'medium' | 'low') => {
    switch (type) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-amber-100 text-amber-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${config.color} text-white`}>
            <DashboardIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{config.title}</h1>
            <p className="text-gray-600">{config.subtitle}</p>
          </div>
        </div>
        <Badge variant="outline" className="text-sm">
          {userRole}
        </Badge>
      </div>

      {/* Quick Actions Bar */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            {config.quickActions.map((action) => {
              const ActionIcon = action.icon;
              return (
                <Button key={action.label} className={`${action.color} hover:opacity-90 text-white`}>
                  <ActionIcon className="h-4 w-4 mr-2" />
                  {action.label}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {config.metrics.map((metric, index) => {
          const MetricIcon = metric.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{metric.label}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                      {getTrendIcon(metric.trend)}
                    </div>
                    {metric.change && (
                      <p className="text-xs text-gray-500 mt-1">{metric.change}</p>
                    )}
                  </div>
                  <div className={`p-3 rounded-lg bg-gray-50`}>
                    <MetricIcon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Smart Priority Feed */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-lg">Smart Priority Feed</CardTitle>
            <Badge variant="secondary" className="text-xs">
              AI-Powered Suggestions
            </Badge>
          </div>
          <CardDescription>
            Intelligent insights and recommendations based on your event data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {config.alerts.map((alert, index) => {
            const AlertIcon = alert.icon;
            return (
              <Alert key={index} className={getAlertColor(alert.type)}>
                <AlertIcon className="h-4 w-4" />
                <div className="flex items-center justify-between w-full">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{alert.title}</span>
                      <Badge variant="secondary" className={`text-xs ${getAlertBadgeColor(alert.type)}`}>
                        {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} Priority
                      </Badge>
                    </div>
                    <AlertDescription className="text-sm">
                      {alert.description}
                    </AlertDescription>
                  </div>
                  {alert.action && (
                    <Button variant="outline" size="sm" className="ml-4">
                      {alert.action}
                    </Button>
                  )}
                </div>
              </Alert>
            );
          })}
        </CardContent>
      </Card>

      {/* Industry-Specific Analytics Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Industry Analytics Preview</CardTitle>
          <CardDescription>
            Advanced insights tailored for {industryType} events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">Enhanced Analytics Dashboard</p>
            <p className="text-sm">
              Detailed {industryType} metrics, performance correlation, and predictive insights coming soon
            </p>
            <Button variant="outline" className="mt-4">
              Preview Advanced Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}