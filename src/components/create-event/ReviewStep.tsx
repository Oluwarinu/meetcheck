
import React from "react";

interface ReviewStepProps {
  formData: {
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    capacity: string;
    participantFields: Array<{
      id: string;
      label: string;
      enabled: boolean;
    }>;
    flierData: string | null;
  };
}

export function ReviewStep({ formData }: ReviewStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Review & Create</h3>
        <p className="text-muted-foreground">Review your event details and create the event.</p>
      </div>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
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

        {formData.flierData && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Event Flier</h4>
            <div className="relative">
              <img 
                src={formData.flierData} 
                alt="Event Flier Preview" 
                className="w-full max-h-64 object-contain rounded border"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              This flier will be displayed to participants during check-in
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
