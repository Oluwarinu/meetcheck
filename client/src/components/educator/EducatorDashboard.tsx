import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  GraduationCap, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  BookOpen,
  FileText,
  UserCheck
} from 'lucide-react';

interface EducatorDashboardProps {
  userRole: string;
}

interface StudentMetrics {
  totalStudents: number;
  presentToday: number;
  attendanceRate: number;
  atRiskStudents: number;
  avgGrade: number;
  assignmentSubmissionRate: number;
}

const EducatorDashboard: React.FC<EducatorDashboardProps> = ({ userRole }) => {
  const [metrics] = useState<StudentMetrics>({
    totalStudents: 240,
    presentToday: 218,
    attendanceRate: 87.3,
    atRiskStudents: 12,
    avgGrade: 78.4,
    assignmentSubmissionRate: 92.1
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-purple-600" />
            Educator Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Academic performance and attendance analytics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <BookOpen className="h-4 w-4 mr-2" />
            Create Academic Event
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold">{metrics.totalStudents}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Present Today</p>
                <p className="text-2xl font-bold text-green-600">{metrics.presentToday}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                <p className="text-2xl font-bold">{metrics.attendanceRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">At-Risk Students</p>
                <p className="text-2xl font-bold text-red-600">{metrics.atRiskStudents}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Grade</p>
                <p className="text-2xl font-bold">{metrics.avgGrade}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Submission Rate</p>
                <p className="text-2xl font-bold">{metrics.assignmentSubmissionRate}%</p>
              </div>
              <FileText className="h-8 w-8 text-cyan-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Section */}
      <Card className="border-purple-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-lg text-purple-900">Quick Actions</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3">
          <Button
            variant="outline"
            className="justify-start border-purple-200 text-purple-700 hover:bg-purple-50"
            onClick={() => window.location.href = '/educator/events'}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Manage Academic Events
          </Button>
          <Button
            variant="outline"
            className="justify-start border-purple-200 text-purple-700 hover:bg-purple-50"
            onClick={() => window.location.href = '/templates'}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Browse Course Templates
          </Button>
          <Button
            variant="outline"
            className="justify-start border-purple-200 text-purple-700 hover:bg-purple-50"
            onClick={() => window.location.href = '/analytics'}
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            View Academic Analytics
          </Button>
          <Button
            variant="outline"
            className="justify-start border-purple-200 text-purple-700 hover:bg-purple-50"
            onClick={() => window.location.href = '/analytics'}
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            Early Intervention Alerts
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EducatorDashboard;