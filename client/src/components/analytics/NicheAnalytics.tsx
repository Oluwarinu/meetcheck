
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Building, GraduationCap, Users, TrendingUp, Award, BookOpen } from 'lucide-react';

interface NicheAnalyticsProps {
  eventData: any;
  eventCategory: string;
}

export function NicheAnalytics({ eventData, eventCategory }: NicheAnalyticsProps) {
  const renderCorporateAnalytics = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Training Completion Rate</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">87%</div>
          <Progress value={87} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-2">
            +12% from last training session
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Department Performance</CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Engineering</span>
              <Badge variant="secondary">95%</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Marketing</span>
              <Badge variant="secondary">82%</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Sales</span>
              <Badge variant="secondary">78%</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Certification Tracking</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">143</div>
          <p className="text-xs text-muted-foreground">
            Certificates issued this month
          </p>
          <div className="mt-2">
            <Badge variant="outline">Pending: 23</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderEducationalAnalytics = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Attendance vs Performance</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">0.85</div>
          <p className="text-xs text-muted-foreground">
            Correlation coefficient
          </p>
          <Progress value={85} className="mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Faculty Engagement</CardTitle>
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Engineering</span>
              <Badge variant="secondary">92%</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Sciences</span>
              <Badge variant="secondary">88%</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Arts</span>
              <Badge variant="secondary">85%</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Campus Utilization</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">78%</div>
          <p className="text-xs text-muted-foreground">
            Average facility usage
          </p>
          <div className="mt-2 space-y-1">
            <div className="text-xs">Main Campus: 85%</div>
            <div className="text-xs">Campus A: 72%</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderNetworkingAnalytics = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Connection Quality</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">73%</div>
          <p className="text-xs text-muted-foreground">
            Follow-up rate within 48 hours
          </p>
          <Progress value={73} className="mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Lead Generation</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">156</div>
          <p className="text-xs text-muted-foreground">
            Qualified leads generated
          </p>
          <div className="mt-2">
            <Badge variant="secondary">Hot: 23</Badge>
            <Badge variant="outline" className="ml-1">Warm: 78</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Industry Representation</CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Technology</span>
              <Badge variant="secondary">35%</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Finance</span>
              <Badge variant="secondary">28%</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Healthcare</span>
              <Badge variant="secondary">18%</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {eventCategory === 'corporate-training' && 'Corporate Training Analytics'}
          {eventCategory === 'educational' && 'Educational Analytics'}
          {eventCategory === 'networking' && 'Networking Analytics'}
        </h2>
        <Badge variant="outline">
          {eventCategory === 'corporate-training' && 'Professional Tier'}
          {eventCategory === 'educational' && 'Educational Tier'}
          {eventCategory === 'networking' && 'Enterprise Tier'}
        </Badge>
      </div>
      
      {eventCategory === 'corporate-training' && renderCorporateAnalytics()}
      {eventCategory === 'educational' && renderEducationalAnalytics()}
      {eventCategory === 'networking' && renderNetworkingAnalytics()}
    </div>
  );
}
