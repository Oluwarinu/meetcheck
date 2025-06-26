import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
// Define types locally for now
interface DynamicTemplate {
  id: string;
  name: string;
  description?: string;
  category: 'academic' | 'corporate' | 'networking';
  template_type: string;
  dynamic_fields: any[];
  features: any[];
  max_attendees: number;
  duration_hours: number;
  is_system_template: boolean;
  created_at: string;
}

const SYSTEM_TEMPLATES: DynamicTemplate[] = [
  {
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
  }
];
import AssignmentPerformanceTemplate from './AssignmentPerformanceTemplate';
import { 
  Search, 
  GraduationCap, 
  Building, 
  Users, 
  FileText, 
  Upload, 
  BarChart3, 
  MapPin,
  Clock,
  Star,
  Plus,
  Eye
} from 'lucide-react';

interface DynamicTemplateSelectorProps {
  onTemplateSelect: (template: DynamicTemplate) => void;
  category?: 'academic' | 'corporate' | 'networking' | 'all';
}

const getTemplateIcon = (templateType: string) => {
  switch (templateType) {
    case 'lecture':
      return GraduationCap;
    case 'assignment':
      return FileText;
    case 'meeting':
      return Building;
    case 'conference':
      return Users;
    case 'workshop':
      return Star;
    default:
      return FileText;
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'academic':
      return GraduationCap;
    case 'corporate':
      return Building;
    case 'networking':
      return Users;
    default:
      return FileText;
  }
};

const getFeatureIcon = (featureType: string) => {
  switch (featureType) {
    case 'file_upload':
      return Upload;
    case 'grade_tracking':
      return BarChart3;
    case 'location_verification':
      return MapPin;
    case 'qr_checkin':
      return Star;
    default:
      return Eye;
  }
};

export default function DynamicTemplateSelector({ onTemplateSelect, category = 'all' }: DynamicTemplateSelectorProps) {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [templates, setTemplates] = useState<DynamicTemplate[]>([]);

  useEffect(() => {
    // Filter templates based on user role and category
    let filteredTemplates = SYSTEM_TEMPLATES;

    // Role-based filtering
    if (user?.user_role === 'educator') {
      filteredTemplates = filteredTemplates.filter((t: any) => t.category === 'academic');
    }

    // Category filtering
    if (selectedCategory !== 'all') {
      filteredTemplates = filteredTemplates.filter((t: any) => t.category === selectedCategory);
    }

    // Search filtering
    if (searchTerm) {
      filteredTemplates = filteredTemplates.filter((t: any) =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.template_type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setTemplates(filteredTemplates);
  }, [selectedCategory, searchTerm, user?.user_role]);

  const categories = [
    { id: 'all', name: 'All Templates', icon: FileText },
    { id: 'academic', name: 'Academic', icon: GraduationCap },
    { id: 'corporate', name: 'Corporate', icon: Building },
    { id: 'networking', name: 'Networking', icon: Users }
  ];

  const getTemplatePreview = (template: DynamicTemplate) => {
    const fieldCount = template.dynamic_fields.length;
    const featureCount = template.features.filter((f: any) => f.enabled).length;
    
    return {
      fields: fieldCount,
      features: featureCount,
      duration: template.duration_hours,
      capacity: template.max_attendees
    };
  };

  const assignmentTemplate = SYSTEM_TEMPLATES.find((t: any) => t.id === 'assignment-submission-performance');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Template Library</h2>
          <p className="text-gray-600 mt-1">Choose from pre-configured templates or create custom ones</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Custom Template
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.id as any)}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                {cat.name}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Featured Assignment Template */}
      {(selectedCategory === 'all' || selectedCategory === 'academic') && assignmentTemplate && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <h3 className="text-lg font-semibold">Featured Academic Template</h3>
            <Badge variant="secondary">New</Badge>
          </div>
          <div className="flex justify-center">
            <AssignmentPerformanceTemplate
              onUseTemplate={() => onTemplateSelect(assignmentTemplate)}
              onPreview={() => console.log('Preview assignment template')}
            />
          </div>
        </div>
      )}

      {/* Template Grid */}
      <div>
        <h3 className="text-lg font-semibold mb-4">All Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => {
            // Skip the assignment template since it's featured above
            if (template.id === 'assignment-submission-performance') return null;

            const Icon = getTemplateIcon(template.template_type);
            const CategoryIcon = getCategoryIcon(template.category);
            const preview = getTemplatePreview(template);

            return (
              <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Icon className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <CategoryIcon className="h-4 w-4 text-gray-500" />
                          <Badge variant="secondary" className="text-xs">
                            {template.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {template.template_type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <CardDescription className="text-sm">
                    {template.description}
                  </CardDescription>

                  {/* Template Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span>{preview.fields} fields</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-gray-500" />
                      <span>{preview.features} features</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>{preview.capacity} max</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{preview.duration > 24 ? `${Math.floor(preview.duration / 24)}d` : `${preview.duration}h`}</span>
                    </div>
                  </div>

                  {/* Features Preview */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Enabled Features:</h4>
                    <div className="flex flex-wrap gap-1">
                      {template.features.filter((f: any) => f.enabled).map((feature: any, index: number) => {
                        const FeatureIcon = getFeatureIcon(feature.type);
                        return (
                          <Badge key={index} variant="outline" className="text-xs flex items-center gap-1">
                            <FeatureIcon className="h-3 w-3" />
                            {feature.type.replace('_', ' ')}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      onClick={() => onTemplateSelect(template)}
                      className="flex-1"
                    >
                      Use Template
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {templates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Try adjusting your search criteria' : 'No templates available for the selected category'}
          </p>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Create Custom Template
          </Button>
        </div>
      )}
    </div>
  );
}