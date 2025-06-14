import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const defaultParticipantFields = [
  { id: "name", label: "Full Name", required: true, enabled: true },
  { id: "email", label: "Email Address", required: true, enabled: true },
  { id: "phone", label: "Phone Number", required: false, enabled: false },
  { id: "registration", label: "Registration Number", required: false, enabled: false },
  { id: "gender", label: "Gender", required: false, enabled: false },
  { id: "organization", label: "Organization", required: false, enabled: false },
  { id: "position", label: "Position/Title", required: false, enabled: false },
  { id: "dietary", label: "Dietary Requirements", required: false, enabled: false },
];

const getTemplateTitle = (templateId: string) => {
  const titles = {
    lecture: "Academic Lecture - ",
    wedding: "Wedding Celebration - ",
    conference: "Business Conference - ",
    workshop: "Workshop/Training - "
  };
  return titles[templateId as keyof typeof titles] || "";
};

const getTemplateDescription = (templateId: string) => {
  const descriptions = {
    lecture: "Join us for an engaging academic presentation covering important topics in your field of study.",
    wedding: "Celebrate this special day with us as we unite two hearts in marriage. Your presence will make our day even more memorable.",
    conference: "Connect with industry professionals, learn from expert speakers, and discover the latest trends and innovations.",
    workshop: "Enhance your skills through hands-on learning and interactive sessions led by experienced instructors."
  };
  return descriptions[templateId as keyof typeof descriptions] || "";
};

export default function CreateEvent() {
  const [currentStep, setCurrentStep] = useState(1);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get template data from navigation state
  const template = location.state?.template;
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    capacity: "",
    participantFields: defaultParticipantFields
  });

  // Pre-fill form data when template is provided
  useEffect(() => {
    if (template) {
      const templateCapacity = template.capacity?.toString() || "";
      
      setFormData(prev => ({
        ...prev,
        title: getTemplateTitle(template.id),
        description: getTemplateDescription(template.id),
        capacity: templateCapacity,
        participantFields: template.participantFields || defaultParticipantFields
      }));
    }
  }, [template]);

  const totalSteps = 7;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Handle form submission and generate QR code
      const eventId = Date.now().toString(); // Simple ID generation
      console.log("Event created:", formData);
      
      // Navigate to QR code page with event data
      navigate(`/events/${eventId}/qr`, { 
        state: { 
          eventData: formData,
          eventId: eventId
        } 
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateParticipantField = (fieldId: string, property: 'enabled' | 'required', value: boolean) => {
    setFormData(prev => ({
      ...prev,
      participantFields: prev.participantFields.map(field =>
        field.id === fieldId ? { ...field, [property]: value } : field
      )
    }));
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Basic Information";
      case 2: return "Date & Time";
      case 3: return "Location & Capacity";
      case 4: return "Participant Information";
      case 5: return "Attendance Settings";
      case 6: return "Location Verification";
      case 7: return "Review & Create";
      default: return "Event Details";
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link to="/events" className="text-meetcheck-blue hover:text-blue-600 flex items-center gap-1 mb-4">
          <ChevronLeft className="h-4 w-4" />
          Events
        </Link>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span>Events</span>
          <span>/</span>
          <span>New Event</span>
          {template && (
            <>
              <span>/</span>
              <span>{template.title}</span>
            </>
          )}
        </div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">
            Step {currentStep} of {totalSteps}
            {template && <span className="text-lg font-normal text-muted-foreground ml-2">- {template.title}</span>}
          </h1>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{getStepTitle()}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              {template && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>Template:</strong> {template.title} - Form fields have been pre-configured for you!
                  </p>
                </div>
              )}
              <div>
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Team Meeting, Conference, Workshop"
                  value={formData.title}
                  onChange={(e) => updateFormData("title", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide a brief overview of the event"
                  value={formData.description}
                  onChange={(e) => updateFormData("description", e.target.value)}
                  className="mt-1 min-h-[120px]"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => updateFormData("date", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => updateFormData("time", e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Enter event location"
                  value={formData.location}
                  onChange={(e) => updateFormData("location", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="capacity">Expected Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  placeholder="Maximum number of attendees"
                  value={formData.capacity}
                  onChange={(e) => updateFormData("capacity", e.target.value)}
                  className="mt-1"
                />
                {template && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Recommended capacity for {template.title.toLowerCase()}: {template.capacity}
                  </p>
                )}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-3">Configure Participant Information Fields</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {template 
                    ? `These fields have been pre-configured based on the ${template.title} template. You can adjust them as needed.`
                    : "Select which information you want to collect from participants during registration."
                  }
                </p>
              </div>
              <div className="space-y-3">
                {formData.participantFields.map((field) => (
                  <div key={field.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={`field-${field.id}`}
                        checked={field.enabled}
                        onCheckedChange={(checked) => 
                          updateParticipantField(field.id, 'enabled', checked as boolean)
                        }
                        disabled={field.id === 'name' || field.id === 'email'}
                      />
                      <Label htmlFor={`field-${field.id}`} className="font-medium">
                        {field.label}
                      </Label>
                    </div>
                    {field.enabled && (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`required-${field.id}`}
                          checked={field.required}
                          onCheckedChange={(checked) => 
                            updateParticipantField(field.id, 'required', checked as boolean)
                          }
                          disabled={field.id === 'name' || field.id === 'email'}
                        />
                        <Label htmlFor={`required-${field.id}`} className="text-sm text-muted-foreground">
                          Required
                        </Label>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold mb-2">Attendance Settings</h3>
              <p className="text-muted-foreground">Configure how attendees will check in to your event.</p>
            </div>
          )}

          {currentStep === 6 && (
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold mb-2">Location Verification</h3>
              <p className="text-muted-foreground">Set up location-based verification for secure check-ins.</p>
            </div>
          )}

          {currentStep === 7 && (
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold mb-2">Review & Create</h3>
              <p className="text-muted-foreground">Review your event details and create the event.</p>
              <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left">
                <h4 className="font-medium mb-2">{formData.title}</h4>
                <p className="text-sm text-muted-foreground mb-2">{formData.description}</p>
                <p className="text-sm"><strong>Date:</strong> {formData.date}</p>
                <p className="text-sm"><strong>Time:</strong> {formData.time}</p>
                <p className="text-sm"><strong>Location:</strong> {formData.location}</p>
                <p className="text-sm"><strong>Capacity:</strong> {formData.capacity}</p>
                <div className="mt-3">
                  <p className="text-sm font-medium">Participant Fields:</p>
                  <p className="text-xs text-muted-foreground">
                    {formData.participantFields
                      .filter(field => field.enabled)
                      .map(field => field.label)
                      .join(", ")}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              className="bg-meetcheck-blue hover:bg-blue-600"
            >
              {currentStep === totalSteps ? "Create Event & Generate QR" : "Next"}
              {currentStep < totalSteps && <ChevronRight className="h-4 w-4 ml-1" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
