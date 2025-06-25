import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, GraduationCap, Users, CheckCircle, Clock, TrendingUp } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  category: 'corporate' | 'education' | 'networking';
  usageCount: number;
  fields: string[];
  features: string[];
}

interface IndustryTemplateSelectorProps {
  onSelectIndustry: (industry: 'corporate' | 'education' | 'networking') => void;
  onSelectTemplate?: (template: Template) => void;
}

const INDUSTRY_TYPES = [
  {
    id: 'corporate',
    title: 'Corporate Training',
    icon: Building2,
    description: 'Training sessions, workshops, compliance events',
    features: ['Compliance Tracking', 'Skills Development', 'Employee Onboarding'],
    color: 'bg-gradient-to-br from-blue-600 to-blue-700',
    borderColor: 'border-blue-200 hover:border-blue-300'
  },
  {
    id: 'education',
    title: 'Educational Institution',
    icon: GraduationCap,
    description: 'Lectures, seminars, academic workshops',
    features: ['Student Tracking', 'Academic Integration', 'Campus Management'],
    color: 'bg-gradient-to-br from-emerald-600 to-emerald-700',
    borderColor: 'border-emerald-200 hover:border-emerald-300'
  },
  {
    id: 'networking',
    title: 'Networking Events',
    icon: Users,
    description: 'Conferences, meetups, professional gatherings',
    features: ['Connection Tracking', 'Lead Generation', 'ROI Analytics'],
    color: 'bg-gradient-to-br from-purple-600 to-purple-700',
    borderColor: 'border-purple-200 hover:border-purple-300'
  }
];

const POPULAR_TEMPLATES: Template[] = [
  {
    id: 'new-employee-onboarding',
    name: 'New Employee Onboarding',
    description: 'Comprehensive onboarding program for new hires',
    category: 'corporate',
    usageCount: 15,
    fields: ['Employee ID', 'Department', 'Manager Name', 'Start Date'],
    features: ['Compliance Tracking', 'Progress Monitoring']
  },
  {
    id: 'quarterly-all-hands',
    name: 'Quarterly All-Hands Meeting',
    description: 'Company-wide quarterly meetings and updates',
    category: 'corporate',
    usageCount: 8,
    fields: ['Employee ID', 'Department', 'Role Level'],
    features: ['Engagement Analytics', 'Feedback Collection']
  },
  {
    id: 'product-certification',
    name: 'Product Training Certification',
    description: 'Product knowledge and certification training',
    category: 'corporate',
    usageCount: 12,
    fields: ['Employee ID', 'Training Level', 'Certification Requirements'],
    features: ['Skills Assessment', 'Certification Tracking']
  }
];

export default function IndustryTemplateSelector({ onSelectIndustry, onSelectTemplate }: IndustryTemplateSelectorProps) {
  return (
    <div className="space-y-8">
      {/* Industry Type Selection */}
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">What type of event are you organizing?</h2>
          <p className="text-gray-600">Choose your industry to get specialized templates and features</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {INDUSTRY_TYPES.map((industry) => {
            const Icon = industry.icon;
            return (
              <Card 
                key={industry.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${industry.borderColor} border-2`}
                onClick={() => onSelectIndustry(industry.id as any)}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto rounded-xl ${industry.color} flex items-center justify-center mb-4`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold">{industry.title}</CardTitle>
                  <CardDescription className="text-sm">{industry.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {industry.features.map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Popular Templates Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Quick Start Templates</h3>
          <Badge variant="outline" className="text-xs">
            <TrendingUp className="h-3 w-3 mr-1" />
            Most Popular
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {POPULAR_TEMPLATES.map((template) => (
            <Card 
              key={template.id}
              className="cursor-pointer transition-all duration-200 hover:shadow-md border hover:border-blue-300"
              onClick={() => onSelectTemplate?.(template)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base font-semibold leading-tight">
                      {template.name}
                    </CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {template.description}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-xs ml-2">
                    <Clock className="h-3 w-3 mr-1" />
                    {template.usageCount}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex items-center text-xs text-gray-600">
                    <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                    {template.fields.length} pre-configured fields
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {template.features.slice(0, 2).map((feature) => (
                      <Badge key={feature} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}