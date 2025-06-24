import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { defaultParticipantFields, getTemplateTitle, getTemplateDescription } from "@/utils/eventTemplates";
import { StepHeader } from "./create-event/StepHeader";
import { StepperNavigation } from "./create-event/StepperNavigation";
import { StepRenderer } from "./create-event/useStepRenderer";
import { apiClient } from "@/lib/api";

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
    participantFields: defaultParticipantFields,
    flierData: null as string | null,
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

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateParticipantField = (
    fieldId: string,
    property: "enabled" | "required" | "addCustom",
    value: boolean | string | any
  ) => {
    setFormData(prev => {
      if (property === "addCustom") {
        return {
          ...prev,
          participantFields: [
            ...prev.participantFields,
            value
          ],
        };
      }
      return {
        ...prev,
        participantFields: prev.participantFields.map(field =>
          field.id === fieldId ? { ...field, [property]: value } : field
        ),
      };
    });
  };

  const updateFlierData = (flierData: string | null) => {
    setFormData(prev => ({ ...prev, flierData }));
  };

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        // Transform the form data to match backend schema
        const eventPayload = {
          title: formData.title,
          description: formData.description,
          date: formData.date,
          time: formData.time,
          location: formData.location,
          capacity: formData.capacity ? parseInt(formData.capacity) : null,
          participant_fields: formData.participantFields,
          flier_data: formData.flierData,
          checkin_enabled: true,
          checkin_deadline: null // Event creator can set this later in settings
        };
        
        const eventData = await apiClient.createEvent(eventPayload);
        navigate(`/events/${eventData.id}/qr`, {
          state: {
            eventData,
            eventId: eventData.id
          }
        });
      } catch (error) {
        console.error("Failed to create event:", error);
        // Handle error appropriately
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const stepElement = StepRenderer({
    currentStep,
    formData,
    template,
    updateFormData,
    updateParticipantField,
    updateFlierData,
  });

  return (
    <div className="max-w-2xl mx-auto">
      <StepHeader
        currentStep={currentStep}
        totalSteps={totalSteps}
        template={template}
      />
      <div className="bg-white border rounded-lg shadow-sm px-0 sm:px-0 mb-8">
        <div className="space-y-6 px-6 py-0">
          {stepElement}
          <StepperNavigation
            currentStep={currentStep}
            totalSteps={totalSteps}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
          />
        </div>
      </div>
    </div>
  );
}
