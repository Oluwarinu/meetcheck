import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api';
import { 
  ArrowLeft, 
  ArrowRight, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  BookOpen,
  FileText,
  CheckCircle,
  QrCode,
  Plus
} from 'lucide-react';

interface ParticipantField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'select' | 'number' | 'tel';
  required: boolean;
  enabled: boolean;
  options?: string[];
  placeholder?: string;
  validation?: string;
}

interface AcademicEventData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  course_code: string;
  academic_year: string;
  department: string;
  event_type: 'lecture' | 'lab' | 'seminar' | 'exam' | 'workshop';
  participant_fields: ParticipantField[];
}

interface EventCreationFlowProps {
  onComplete?: (eventId: string) => void;
}

export const EventCreationFlow: React.FC<EventCreationFlowProps> = ({ onComplete }) => {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Initialize with template data if available
  const initializeEventData = (): AcademicEventData => {
    const storedTemplate = sessionStorage.getItem('selectedTemplate');
    let baseData: AcademicEventData = {
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      capacity: 30,
      course_code: '',
      academic_year: '2024-2025',
      department: '',
      event_type: 'lecture',
      participant_fields: [
        { id: 'fullName', label: 'Full Name', type: 'text', required: true, enabled: true, placeholder: 'Enter full name' },
        { id: 'email', label: 'Email Address', type: 'email', required: true, enabled: true, placeholder: 'student@university.edu' },
        { id: 'student_id', label: 'Student ID', type: 'text', required: true, enabled: true, placeholder: 'e.g. 2024001' },
        { id: 'course_code', label: 'Course Code', type: 'text', required: false, enabled: false, placeholder: 'e.g. CS101' },
        { id: 'academic_year', label: 'Academic Year', type: 'select', required: false, enabled: false, options: ['2024-2025', '2023-2024', '2022-2023'] },
        { id: 'department', label: 'Faculty/Department', type: 'select', required: false, enabled: false, options: ['Computer Science', 'Mathematics', 'English', 'Physics', 'Chemistry', 'Biology'] },
        { id: 'campus_location', label: 'Campus Location', type: 'select', required: false, enabled: false, options: ['Main Campus', 'North Campus', 'South Campus', 'Online'] },
        { id: 'gpa_range', label: 'Current GPA Range', type: 'select', required: false, enabled: false, options: ['4.0-3.7', '3.6-3.3', '3.2-2.9', '2.8-2.5', 'Below 2.5'] },
        { id: 'major_field', label: 'Major Field of Study', type: 'text', required: false, enabled: false, placeholder: 'e.g. Computer Science' }
      ]
    };

    if (storedTemplate) {
      try {
        const template = JSON.parse(storedTemplate);
        
        // Pre-populate fields based on template
        if (template.category === 'attendance') {
          baseData.title = 'Attendance Tracking Session';
          baseData.description = template.purpose;
          // Enable attendance-specific fields
          baseData.participant_fields = baseData.participant_fields.map(field => {
            if (['student_id', 'course_code', 'academic_year', 'department'].includes(field.id)) {
              return { ...field, enabled: true, required: true };
            }
            return field;
          });
        } else if (template.category === 'assignment') {
          baseData.title = 'Assignment Performance Tracking';
          baseData.description = template.purpose;
          // Enable assignment-specific fields
          baseData.participant_fields = baseData.participant_fields.map(field => {
            if (['student_id', 'course_code', 'academic_year', 'department', 'gpa_range'].includes(field.id)) {
              return { ...field, enabled: true, required: field.id !== 'gpa_range' };
            }
            return field;
          });
        }
        
        // Clear template from storage after use
        sessionStorage.removeItem('selectedTemplate');
      } catch (error) {
        console.error('Failed to parse template:', error);
      }
    }

    return baseData;
  };

  const [eventData, setEventData] = useState<AcademicEventData>(initializeEventData());

  const totalSteps = 4;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const updateEventData = (updates: Partial<AcademicEventData>) => {
    setEventData(prev => ({ ...prev, ...updates }));
  };

  const addCustomField = () => {
    const newField: ParticipantField = {
      id: `custom_${Date.now()}`,
      label: `Custom Field ${eventData.participant_fields.length - 8}`,
      type: 'text',
      required: false,
      enabled: true,
      placeholder: 'Enter value...'
    };
    
    updateEventData({ 
      participant_fields: [...eventData.participant_fields, newField] 
    });
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0:
        return !!(eventData.title && eventData.description && eventData.course_code);
      case 1:
        return !!(eventData.date && eventData.time);
      case 2:
        return !!(eventData.location && eventData.capacity > 0);
      case 3:
        return eventData.participant_fields.filter(f => f.enabled).length >= 2;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
    } else {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive"
      });
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create an academic event.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const academicEventPayload = {
        title: `${eventData.course_code}: ${eventData.title}`,
        description: eventData.description,
        date: eventData.date,
        time: eventData.time,
        location: eventData.location,
        capacity: eventData.capacity,
        participant_fields: eventData.participant_fields.filter(field => field.enabled),
        industry_type: 'education',
        checkin_enabled: true,
        location_verification: false
      };

      const createdEvent = await apiClient.createEvent(academicEventPayload);

      toast({
        title: "Academic Event Created Successfully!",
        description: `${eventData.course_code} event created with QR code ready for student check-ins.`,
      });

      if (onComplete) {
        onComplete(createdEvent.id);
      } else {
        setLocation(`/events/${createdEvent.id}/qr`);
      }

    } catch (error: any) {
      console.error('Failed to create academic event:', error);
      toast({
        title: "Event Creation Failed",
        description: error.message || "Failed to create academic event. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <BookOpen className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Academic Event Details</h3>
              <p className="text-gray-600">Set up your course event for student attendance tracking</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="course_code">Course Code *</Label>
                  <Input
                    id="course_code"
                    placeholder="e.g. CS101, MATH201"
                    value={eventData.course_code}
                    onChange={(e) => updateEventData({ course_code: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="event_type">Event Type</Label>
                  <select
                    id="event_type"
                    value={eventData.event_type}
                    onChange={(e) => updateEventData({ event_type: e.target.value as any })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="lecture">Lecture</option>
                    <option value="lab">Lab Session</option>
                    <option value="seminar">Seminar</option>
                    <option value="exam">Exam</option>
                    <option value="workshop">Workshop</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g. Introduction to Algorithms, Midterm Exam"
                  value={eventData.title}
                  onChange={(e) => updateEventData({ title: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the academic event, topics covered, or requirements"
                  value={eventData.description}
                  onChange={(e) => updateEventData({ description: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="academic_year">Academic Year</Label>
                  <select
                    id="academic_year"
                    value={eventData.academic_year}
                    onChange={(e) => updateEventData({ academic_year: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="2024-2025">2024-2025</option>
                    <option value="2023-2024">2023-2024</option>
                    <option value="2022-2023">2022-2023</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    placeholder="e.g. Computer Science, Mathematics"
                    value={eventData.department}
                    onChange={(e) => updateEventData({ department: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Calendar className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Schedule</h3>
              <p className="text-gray-600">When will this academic event take place?</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={eventData.date}
                    onChange={(e) => updateEventData({ date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={eventData.time}
                    onChange={(e) => updateEventData({ time: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">Academic Event Preview</h4>
                <div className="text-sm text-purple-800">
                  <p><strong>{eventData.course_code}:</strong> {eventData.title}</p>
                  <p><strong>Type:</strong> {eventData.event_type.charAt(0).toUpperCase() + eventData.event_type.slice(1)}</p>
                  {eventData.date && eventData.time && (
                    <p><strong>Scheduled:</strong> {new Date(eventData.date + 'T' + eventData.time).toLocaleString()}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Location & Capacity</h3>
              <p className="text-gray-600">Where will students attend this event?</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="e.g. Room 101, Science Building, Online via Zoom"
                  value={eventData.location}
                  onChange={(e) => updateEventData({ location: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="capacity">Expected Student Capacity *</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  max="500"
                  placeholder="Maximum number of students"
                  value={eventData.capacity}
                  onChange={(e) => updateEventData({ capacity: parseInt(e.target.value) || 30 })}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  This helps with attendance tracking and resource planning
                </p>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Student Information Fields</h3>
              <p className="text-gray-600">Configure what information students provide during check-in</p>
            </div>

            <div className="space-y-3">
              {eventData.participant_fields.map((field, index) => (
                <div key={field.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={field.enabled}
                      onChange={(e) => {
                        const updatedFields = eventData.participant_fields.map(f =>
                          f.id === field.id ? { ...f, enabled: e.target.checked } : f
                        );
                        updateEventData({ participant_fields: updatedFields });
                      }}
                      className="rounded"
                    />
                    <div>
                      <span className="font-medium">{field.label}</span>
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {field.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="flex items-center space-x-1 text-sm">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => {
                          const updatedFields = eventData.participant_fields.map(f =>
                            f.id === field.id ? { ...f, required: e.target.checked } : f
                          );
                          updateEventData({ participant_fields: updatedFields });
                        }}
                        className="rounded"
                        disabled={!field.enabled}
                      />
                      <span className={field.enabled ? "text-gray-700" : "text-gray-400"}>Required</span>
                    </label>
                    {index >= 9 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          const updatedFields = eventData.participant_fields.filter(f => f.id !== field.id);
                          updateEventData({ participant_fields: updatedFields });
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Custom Field Section */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Custom Fields</h4>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={addCustomField}
                  className="text-purple-600 border-purple-200 hover:bg-purple-50"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Field
                </Button>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Add custom fields specific to your academic requirements
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Academic Benefits</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Track attendance patterns for academic performance correlation</li>
                <li>• Generate department-specific analytics</li>
                <li>• Enable early intervention for at-risk students</li>
                <li>• Maintain academic records integration</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-purple-600" />
              Create Academic Event
            </CardTitle>
            <span className="text-sm text-gray-500">
              Step {currentStep + 1} of {totalSteps}
            </span>
          </div>
          <Progress value={progress} className="mt-2" />
        </CardHeader>

        <CardContent>
          {renderStep()}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            {currentStep === totalSteps - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !validateStep(currentStep)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Event...
                  </>
                ) : (
                  <>
                    <QrCode className="h-4 w-4 mr-2" />
                    Create Event & Generate QR
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!validateStep(currentStep)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventCreationFlow;