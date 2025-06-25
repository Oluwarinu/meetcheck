import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GraduationCap, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  BookOpen,
  FileText,
  Calendar,
  BarChart3,
  PieChart,
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

interface AtRiskStudent {
  id: string;
  name: string;
  studentId: string;
  course: string;
  attendanceRate: number;
  missedAssignments: number;
  avgGrade: number;
  riskLevel: 'High' | 'Medium' | 'Low';
}

const EducatorDashboard: React.FC<EducatorDashboardProps> = ({ userRole }) => {
  const [metrics, setMetrics] = useState<StudentMetrics>({
    totalStudents: 240,
    presentToday: 218,
    attendanceRate: 87.3,
    atRiskStudents: 12,
    avgGrade: 78.4,
    assignmentSubmissionRate: 92.1
  });

  const [atRiskStudents] = useState<AtRiskStudent[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      studentId: 'STU001',
      course: 'CS101',
      attendanceRate: 45.2,
      missedAssignments: 4,
      avgGrade: 52.1,
      riskLevel: 'High'
    },
    {
      id: '2',
      name: 'Michael Chen',
      studentId: 'STU002',
      course: 'MATH201',
      attendanceRate: 62.8,
      missedAssignments: 2,
      avgGrade: 68.5,
      riskLevel: 'Medium'
    },
    {
      id: '3',
      name: 'Emma Davis',
      studentId: 'STU003',
      course: 'ENG102',
      attendanceRate: 71.4,
      missedAssignments: 3,
      avgGrade: 65.2,
      riskLevel: 'Medium'
    }
  ]);

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
              <BarChart3 className="h-8 w-8 text-indigo-600" />
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

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attendance">Attendance & Demographics</TabsTrigger>
          <TabsTrigger value="assignments">Assignment Performance</TabsTrigger>
          <TabsTrigger value="intervention">Early Intervention</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Attendance Distribution by Course
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { course: 'CS101', rate: 92.1 },
                    { course: 'MATH201', rate: 87.3 },
                    { course: 'ENG102', rate: 89.5 },
                    { course: 'PHYS301', rate: 84.2 }
                  ].map(({ course, rate }) => (
                    <div key={course} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{course}</span>
                        <span className="text-sm text-gray-600">{rate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${rate}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Grade Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { grade: 'A (90-100%)', count: 45, color: 'bg-blue-600' },
                    { grade: 'B (80-89%)', count: 78, color: 'bg-blue-600' },
                    { grade: 'C (70-79%)', count: 89, color: 'bg-blue-600' },
                    { grade: 'D (60-69%)', count: 23, color: 'bg-blue-600' },
                    { grade: 'F (<60%)', count: 5, color: 'bg-blue-600' }
                  ].map(({ grade, count, color }) => {
                    const percentage = (count / 240) * 100;
                    return (
                      <div key={grade} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{grade}</span>
                          <span className="text-sm text-gray-600">{count} students</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`${color} h-2 rounded-full`} 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Trends by Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">By Gender</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Female</span>
                        <div className="flex items-center gap-2">
                          <Progress value={89.2} className="w-20 h-2" />
                          <span className="text-sm text-gray-600">89.2%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Male</span>
                        <div className="flex items-center gap-2">
                          <Progress value={85.7} className="w-20 h-2" />
                          <span className="text-sm text-gray-600">85.7%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">By Academic Year</h4>
                    <div className="space-y-2">
                      {['Freshman', 'Sophomore', 'Junior', 'Senior'].map((year, index) => {
                        const rates = [82.1, 87.5, 91.2, 88.9];
                        return (
                          <div key={year} className="flex justify-between items-center">
                            <span className="text-sm">{year}</span>
                            <div className="flex items-center gap-2">
                              <Progress value={rates[index]} className="w-20 h-2" />
                              <span className="text-sm text-gray-600">{rates[index]}%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Participation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { dept: 'Computer Science', rate: 92.1, students: 68 },
                    { dept: 'Mathematics', rate: 87.3, students: 52 },
                    { dept: 'English', rate: 89.5, students: 71 },
                    { dept: 'Physics', rate: 84.2, students: 49 }
                  ].map((dept) => (
                    <div key={dept.dept} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-sm">{dept.dept}</span>
                        <span className="text-sm text-gray-600">{dept.students} students</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={dept.rate} className="flex-1 h-2" />
                        <span className="text-sm font-medium">{dept.rate}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Assignment Submission vs Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Key Insights</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Students with 90%+ attendance have 96% submission rate</li>
                      <li>• Students with &lt;70% attendance have 67% submission rate</li>
                      <li>• Strong correlation (r=0.84) between attendance and submissions</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Submission Rates by Course</h4>
                    <div className="space-y-3">
                      {[
                        { course: 'CS101', submitted: 64, total: 68, rate: 94.1 },
                        { course: 'MATH201', submitted: 46, total: 52, rate: 88.5 },
                        { course: 'ENG102', submitted: 67, total: 71, rate: 94.4 },
                        { course: 'PHYS301', submitted: 43, total: 49, rate: 87.8 }
                      ].map((course) => (
                        <div key={course.course} className="flex justify-between items-center">
                          <div>
                            <span className="font-medium text-sm">{course.course}</span>
                            <span className="text-xs text-gray-600 ml-2">
                              {course.submitted}/{course.total}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={course.rate} className="w-20 h-2" />
                            <span className="text-sm font-medium">{course.rate}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Grade vs Performance Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Performance Indicators</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• Early assignments predict final grade (r=0.78)</li>
                      <li>• Late submissions correlate with lower final scores</li>
                      <li>• File format preferences: 67% PDF, 28% DOCX, 5% PPT</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Average Grades by Submission Behavior</h4>
                    <div className="space-y-3">
                      {[
                        { behavior: 'Always On Time', grade: 89.2, color: 'bg-green-500' },
                        { behavior: 'Mostly On Time', grade: 82.1, color: 'bg-blue-500' },
                        { behavior: 'Sometimes Late', grade: 74.5, color: 'bg-yellow-500' },
                        { behavior: 'Often Late', grade: 65.8, color: 'bg-red-500' }
                      ].map((item) => (
                        <div key={item.behavior} className="flex justify-between items-center">
                          <span className="text-sm font-medium">{item.behavior}</span>
                          <div className="flex items-center gap-2">
                            <div className={`w-12 h-2 ${item.color} rounded`}></div>
                            <span className="text-sm font-medium">{item.grade}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="intervention" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Early Intervention Alert System
              </CardTitle>
              <p className="text-sm text-gray-600">
                Students identified as at-risk based on attendance, assignment submission, and grade patterns
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {atRiskStudents.map((student) => (
                  <div key={student.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{student.name}</h4>
                        <p className="text-sm text-gray-600">
                          {student.studentId} • {student.course}
                        </p>
                      </div>
                      <Badge className={getRiskLevelColor(student.riskLevel)}>
                        {student.riskLevel} Risk
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-600">Attendance Rate</p>
                        <div className="flex items-center gap-2">
                          <Progress value={student.attendanceRate} className="flex-1 h-2" />
                          <span className="text-sm font-medium">{student.attendanceRate}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Missed Assignments</p>
                        <p className="text-lg font-bold text-red-600">{student.missedAssignments}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Average Grade</p>
                        <p className="text-lg font-bold">{student.avgGrade}%</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <UserCheck className="h-4 w-4 mr-1" />
                        Contact Student
                      </Button>
                      <Button size="sm" variant="outline">
                        <Calendar className="h-4 w-4 mr-1" />
                        Schedule Meeting
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileText className="h-4 w-4 mr-1" />
                        Create Action Plan
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EducatorDashboard;