
import React from "react";
import { BasicInfoStep } from "@/components/create-event/BasicInfoStep";
import { DateTimeStep } from "@/components/create-event/DateTimeStep";
import { LocationCapacityStep } from "@/components/create-event/LocationCapacityStep";
import { ParticipantFieldsStep } from "@/components/create-event/ParticipantFieldsStep";
import { ReviewStep } from "@/components/create-event/ReviewStep";
import { FlierUploadStep } from "@/components/create-event/FlierUploadStep";
import { PlaceholderStep } from "@/components/create-event/PlaceholderStep";

interface StepRendererParams {
  formData: any;
  template?: any;
  updateFormData: (field: string, value: string) => void;
  updateParticipantField: (
    fieldId: string,
    property: "enabled" | "required" | "addCustom",
    value: boolean | string | any
  ) => void;
  updateFlierData: (flierData: string | null) => void;
  currentStep: number;
}

// This is now a regular (not a hook) rendering function
export function StepRenderer({
  currentStep,
  formData,
  template,
  updateFormData,
  updateParticipantField,
  updateFlierData,
}: StepRendererParams) {
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
        <FlierUploadStep
          flierData={formData.flierData}
          onFlierUpdate={updateFlierData}
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
}
