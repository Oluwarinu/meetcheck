
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DateTimeStepProps {
  formData: {
    date: string;
    time: string;
  };
  onUpdate: (field: string, value: string) => void;
}

export function DateTimeStep({ formData, onUpdate }: DateTimeStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => onUpdate("date", e.target.value)}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="time">Time</Label>
        <Input
          id="time"
          type="time"
          value={formData.time}
          onChange={(e) => onUpdate("time", e.target.value)}
          className="mt-1"
        />
      </div>
    </div>
  );
}
