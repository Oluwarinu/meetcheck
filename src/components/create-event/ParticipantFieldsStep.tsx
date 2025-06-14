
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface ParticipantField {
  id: string;
  label: string;
  required: boolean;
  enabled: boolean;
}

interface ParticipantFieldsStepProps {
  participantFields: ParticipantField[];
  template?: any;
  onUpdateField: (fieldId: string, property: 'enabled' | 'required', value: boolean) => void;
}

export function ParticipantFieldsStep({ participantFields, template, onUpdateField }: ParticipantFieldsStepProps) {
  return (
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
        {participantFields.map((field) => (
          <div key={field.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Checkbox
                id={`field-${field.id}`}
                checked={field.enabled}
                onCheckedChange={(checked) => 
                  onUpdateField(field.id, 'enabled', checked as boolean)
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
                    onUpdateField(field.id, 'required', checked as boolean)
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
  );
}
