
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
  };
}

export function ReviewStep({ formData }: ReviewStepProps) {
  return (
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
  );
}
