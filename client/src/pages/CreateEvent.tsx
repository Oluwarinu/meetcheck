import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api';
import IndustryTemplateSelector from '@/components/industry/IndustryTemplateSelector';
import SmartFieldConfiguration from '@/components/industry/SmartFieldConfiguration';
import EducatorTemplates from '@/components/educator/EducatorTemplates';
import { 
  ArrowLeft, 
  ArrowRight, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Upload,
  CheckCircle,
  Image as ImageIcon
} from 'lucide-react';

interface ParticipantField {
  id: string;
  label: string;
  type: string;
  required: boolean;
  enabled: boolean;
  options?: string[];
}

interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  participantFields: ParticipantField[];
  flierFile: File | null;
  flierData: string | null;
  locationVerification: boolean;
  industryType?: 'corporate' | 'education' | 'networking';
}

const DEFAULT_PARTICIPANT_FIELDS: ParticipantField[] = [
  { id: 'fullName', label: 'Full Name', type: 'text', required: true, enabled: true, options: [] },
  { id: 'email', label: 'Email Address', type: 'email', required: true, enabled: true, options: [] },
  { id: 'phone', label: 'Phone Number', type: 'tel', required: false, enabled: false, options: [] },
  { id: 'registrationNumber', label: 'Registration Number', type: 'text', required: false, enabled: true, options: [] },
  { id: 'gender', label: 'Gender', type: 'select', required: false, enabled: true, options: ['Male', 'Female'] },
  { id: 'organization', label: 'Organization', type: 'text', required: false, enabled: false, options: [] },
  { id: 'position', label: 'Position/Title', type: 'text', required: false, enabled: false, options: [] },
  { id: 'dietaryRequirements', label: 'Dietary Requirements', type: 'textarea', required: false, enabled: false, options: [] },
];

export default function CreateEvent() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(0); // Start with industry selection
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    capacity: 50,
    participantFields: DEFAULT_PARTICIPANT_FIELDS,
    flierFile: null,
    flierData: null,
    locationVerification: false,
    industryType: undefined
  });

  const totalSteps = 7;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (updates: Partial<EventFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleIndustrySelect = (industry: 'corporate' | 'education' | 'networking') => {
    updateFormData({ industryType: industry });
    setCurrentStep(1);
  };

  const handleEducatorTemplateSelect = (template: any) => {
    // Convert educator template to event form data
    const participantFields = template.fields.map((field: any) => ({
      id: field.name.toLowerCase().replace(/ /g, '_'),
      label: field.name,
      type: field.type === 'select' ? 'dropdown' : 'text',
      required: field.required,
      enabled: true,
      options: field.options || []
    }));
    
    updateFormData({ 
      industryType: 'education',
      title: template.name,
      description: template.purpose,
      participantFields: [...DEFAULT_PARTICIPANT_FIELDS, ...participantFields]
    });
    setCurrentStep(1);
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create an event.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const eventData = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        capacity: formData.capacity,
        participant_fields: formData.participantFields.filter(field => field.enabled),
        flier_data: formData.flierData,
        location_verification: formData.locationVerification,
        checkin_enabled: true,
        created_by: user.id
      };

      const createdEvent = await apiClient.createEvent(eventData);

      toast({
        title: "Event Created Successfully!",
        description: "Your event has been created and QR code generated.",
      });

      // Navigate to QR code page
      navigate(`/events/${createdEvent.id}/qr`);

    } catch (error: any) {
      console.error('Failed to create event:', error);
      toast({
        title: "Event Creation Failed",
        description: error.message || "Failed to create event. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit to prevent payload issues
        toast({
          title: "File Too Large",
          description: "Please choose a file smaller than 2MB.",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        updateFormData({
          flierFile: file,
          flierData: e.target?.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleParticipantField = (fieldId: string, enabled: boolean) => {
    const updatedFields = formData.participantFields.map(field =>
      field.id === fieldId ? { ...field, enabled } : field
    );
    updateFormData({ participantFields: updatedFields });
  };

  const toggleFieldRequired = (fieldId: string, required: boolean) => {
    const updatedFields = formData.participantFields.map(field =>
      field.id === fieldId ? { ...field, required } : field
    );
    updateFormData({ participantFields: updatedFields });
  };

  const addCustomField = (label: string) => {
    if (!label.trim()) return;

    const newField: ParticipantField = {
      id: `custom_${Date.now()}`,
      label: label.trim(),
      type: 'text',
      required: false,
      enabled: true,
      options: []
    };

    updateFormData({
      participantFields: [...formData.participantFields, newField]
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        // Show educator templates if user is educator, otherwise show industry selector
        if (user?.user_role === 'educator') {
          return (
            <div>
              <EducatorTemplates onSelectTemplate={handleEducatorTemplateSelect} />
            </div>
          );
        }
        
        return (
          <div>
            <IndustryTemplateSelector 
              onSelectIndustry={handleIndustrySelect}
              onSelectTemplate={(template) => {
                updateFormData({ 
                  industryType: template.category,
                  title: template.name,
                  description: template.description
                });
                setCurrentStep(1);
              }}
            />
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Event Title</h3>
              <p className="text-gray-600">Let's start with the basics</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Team Meeting, Conference, Workshop"
                  value={formData.title}
                  onChange={(e) => updateFormData({ title: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide a brief overview of the event"
                  value={formData.description}
                  onChange={(e) => updateFormData({ description: e.target.value })}
                  rows={4}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Date & Time</h3>
              <p className="text-gray-600">When will your event take place?</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => updateFormData({ date: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => updateFormData({ time: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Location & Capacity</h3>
              <p className="text-gray-600">Where will your event be held?</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Enter event location"
                  value={formData.location}
                  onChange={(e) => updateFormData({ location: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="capacity">Expected Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  placeholder="Maximum number of attendees"
                  value={formData.capacity}
                  onChange={(e) => updateFormData({ capacity: parseInt(e.target.value) || 50 })}
                  required
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Participant Information Fields</h3>
              <p className="text-gray-600">Industry-optimized fields with smart recommendations</p>
            </div>

            {formData.industryType ? (
              <SmartFieldConfiguration
                industryType={formData.industryType}
                fields={formData.participantFields}
                onFieldToggle={toggleParticipantField}
                onRequiredToggle={toggleFieldRequired}
              />
            ) : (
              <div className="space-y-4">
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Add a custom field (e.g., Student ID)"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addCustomField((e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const input = document.querySelector('input[placeholder*="custom field"]') as HTMLInputElement;
                      if (input) {
                        addCustomField(input.value);
                        input.value = '';
                      }
                    }}
                  >
                    Add Field
                  </Button>
                </div>

                <div className="space-y-3">
                  {formData.participantFields.map((field) => (
                    <div key={field.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={field.enabled}
                          onCheckedChange={(checked) => toggleParticipantField(field.id, checked as boolean)}
                        />
                        <span className="font-medium">{field.label}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {field.enabled && (
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={field.required}
                              onCheckedChange={(checked) => toggleFieldRequired(field.id, checked as boolean)}
                              disabled={field.id === 'fullName' || field.id === 'email'}
                            />
                            <span className="text-xs text-gray-600">Required</span>
                          </div>
                        )}
                        {(field.id === 'fullName' || field.id === 'email') && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Required</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Event Flier</h3>
              <p className="text-gray-600">Upload a flier that will be displayed to participants when they scan the QR code.</p>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                {formData.flierData ? (
                  <div className="space-y-4">
                    <img
                      src={formData.flierData}
                      alt="Event Flier"
                      className="max-h-64 mx-auto rounded-lg shadow-sm"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => updateFormData({ flierFile: null, flierData: null })}
                    >
                      Remove Flier
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Upload className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Upload Event Flier</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Drag and drop your flier here, or click to browse
                      </p>
                      <p className="text-xs text-gray-500">
                        Supports PNG, JPG, JPEG, GIF, WebP • Max size 2MB
                      </p>
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="flier-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('flier-upload')?.click()}
                      >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Choose File
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Location Verification</h3>
              <p className="text-gray-600">Set up location-based verification for secure check-ins.</p>
            </div>

            <div className="space-y-4">
              <div className="p-6 border rounded-lg">
                <div className="flex items-center space-x-3 mb-4">
                  <Checkbox
                    checked={formData.locationVerification}
                    onCheckedChange={(checked) => updateFormData({ locationVerification: checked as boolean })}
                  />
                  <div>
                    <h4 className="font-medium">Enable Location Verification</h4>
                    <p className="text-sm text-gray-600">
                      Require participants to be at the event location to check in
                    </p>
                  </div>
                </div>

                {formData.locationVerification && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Location verification will use GPS coordinates to ensure participants are physically present at the event location during check-in.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Review & Create</h3>
              <p className="text-gray-600">Review your event details and create the event.</p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                <div>
                  <h4 className="font-medium text-lg">{formData.title}</h4>
                  <p className="text-gray-600">{formData.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Date:</strong> {formData.date}
                  </div>
                  <div>
                    <strong>Time:</strong> {formData.time}
                  </div>
                  <div>
                    <strong>Location:</strong> {formData.location}
                  </div>
                  <div>
                    <strong>Capacity:</strong> {formData.capacity}
                  </div>
                </div>

                <div>
                  <strong className="text-sm">Participant Fields:</strong>
                  <p className="text-sm text-gray-600 mt-1">
                    {formData.participantFields
                      .filter(field => field.enabled)
                      .map(field => field.label)
                      .join(', ')}
                  </p>
                </div>

                {formData.flierData && (
                  <div>
                    <strong className="text-sm">Event Flier:</strong>
                    <div className="mt-2">
                      <img
                        src={formData.flierData}
                        alt="Event Flier"
                        className="max-h-32 rounded border"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <button 
            onClick={() => navigate('/events')}
            className="hover:text-gray-900"
          >
            Events
          </button>
          <span className="mx-2">/</span>
          <span>New Event</span>
        </div>

        {currentStep > 0 && (
          <>
            <h1 className="text-2xl font-bold mb-2">Step {currentStep} of {totalSteps}</h1>
            <Progress value={progress} className="h-2" />
          </>
        )}
        {currentStep === 0 && (
          <h1 className="text-2xl font-bold mb-2">Choose Your Event Type</h1>
        )}
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-8">
          {renderStep()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {currentStep === 0 ? 'Cancel' : 'Previous'}
        </Button>

        {currentStep === 0 ? null : currentStep === totalSteps ? (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.title || !formData.date || !formData.location}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Creating...
              </>
            ) : (
              <>
                Create Event & Generate QR
                <CheckCircle className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={
              (currentStep === 1 && (!formData.title || !formData.description)) ||
              (currentStep === 2 && (!formData.date || !formData.time)) ||
              (currentStep === 3 && (!formData.location || !formData.capacity))
            }
            className="bg-blue-600 hover:bg-blue-700"
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}