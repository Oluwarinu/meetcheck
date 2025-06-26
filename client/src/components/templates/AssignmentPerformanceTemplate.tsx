import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  GraduationCap, 
  Upload, 
  BarChart3, 
  Clock, 
  Users,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Star,
  Calendar,
  Award
} from 'lucide-react';
// Define template locally
const assignmentTemplate = {
  id: 'assignment-submission-performance',
  name: 'Assignment Submission & Academic Performance Tracking',
  description: 'Monitor academic submission behaviors and align them with performance and attendance records',
  category: 'academic',
  template_type: 'assignment',
  max_attendees: 200,
  duration_hours: 168,
  is_system_template: true,
  created_at: new Date().toISOString(),
  dynamic_fields: [
    { id: 'student_id', type: 'text', label: 'Student ID', required: true },
    { id: 'course_code', type: 'text', label: 'Course Code', required: true },
    { id: 'academic_year', type: 'select', label: 'Academic Year', required: true },
    { id: 'faculty_department', type: 'select', label: 'Faculty / Department', required: true },
    { id: 'assignment_title', type: 'text', label: 'Assignment Title', required: true },
    { id: 'submission_status', type: 'select', label: 'Submission Status', required: true },
    { id: 'assignment_file', type: 'file', label: 'Assignment File Upload', required: true },
    { id: 'submission_date', type: 'date', label: 'Submission Date', required: true },
    { id: 'expected_grade', type: 'grade', label: 'Expected Grade (0-100)', required: false }
  ],
  features: [
    { type: 'file_upload', enabled: true, config: {} },
    { type: 'submissions', enabled: true, config: {} },
    { type: 'grade_tracking', enabled: true, config: {} },
    { type: 'attendance', enabled: true, config: {} }
  ]
};

interface AssignmentPerformanceTemplateProps {
  onUseTemplate?: () => void;
  onPreview?: () => void;
  showDetails?: boolean;
}

export default function AssignmentPerformanceTemplate({ 
  onUseTemplate, 
  onPreview, 
  showDetails = true 
}: AssignmentPerformanceTemplateProps) {
  const template = assignmentTemplate;
  const [showFullDetails, setShowFullDetails] = useState(false);

  const keyDataFields = [
    { label: 'Student ID', required: true, type: 'Alphanumeric ID' },
    { label: 'Course Code', required: true, type: 'Course Identifier' },
    { label: 'Academic Year', required: true, type: 'Year Level' },
    { label: 'Faculty / Department', required: true, type: 'Academic Division' },
    { label: 'Assignment Title', required: true, type: 'Text Field' },
    { label: 'Submission Status', required: true, type: 'Status Dropdown' }
  ];

  const additionalFields = [
    'Assignment File Upload',
    'Submission Date', 
    'Expected Grade (0-100)'
  ];

  const analyticsUses = [
    'Evaluate timely submission versus academic scores',
    'Compare coursework performance with attendance trends', 
    'Identify at-risk students for early intervention'
  ];

  const enabledFeatures = template.features.filter((f: any) => f.enabled);

  return (
    <Card className="w-full max-w-md hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-3">
          <div className="p-3 bg-purple-100 rounded-lg">
            <FileText className="h-8 w-8 text-purple-600" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg leading-tight">
              Assignment Submission & Academic Performance Tracking
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">Performance Tracking</Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Purpose */}
        <div>
          <h4 className="font-semibold text-sm mb-2">Purpose:</h4>
          <p className="text-sm text-gray-600">
            Monitor academic submission behaviors and align them with performance and attendance records
          </p>
        </div>

        {/* Key Data Fields */}
        <div>
          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Key Data Fields:
          </h4>
          <div className="space-y-2">
            {keyDataFields.map((field, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="font-medium">{field.label}</span>
                  {field.required && (
                    <span className="text-red-500 text-[10px]">*</span>
                  )}
                </div>
                <Badge variant="outline" className="text-[10px] px-1 py-0">
                  {field.type}
                </Badge>
              </div>
            ))}
            
            {showFullDetails && (
              <>
                {additionalFields.map((field, index) => (
                  <div key={`additional-${index}`} className="flex items-center gap-2 text-xs text-gray-600">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span>{field}</span>
                  </div>
                ))}
              </>
            )}
            
            {!showFullDetails && (
              <button 
                onClick={() => setShowFullDetails(true)}
                className="text-xs text-purple-600 hover:text-purple-800 font-medium"
              >
                +{additionalFields.length} more fields
              </button>
            )}
          </div>
        </div>

        {/* Features */}
        <div>
          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Star className="h-4 w-4" />
            Features:
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {enabledFeatures.map((feature: any, index: number) => {
              const getFeatureInfo = (type: string) => {
                switch (type) {
                  case 'file_upload':
                    return { icon: Upload, label: 'File Upload', color: 'text-blue-600 bg-blue-50' };
                  case 'grade_tracking':
                    return { icon: BarChart3, label: 'Grade Tracking', color: 'text-green-600 bg-green-50' };
                  case 'submissions':
                    return { icon: CheckCircle, label: 'Submissions', color: 'text-purple-600 bg-purple-50' };
                  case 'attendance':
                    return { icon: Clock, label: 'Attendance', color: 'text-orange-600 bg-orange-50' };
                  default:
                    return { icon: Star, label: type, color: 'text-gray-600 bg-gray-50' };
                }
              };

              const { icon: Icon, label, color } = getFeatureInfo(feature.type);

              return (
                <div key={index} className={`flex items-center gap-2 p-2 rounded-lg ${color}`}>
                  <Icon className="h-3 w-3" />
                  <span className="text-xs font-medium">{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Analytics Uses */}
        <div>
          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics Uses:
          </h4>
          <div className="space-y-2">
            {analyticsUses.map((use, index) => (
              <div key={index} className="flex items-start gap-2 text-xs">
                <TrendingUp className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">{use}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Template Stats */}
        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Users className="h-3 w-3 text-gray-500" />
              <span>Max Students</span>
            </div>
            <span className="font-medium">{template.max_attendees}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3 text-gray-500" />
              <span>Duration</span>
            </div>
            <span className="font-medium">{Math.floor(template.duration_hours / 24)} days</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <FileText className="h-3 w-3 text-gray-500" />
              <span>Total Fields</span>
            </div>
            <span className="font-medium">{template.dynamic_fields.length}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-gray-500" />
              <span>Features</span>
            </div>
            <span className="font-medium">{enabledFeatures.length}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            onClick={onUseTemplate} 
            className="flex-1 bg-purple-600 hover:bg-purple-700"
            size="sm"
          >
            <Award className="h-4 w-4 mr-2" />
            Use Template
          </Button>
          <Button 
            onClick={onPreview}
            variant="outline" 
            size="sm"
          >
            Preview
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}