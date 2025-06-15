
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BasicInfoStep } from "@/components/create-event/BasicInfoStep";
import { DateTimeStep } from "@/components/create-event/DateTimeStep";
import { LocationCapacityStep } from "@/components/create-event/LocationCapacityStep";
import { ParticipantFieldsStep } from "@/components/create-event/ParticipantFieldsStep";
import { ReviewStep } from "@/components/create-event/ReviewStep";
import { FlierUploadStep } from "@/components/create-event/FlierUploadStep";
import { PlaceholderStep } from "@/components/create-event/PlaceholderStep";
import { 
  defaultParticipantFields, 
  getTemplateTitle, 
  getTemplateDescription 
} from "@/utils/eventTemplates";

export default function CreateEvent() {
  const [currentStep, setCurrentStep] = useState(1);
  const location = useLocation();
  const navigate = useNavigate();
  
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
      const eventId = Date.now().toString();
      console.log("Event created:", formData);
      
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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep 
            formData={formData} 
            template={template} 
            onUpdate={updateFormData} 
          />
        );
      case 2:
        return (
          <DateTimeStep 
            formData={formData} 
            onUpdate={updateFormData} 
          />
        );
      case 3:
        return (
          <LocationCapacityStep 
            formData={formData} 
            template={template} 
            onUpdate={updateFormData} 
          />
        );
      case 4:
        return (
          <ParticipantFieldsStep 
            participantFields={formData.participantFields} 
            template={template} 
            onUpdateField={updateParticipantField} 
          />
        );
      case 5:
        return (
          <PlaceholderStep 
            title="Attendance Settings" 
            description="Configure how attendees will check in to your event." 
          />
        );
      case 6:
        return (
          <PlaceholderStep 
            title="Location Verification" 
            description="Set up location-based verification for secure check-ins." 
          />
        );
      case 7:
        return <ReviewStep formData={formData} />;
      default:
        return null;
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
          {renderStep()}

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
