import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FileText, 
  GraduationCap,
  BarChart3,
  Clock,
  TrendingUp,
  AlertTriangle,
  BookOpen
} from 'lucide-react';

interface EducatorTemplate {
  id: string;
  name: string;
  purpose: string;
  category: 'attendance' | 'assignment';
  fields: TemplateField[];
  analytics: string[];
  icon: React.ReactNode;
  color: string;
}

interface TemplateField {
  name: string;
  type: 'text' | 'select' | 'date' | 'number';
  required: boolean;
  options?: string[];
}

const educatorTemplates: EducatorTemplate[] = [
  {
    id: 'attendance-demographics',
    name: 'Attendance & Demographics Tracking',
    purpose: 'Collect and analyze attendance data alongside demographic attributes for insights into student engagement and inclusion',
    category: 'attendance',
    icon: <Users className="h-6 w-6" />,
    color: 'bg-blue-600',
    fields: [
      { name: 'Student ID', type: 'text', required: true },
      { name: 'Course Code', type: 'text', required: true },
      { name: 'Academic Year', type: 'select', required: true, options: ['2024-2025', '2023-2024', '2022-2023'] },
      { name: 'Faculty / Department', type: 'select', required: true, options: ['Computer Science', 'Mathematics', 'English', 'Physics', 'Chemistry', 'Biology'] },
      { name: 'Attendance Status', type: 'select', required: true, options: ['Present', 'Absent', 'Late', 'Excused'] },
      { name: 'Gender', type: 'select', required: false, options: ['Male', 'Female', 'Other', 'Prefer not to say'] },
      { name: 'Age', type: 'number', required: false },
      { name: 'Date', type: 'date', required: true }
    ],
    analytics: [
      'Correlation of attendance patterns with academic performance',
      'Gender and age-based attendance trends',
      'Department-level participation reporting',
      'Early identification of at-risk students'
    ]
  },
  {
    id: 'assignment-performance',
    name: 'Assignment Submission & Academic Performance Tracking',
    purpose: 'Monitor academic submission behaviors and align them with performance and attendance records',
    category: 'assignment',
    icon: <FileText className="h-6 w-6" />,
    color: 'bg-purple-600',
    fields: [
      { name: 'Student ID', type: 'text', required: true },
      { name: 'Course Code', type: 'text', required: true },
      { name: 'Academic Year', type: 'select', required: true, options: ['2024-2025', '2023-2024', '2022-2023'] },
      { name: 'Faculty / Department', type: 'select', required: true, options: ['Computer Science', 'Mathematics', 'English', 'Physics', 'Chemistry', 'Biology'] },
      { name: 'Assignment Title', type: 'text', required: true },
      { name: 'Submission Status', type: 'select', required: true, options: ['Submitted', 'Late', 'Missing', 'Pending Review'] },
      { name: 'File Format', type: 'select', required: false, options: ['DOCX', 'PDF', 'PPT', 'TXT', 'Other'] },
      { name: 'Grade / Score', type: 'number', required: false },
      { name: 'Submission Date', type: 'date', required: true }
    ],
    analytics: [
      'Evaluate timely submission versus academic scores',
      'Compare coursework performance with attendance trends',
      'Identify at-risk students for early intervention',
      'File format preference analysis'
    ]
  }
];

interface EducatorTemplatesProps {
  onSelectTemplate: (template: EducatorTemplate) => void;
}

export const EducatorTemplates: React.FC<EducatorTemplatesProps> = ({ onSelectTemplate }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
          <GraduationCap className="h-7 w-7 text-purple-600" />
          Educational Event Templates
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Specialized templates designed for academic institutions to track student engagement, 
          performance, and identify opportunities for early intervention.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {educatorTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 ${template.color} text-white rounded-lg`}>
                    {template.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge variant="outline" className="mt-1">
                      {template.category === 'attendance' ? 'Attendance Tracking' : 'Performance Tracking'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-2">Purpose:</h4>
                <p className="text-sm text-gray-600">{template.purpose}</p>
              </div>

              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-2">Key Data Fields:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {template.fields.slice(0, 6).map((field, index) => (
                    <div key={index} className="flex items-center text-xs text-gray-600">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                      {field.name}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </div>
                  ))}
                  {template.fields.length > 6 && (
                    <div className="text-xs text-gray-500">
                      +{template.fields.length - 6} more fields
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-1">
                  <BarChart3 className="h-4 w-4" />
                  Analytics Uses:
                </h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  {template.analytics.slice(0, 3).map((analytic, index) => (
                    <li key={index} className="flex items-start">
                      <TrendingUp className="h-3 w-3 mr-2 mt-0.5 text-gray-400" />
                      {analytic}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  onClick={() => onSelectTemplate(template)}
                  className={`flex-1 ${template.color} hover:opacity-90`}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Use Template
                </Button>
                <Button variant="outline" size="sm">
                  Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-purple-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-purple-900 mb-2">Early Intervention System</h3>
            <p className="text-sm text-purple-800 mb-3">
              These templates are designed to work together to create a comprehensive early intervention system. 
              The attendance data correlates with assignment performance to automatically identify at-risk students.
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-purple-900 mb-1">Risk Indicators:</h4>
                <ul className="text-purple-800 space-y-1">
                  <li>• Attendance rate below 70%</li>
                  <li>• Multiple missed assignments</li>
                  <li>• Declining grade trends</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-purple-900 mb-1">Automated Actions:</h4>
                <ul className="text-purple-800 space-y-1">
                  <li>• Alert generation for advisors</li>
                  <li>• Recommended intervention strategies</li>
                  <li>• Progress tracking and follow-up</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducatorTemplates;