import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/StatsCard";
import { useAuth } from "@/contexts/AuthContext";
import { 
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

  // Show educator-specific analytics for educator role
  if (user?.user_role === 'educator') {
    return (
      <div className="space-y-6">
        {/* Educator Analytics Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <GraduationCap className="h-8 w-8 text-purple-600" />
              Academic Analytics
            </h1>
            <p className="text-gray-600 mt-1">Detailed attendance, performance, and intervention analytics</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Analytics Content */}
        <div className="grid gap-6">
          {/* Attendance Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Attendance & Demographics
              </CardTitle>
              <CardDescription>Student attendance patterns across different demographics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Attendance by Gender</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Female Students</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{width: '89.2%'}}></div>
                        </div>
                        <span className="text-sm font-medium">89.2%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Male Students</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{width: '85.7%'}}></div>
                        </div>
                        <span className="text-sm font-medium">85.7%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Department Participation</h4>
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
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{width: `${dept.rate}%`}}></div>
                          </div>
                          <span className="text-sm font-medium">{dept.rate}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assignment Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Assignment Performance
              </CardTitle>
              <CardDescription>Assignment submission rates and grade correlations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="p-4 bg-blue-50 rounded-lg mb-4">
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
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{width: `${course.rate}%`}}></div>
                            </div>
                            <span className="text-sm font-medium">{course.rate}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="p-4 bg-green-50 rounded-lg mb-4">
                    <h4 className="font-medium text-green-900 mb-2">Grade Distribution</h4>
                    <div className="space-y-3">
                      {[
                        { range: 'A (90-100)', count: 45, color: 'bg-green-600' },
                        { range: 'B (80-89)', count: 78, color: 'bg-blue-600' },
                        { range: 'C (70-79)', count: 89, color: 'bg-yellow-600' },
                        { range: 'D (60-69)', count: 23, color: 'bg-orange-600' },
                        { range: 'F (<60)', count: 5, color: 'bg-red-600' }
                      ].map((grade) => (
                        <div key={grade.range} className="flex justify-between items-center">
                          <span className="text-sm font-medium">{grade.range}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div className={`${grade.color} h-2 rounded-full`} style={{width: `${(grade.count/240)*100}%`}}></div>
                            </div>
                            <span className="text-sm text-gray-600">{grade.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Early Intervention */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-red-600" />
                Early Intervention System
              </CardTitle>
              <CardDescription>At-risk student identification and intervention tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">At-Risk Students</h4>
                  <div className="space-y-4">
                    {[
                      { name: 'Sarah Johnson', id: 'STU001', course: 'CS101', attendance: 45.2, assignments: 4, grade: 52.1, risk: 'High' },
                      { name: 'Michael Chen', id: 'STU002', course: 'MATH201', attendance: 62.8, assignments: 2, grade: 68.5, risk: 'Medium' },
                      { name: 'Emma Davis', id: 'STU003', course: 'ENG102', attendance: 71.4, assignments: 3, grade: 65.2, risk: 'Medium' }
                    ].map((student) => (
                      <div key={student.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h5 className="font-medium">{student.name}</h5>
                            <p className="text-sm text-gray-600">{student.id} • {student.course}</p>
                          </div>
                          <Badge className={student.risk === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                            {student.risk} Risk
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Attendance</span>
                            <p className="font-medium">{student.attendance}%</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Missed Assignments</span>
                            <p className="font-medium">{student.assignments}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Avg Grade</span>
                            <p className="font-medium">{student.grade}%</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline" className="text-xs">
                            Contact Student
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs">
                            Schedule Meeting
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="p-4 bg-yellow-50 rounded-lg mb-4">
                    <h4 className="font-medium text-yellow-900 mb-2">Intervention Strategies</h4>
                    <ul className="text-sm text-yellow-800 space-y-1">
                      <li>• Schedule one-on-one meetings with high-risk students</li>
                      <li>• Implement peer tutoring programs</li>
                      <li>• Provide additional office hours</li>
                      <li>• Send automated attendance reminders</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Success Metrics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Students Improved</span>
                        <span className="text-sm font-medium">23/30 (77%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Avg Grade Increase</span>
                        <span className="text-sm font-medium">+12.3%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Attendance Boost</span>
                        <span className="text-sm font-medium">+15.7%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Default analytics for other roles
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights into event performance and attendee engagement</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Events"
          value="24"
          subtitle="This month"
          trend="+12%"
          icon={<Users className="h-5 w-5 text-blue-600" />}
        />
        <StatsCard
          title="Total Attendees"
          value="1,429"
          subtitle="All time"
          trend="+8%"
          icon={<TrendingUp className="h-5 w-5 text-green-600" />}
        />
        <StatsCard
          title="Avg Check-in Rate"
          value="89.2%"
          subtitle="Last 30 days"
          trend="+5%"
          icon={<Clock className="h-5 w-5 text-orange-600" />}
        />
        <StatsCard
          title="Engagement Score"
          value="94.5"
          subtitle="Out of 100"
          trend="+3%"
          icon={<TrendingUp className="h-5 w-5 text-purple-600" />}
        />
      </div>

      {/* Event Insights */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Attendance Trends
            </CardTitle>
            <CardDescription>
              Track attendance patterns across your events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              Attendance trend chart will be displayed here
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Events
            </CardTitle>
            <CardDescription>
              Latest event performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Team Workshop', duration: '2.5 hours', participants: 45 },
                { name: 'Product Launch', duration: '1.5 hours', participants: 128 },
                { name: 'Training Session', duration: '3 hours', participants: 32 }
              ].map((session, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{session.name}</p>
                    <p className="text-sm text-gray-600">{session.duration}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{session.participants}</p>
                    <p className="text-sm text-gray-600">participants</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upgrade Features */}
      <Card className="border-2 border-dashed border-gray-300">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            <CardTitle>Unlock Advanced Analytics</CardTitle>
          </div>
          <CardDescription>
            Get deeper insights with our premium analytics features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: 'Real-time Analytics',
                description: 'Live attendance tracking and engagement metrics',
                icon: <TrendingUp className="h-4 w-4 text-blue-600" />
              },
              {
                title: 'Advanced Reports',
                description: 'Detailed PDF reports with custom branding',
                icon: <FileText className="h-4 w-4 text-blue-600" />
              },
              {
                title: 'Predictive Insights',
                description: 'AI-powered attendance and engagement predictions',
                icon: <Users className="h-4 w-4 text-blue-600" />
              },
              {
                title: 'Custom Dashboards',
                description: 'Build personalized analytics dashboards',
                icon: <Crown className="h-4 w-4 text-blue-600" />
              }
            ].map((feature, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="bg-blue-100 p-2 rounded-lg">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{feature.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Premium
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}