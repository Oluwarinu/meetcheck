
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { v4 as uuidv4 } from "uuid";

interface ParticipantField {
  id: string;
  label: string;
  required: boolean;
  enabled: boolean;
  custom?: boolean; // marks custom fields
}

interface ParticipantFieldsStepProps {
  participantFields: ParticipantField[];
  template?: any;
  onUpdateField: (
    fieldId: string,
    property: 'enabled' | 'required' | 'addCustom',
    value: boolean | string | ParticipantField
  ) => void;
}

export function ParticipantFieldsStep({ participantFields, template, onUpdateField }: ParticipantFieldsStepProps) {
  // State for new custom field
  const [customLabel, setCustomLabel] = useState("");
  const [addError, setAddError] = useState("");

  const handleAddCustomField = () => {
    const newLabel = customLabel.trim();
    if (!newLabel) {
      setAddError("Custom field label cannot be empty.");
      return;
    }
    if (
      participantFields.some(
        field => field.label.toLowerCase() === newLabel.toLowerCase()
      )
    ) {
      setAddError("A field with this label already exists.");
      return;
    }
    const newField: ParticipantField = {
      id: uuidv4(),
      label: newLabel,
      required: false,
      enabled: true,
      custom: true,
    };
    onUpdateField(newField.id, "addCustom", newField);
    setCustomLabel("");
    setAddError("");
  };

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

      {/* Add custom field UI */}
      <div className="flex gap-2 mb-2">
        <Input
          type="text"
          placeholder="Add a custom field (e.g., Student ID)"
          value={customLabel}
          onChange={e => setCustomLabel(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") handleAddCustomField();
          }}
          className="w-2/3"
        />
        <Button variant="outline" type="button" onClick={handleAddCustomField}>
          Add Field
        </Button>
      </div>
      {addError && (
        <div className="text-sm text-red-500 mb-2">{addError}</div>
      )}

      <div className="space-y-3">
        {participantFields.map((field) => (
          <div key={field.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Checkbox
                id={`field-${field.id}`}
                checked={field.enabled}
                onCheckedChange={(checked) => 
                  onUpdateField(field.id, "enabled", checked as boolean)
                }
                disabled={field.id === 'name' || field.id === 'email'}
              />
              <Label htmlFor={`field-${field.id}`} className="font-medium">
                {field.label}
                {field.custom && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-700">Custom</span>
                )}
              </Label>
            </div>
            {field.enabled && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`required-${field.id}`}
                  checked={field.required}
                  onCheckedChange={(checked) => 
                    onUpdateField(field.id, "required", checked as boolean)
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

