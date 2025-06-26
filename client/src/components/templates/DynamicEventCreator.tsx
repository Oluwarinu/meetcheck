import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
// Define types locally
interface TemplateField {
  id: string;
  type: string;
  label: string;
  required: boolean;
  placeholder?: string;
  validation?: any;
  options?: string[];
  fileTypes?: string[];
  maxFileSize?: number;
}

interface DynamicTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  template_type: string;
  dynamic_fields: TemplateField[];
  features: any[];
  max_attendees: number;
  duration_hours: number;
}

const validateTemplateField = (field: TemplateField, value: any): { valid: boolean; error?: string } => {
  if (field.required && (!value || value === '')) {
    return { valid: false, error: `${field.label} is required` };
  }
  return { valid: true };
};
import { apiClient } from '@/lib/api';
import { 
  ArrowLeft, 
  ArrowRight, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Upload,
  CheckCircle,
  FileText,
  Star
} from 'lucide-react';

interface DynamicEventCreatorProps {
  template: DynamicTemplate;
  onComplete?: (eventId: string) => void;
  onBack?: () => void;
}

interface EventData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  participant_data: Record<string, any>;
  template_id: string;
}

const DynamicFieldRenderer: React.FC<{
  field: TemplateField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}> = ({ field, value, onChange, error }) => {
  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'url':
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={error ? 'border-red-500' : ''}
          />
        );

      case 'number':
      case 'grade':
        return (
          <Input
            type="number"
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            min={field.validation?.min}
            max={field.validation?.max}
            className={error ? 'border-red-500' : ''}
          />
        );

      case 'date':
        return (
          <Input
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={error ? 'border-red-500' : ''}
          />
        );

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background ${error ? 'border-red-500' : ''}`}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((option: any) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'file':
        return (
          <div className="space-y-2">
            <Input
              type="file"
              accept={field.fileTypes?.join(',')}
              onChange={(e) => onChange(e.target.files?.[0])}
              className={error ? 'border-red-500' : ''}
            />
            {field.fileTypes && (
              <p className="text-xs text-gray-500">
                Allowed types: {field.fileTypes.join(', ')}
                {field.maxFileSize && ` (Max: ${(field.maxFileSize / 1024 / 1024).toFixed(1)}MB)`}
              </p>
            )}
          </div>
        );

      default:
        return (
          <Input
            type="text"
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={error ? 'border-red-500' : ''}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={field.id} className="flex items-center gap-2">
        {field.label}
        {field.required && <span className="text-red-500">*</span>}
      </Label>
      {renderField()}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default function DynamicEventCreator({ template, onComplete, onBack }: DynamicEventCreatorProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [eventData, setEventData] = useState<EventData>({
    title: '',
    description: template.description || '',
    date: '',
    time: '',
    location: '',
    capacity: template.max_attendees,
    participant_data: {},
    template_id: template.id
  });

  const steps = [
    { title: 'Event Details', description: 'Basic event information' },
    { title: 'Template Configuration', description: 'Configure dynamic fields and features' },
    { title: 'Review & Create', description: 'Review and create your event' }
  ];

  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 0) {
      // Validate basic event details
      if (!eventData.title.trim()) newErrors.title = 'Event title is required';
      if (!eventData.date) newErrors.date = 'Event date is required';
      if (!eventData.time) newErrors.time = 'Event time is required';
      if (!eventData.location.trim()) newErrors.location = 'Location is required';
      if (eventData.capacity < 1) newErrors.capacity = 'Capacity must be at least 1';
    } else if (currentStep === 1) {
      // Validate template fields that are required for event setup
      template.dynamic_fields.forEach((field: any) => {
        if (field.required && field.id !== 'name' && field.id !== 'email') {
          const validation = validateTemplateField(field, eventData.participant_data[field.id]);
          if (!validation.valid) {
            newErrors[field.id] = validation.error || `${field.label} is required`;
          }
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setEventData(prev => ({
      ...prev,
      participant_data: {
        ...prev.participant_data,
        [fieldId]: value
      }
    }));

    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);
    try {
      // Prepare event data with template configuration
      const eventPayload = {
        title: eventData.title,
        description: eventData.description,
        date: eventData.date,
        time: eventData.time,
        location: eventData.location,
        capacity: eventData.capacity,
        checkin_enabled: template.features.some((f: any) => f.type === 'qr_checkin' && f.enabled),
        participant_fields: template.dynamic_fields.map((field: any) => ({
          id: field.id,
          label: field.label,
          enabled: true,
          required: field.required
        })),
        template_type: template.template_type,
        features: template.features.filter((f: any) => f.enabled)
      };

      const newEvent = await apiClient.createEvent(eventPayload);
      
      toast({
        title: "Event Created Successfully",
        description: `${eventData.title} has been created using the ${template.name} template.`,
      });

      if (onComplete) {
        onComplete(newEvent.id);
      }
    } catch (error: any) {
      console.error('Failed to create event:', error);
      toast({
        title: "Creation Failed",
        description: error?.message || "Failed to create event. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Templates
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create Event</h1>
            <p className="text-gray-600 mt-1">Using template: {template.name}</p>
          </div>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Star className="h-4 w-4" />
          {template.template_type}
        </Badge>
      </div>

      {/* Progress */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Step {currentStep + 1} of {steps.length}</span>
          <span className="text-sm text-gray-500">{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="w-full" />
        <div className="flex justify-between">
          {steps.map((step, index) => (
            <div key={index} className={`text-center ${index <= currentStep ? 'text-purple-600' : 'text-gray-400'}`}>
              <div className="text-sm font-medium">{step.title}</div>
              <div className="text-xs">{step.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {currentStep === 0 && <Calendar className="h-5 w-5" />}
            {currentStep === 1 && <FileText className="h-5 w-5" />}
            {currentStep === 2 && <CheckCircle className="h-5 w-5" />}
            {steps[currentStep].title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStep === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter event title"
                  value={eventData.title}
                  onChange={(e) => setEventData(prev => ({ ...prev, title: e.target.value }))}
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Expected Capacity *</Label>
                <Input
                  id="capacity"
                  type="number"
                  placeholder="Number of attendees"
                  value={eventData.capacity}
                  onChange={(e) => setEventData(prev => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))}
                  className={errors.capacity ? 'border-red-500' : ''}
                />
                {errors.capacity && <p className="text-sm text-red-500">{errors.capacity}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Event Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={eventData.date}
                  onChange={(e) => setEventData(prev => ({ ...prev, date: e.target.value }))}
                  className={errors.date ? 'border-red-500' : ''}
                />
                {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Event Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={eventData.time}
                  onChange={(e) => setEventData(prev => ({ ...prev, time: e.target.value }))}
                  className={errors.time ? 'border-red-500' : ''}
                />
                {errors.time && <p className="text-sm text-red-500">{errors.time}</p>}
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="Event location"
                  value={eventData.location}
                  onChange={(e) => setEventData(prev => ({ ...prev, location: e.target.value }))}
                  className={errors.location ? 'border-red-500' : ''}
                />
                {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Event description"
                  value={eventData.description}
                  onChange={(e) => setEventData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Template Configuration</h3>
                <p className="text-gray-600 mb-6">
                  Configure the participant fields and features for this {template.template_type}.
                </p>
              </div>

              {/* Dynamic Fields Configuration */}
              <div className="space-y-4">
                <h4 className="font-medium">Participant Information Fields</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {template.dynamic_fields.map((field: any) => (
                    <DynamicFieldRenderer
                      key={field.id}
                      field={field}
                      value={eventData.participant_data[field.id]}
                      onChange={(value) => handleFieldChange(field.id, value)}
                      error={errors[field.id]}
                    />
                  ))}
                </div>
              </div>

              {/* Features Configuration */}
              <div className="space-y-4">
                <h4 className="font-medium">Enabled Features</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {template.features.filter((f: any) => f.enabled).map((feature: any, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium capitalize">
                          {feature.type.replace('_', ' ')}
                        </div>
                        <div className="text-sm text-gray-600">
                          {feature.type === 'file_upload' && 'Participants can upload files'}
                          {feature.type === 'grade_tracking' && 'Track and manage grades'}
                          {feature.type === 'qr_checkin' && 'QR code check-in system'}
                          {feature.type === 'attendance' && 'Attendance tracking'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Review & Create Event</h3>
                <p className="text-gray-600">
                  Please review your event details before creating.
                </p>
              </div>

              {/* Event Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Event Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{eventData.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{eventData.date} at {eventData.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{eventData.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>{eventData.capacity} attendees</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Template Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span>{template.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-gray-500" />
                      <span>{template.dynamic_fields.length} participant fields</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-gray-500" />
                      <span>{template.features.filter((f: any) => f.enabled).length} features enabled</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>

        {currentStep < steps.length - 1 ? (
          <Button onClick={handleNext} className="flex items-center gap-2">
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creating...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                Create Event
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}