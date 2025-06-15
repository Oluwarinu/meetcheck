
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { defaultParticipantFields, getTemplateTitle, getTemplateDescription } from "@/utils/eventTemplates";
import { StepHeader } from "./create-event/StepHeader";
import { StepperNavigation } from "./create-event/StepperNavigation";
import { useStepRenderer } from "./create-event/useStepRenderer";

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

  const stepElement = useStepRenderer(
    currentStep,
    { formData, template, updateFormData, updateParticipantField, updateFlierData }
  );

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
