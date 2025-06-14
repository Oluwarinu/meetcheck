
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LocationCapacityStepProps {
  formData: {
    location: string;
    capacity: string;
  };
  template?: any;
  onUpdate: (field: string, value: string) => void;
}

export function LocationCapacityStep({ formData, template, onUpdate }: LocationCapacityStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          placeholder="Enter event location"
          value={formData.location}
          onChange={(e) => onUpdate("location", e.target.value)}
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
          onChange={(e) => onUpdate("capacity", e.target.value)}
          className="mt-1"
        />
        {template && (
          <p className="text-sm text-muted-foreground mt-1">
            Recommended capacity for {template.title.toLowerCase()}: {template.capacity}
          </p>
        )}
      </div>
    </div>
  );
}
