
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BasicInfoStepProps {
  formData: {
    title: string;
    description: string;
  };
  template?: any;
  onUpdate: (field: string, value: string) => void;
}

export function BasicInfoStep({ formData, template, onUpdate }: BasicInfoStepProps) {
  return (
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
          onChange={(e) => onUpdate("title", e.target.value)}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Provide a brief overview of the event"
          value={formData.description}
          onChange={(e) => onUpdate("description", e.target.value)}
          className="mt-1 min-h-[120px]"
        />
      </div>
    </div>
  );
}
