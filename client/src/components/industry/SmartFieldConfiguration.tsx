import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, Building2, GraduationCap, Users, Star, TrendingUp } from 'lucide-react';

interface SmartField {
  id: string;
  label: string;
  type: string;
  required: boolean;
  enabled: boolean;
  category: 'essential' | 'recommended' | 'optional';
  industry: 'corporate' | 'education' | 'networking' | 'all';
  options?: string[];
  helpText?: string;
  improvementStat?: string;
}

interface SmartFieldConfigurationProps {
  industryType: 'corporate' | 'education' | 'networking';
  fields: SmartField[];
  onFieldToggle: (fieldId: string, enabled: boolean) => void;
  onRequiredToggle: (fieldId: string, required: boolean) => void;
}

const INDUSTRY_ICONS = {
  corporate: Building2,
  education: GraduationCap,
  networking: Users
};

const INDUSTRY_COLORS = {
  corporate: 'bg-blue-50 border-blue-200 text-blue-800',
  education: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  networking: 'bg-purple-50 border-purple-200 text-purple-800'
};

const SMART_FIELDS: Record<string, SmartField[]> = {
  corporate: [
    // Essential Fields
    { id: 'fullName', label: 'Full Name', type: 'text', required: true, enabled: true, category: 'essential', industry: 'all' },
    { id: 'email', label: 'Email Address', type: 'email', required: true, enabled: true, category: 'essential', industry: 'all' },
    { id: 'employeeId', label: 'Employee ID', type: 'text', required: true, enabled: true, category: 'essential', industry: 'corporate' },
    
    // Recommended for Compliance
    { id: 'department', label: 'Department', type: 'select', required: false, enabled: false, category: 'recommended', industry: 'corporate', 
      options: ['Sales', 'Marketing', 'Product', 'Engineering', 'HR', 'Finance', 'Operations'],
      improvementStat: 'improves attendance tracking by 23%' },
    { id: 'managerName', label: 'Manager Name', type: 'text', required: false, enabled: false, category: 'recommended', industry: 'corporate',
      improvementStat: 'enhances compliance reporting by 18%' },
    { id: 'trainingLevel', label: 'Training Level', type: 'select', required: false, enabled: false, category: 'recommended', industry: 'corporate',
      options: ['Beginner', 'Intermediate', 'Advanced'],
      improvementStat: 'enables personalized content delivery' },
    { id: 'certificationReq', label: 'Certification Requirements', type: 'checkbox', required: false, enabled: false, category: 'recommended', industry: 'corporate' },
    
    // Optional Tracking
    { id: 'yearsExperience', label: 'Years of Experience', type: 'number', required: false, enabled: false, category: 'optional', industry: 'corporate' },
    { id: 'roleLevel', label: 'Role Level', type: 'select', required: false, enabled: false, category: 'optional', industry: 'corporate',
      options: ['Individual Contributor', 'Team Lead', 'Manager', 'Director', 'VP', 'C-Level'] },
    { id: 'location', label: 'Office Location', type: 'select', required: false, enabled: false, category: 'optional', industry: 'corporate' }
  ],
  
  education: [
    // Essential Fields
    { id: 'fullName', label: 'Full Name', type: 'text', required: true, enabled: true, category: 'essential', industry: 'all' },
    { id: 'email', label: 'Email Address', type: 'email', required: true, enabled: true, category: 'essential', industry: 'all' },
    { id: 'studentId', label: 'Student ID', type: 'text', required: true, enabled: true, category: 'essential', industry: 'education' },
    
    // Recommended for Academic Tracking
    { id: 'courseCode', label: 'Course Code', type: 'text', required: false, enabled: false, category: 'recommended', industry: 'education',
      improvementStat: 'enables cross-course performance analysis' },
    { id: 'academicYear', label: 'Academic Year', type: 'select', required: false, enabled: false, category: 'recommended', industry: 'education',
      options: ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'],
      improvementStat: 'correlates attendance with academic progression' },
    { id: 'faculty', label: 'Faculty/Department', type: 'select', required: false, enabled: false, category: 'recommended', industry: 'education',
      options: ['Computer Science', 'Business', 'Engineering', 'Arts & Sciences', 'Medicine', 'Law'] },
    { id: 'campusLocation', label: 'Campus Location', type: 'select', required: false, enabled: false, category: 'recommended', industry: 'education' },
    
    // Optional Tracking
    { id: 'gradeLevel', label: 'Current GPA Range', type: 'select', required: false, enabled: false, category: 'optional', industry: 'education',
      options: ['3.5-4.0', '3.0-3.5', '2.5-3.0', '2.0-2.5', 'Below 2.0', 'Prefer not to say'] },
    { id: 'majorField', label: 'Major Field of Study', type: 'text', required: false, enabled: false, category: 'optional', industry: 'education' }
  ],
  
  networking: [
    // Essential Fields
    { id: 'fullName', label: 'Full Name', type: 'text', required: true, enabled: true, category: 'essential', industry: 'all' },
    { id: 'email', label: 'Email Address', type: 'email', required: true, enabled: true, category: 'essential', industry: 'all' },
    { id: 'company', label: 'Company/Organization', type: 'text', required: true, enabled: true, category: 'essential', industry: 'networking' },
    
    // Recommended for Networking
    { id: 'jobTitle', label: 'Job Title', type: 'text', required: false, enabled: false, category: 'recommended', industry: 'networking',
      improvementStat: 'increases connection quality by 31%' },
    { id: 'industry', label: 'Industry', type: 'select', required: false, enabled: false, category: 'recommended', industry: 'networking',
      options: ['Technology', 'Finance', 'Healthcare', 'Education', 'Retail', 'Manufacturing', 'Consulting', 'Media'],
      improvementStat: 'enables targeted networking analytics' },
    { id: 'linkedinProfile', label: 'LinkedIn Profile', type: 'url', required: false, enabled: false, category: 'recommended', industry: 'networking',
      improvementStat: 'facilitates follow-up connections by 45%' },
    { id: 'attendeeType', label: 'Attendee Type', type: 'select', required: false, enabled: false, category: 'recommended', industry: 'networking',
      options: ['Speaker', 'Sponsor', 'Attendee', 'Media', 'Vendor'] },
    
    // Optional Tracking
    { id: 'companySize', label: 'Company Size', type: 'select', required: false, enabled: false, category: 'optional', industry: 'networking',
      options: ['1-10', '11-50', '51-200', '201-1000', '1000+'] },
    { id: 'interests', label: 'Professional Interests', type: 'multiselect', required: false, enabled: false, category: 'optional', industry: 'networking' }
  ]
};

export default function SmartFieldConfiguration({ 
  industryType, 
  fields, 
  onFieldToggle, 
  onRequiredToggle 
}: SmartFieldConfigurationProps) {
  const IndustryIcon = INDUSTRY_ICONS[industryType];
  const industryColorClass = INDUSTRY_COLORS[industryType];
  const industryFields = SMART_FIELDS[industryType] || [];

  const getFieldsByCategory = (category: 'essential' | 'recommended' | 'optional') => {
    return industryFields.filter(field => field.category === category);
  };

  const getSmartRecommendation = () => {
    const enabledRecommended = getFieldsByCategory('recommended').filter(f => f.enabled);
    if (enabledRecommended.length < 2) {
      return "Adding 2-3 recommended fields typically improves event insights by 25-40%";
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Industry Context Header */}
      <Card className={`border-2 ${industryColorClass}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white">
              <IndustryIcon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {industryType.charAt(0).toUpperCase() + industryType.slice(1)} Template Active
              </CardTitle>
              <p className="text-sm opacity-90">
                Optimized fields and features for {industryType} events
              </p>
            </div>
            <Badge variant="secondary" className="ml-auto">
              <Star className="h-3 w-3 mr-1" />
              Recommended
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Smart Recommendation Alert */}
      {getSmartRecommendation() && (
        <Alert className="border-amber-200 bg-amber-50">
          <Lightbulb className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Smart Suggestion:</strong> {getSmartRecommendation()}
          </AlertDescription>
        </Alert>
      )}

      {/* Essential Fields */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900">Essential Fields</h3>
          <Badge variant="outline" className="text-xs">Required</Badge>
        </div>
        
        <div className="grid gap-3">
          {getFieldsByCategory('essential').map((field) => (
            <Card key={field.id} className="border border-gray-200">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={field.enabled}
                    disabled={field.required}
                    onCheckedChange={(checked) => onFieldToggle(field.id, checked as boolean)}
                  />
                  <div>
                    <span className="font-medium text-gray-900">{field.label}</span>
                    {field.helpText && (
                      <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>
                    )}
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  Required
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recommended Fields */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900">Recommended for {industryType === 'corporate' ? 'Compliance' : industryType === 'education' ? 'Academic Tracking' : 'Networking'}</h3>
          <Badge variant="outline" className="text-xs">
            <TrendingUp className="h-3 w-3 mr-1" />
            Smart Suggestions
          </Badge>
        </div>
        
        <div className="grid gap-3">
          {getFieldsByCategory('recommended').map((field) => (
            <Card key={field.id} className="border border-gray-200 hover:border-blue-300 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <Checkbox
                      checked={field.enabled}
                      onCheckedChange={(checked) => onFieldToggle(field.id, checked as boolean)}
                    />
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">{field.label}</span>
                      {field.improvementStat && (
                        <p className="text-xs text-blue-600 mt-1 flex items-center">
                          <Lightbulb className="h-3 w-3 mr-1" />
                          Based on similar events, this {field.improvementStat}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {field.enabled && (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={field.required}
                          onCheckedChange={(checked) => onRequiredToggle(field.id, checked as boolean)}
                        />
                        <span className="text-xs text-gray-600">Required</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Optional Fields */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Optional Tracking</h3>
        
        <div className="grid gap-3">
          {getFieldsByCategory('optional').map((field) => (
            <Card key={field.id} className="border border-gray-200">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={field.enabled}
                    onCheckedChange={(checked) => onFieldToggle(field.id, checked as boolean)}
                  />
                  <span className="font-medium text-gray-900">{field.label}</span>
                </div>
                {field.enabled && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={field.required}
                      onCheckedChange={(checked) => onRequiredToggle(field.id, checked as boolean)}
                    />
                    <span className="text-xs text-gray-600">Required</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}