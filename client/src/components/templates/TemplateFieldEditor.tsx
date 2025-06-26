import React, { useState, useEffect } from 'react';
import { TemplateField, TemplateFieldType, ValidationRule } from '@/types/templates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea'; // For helperText or multi-line validation values
import { X, Plus } from 'lucide-react';

interface TemplateFieldEditorProps {
  field?: TemplateField | null; // Field to edit, or null/undefined for a new field
  onSave: (field: TemplateField) => void;
  onCancel: () => void;
}

const availableFieldTypes: TemplateFieldType[] = ['text', 'textarea', 'number', 'file', 'date', 'grade', 'select'];

export default function TemplateFieldEditor({ field, onSave, onCancel }: TemplateFieldEditorProps) {
  const isEditing = !!field;
  const initialFieldState: TemplateField = {
    id: field?.id || `field_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`, // Temporary ID generation
    label: field?.label || '',
    type: field?.type || 'text',
    required: field?.required || false,
    placeholder: field?.placeholder || '',
    defaultValue: field?.defaultValue || '',
    helperText: field?.helperText || '',
    validation: field?.validation || [],
    options: field?.options || [],
  };

  const [formData, setFormData] = useState<TemplateField>(initialFieldState);
  const [validationRulesString, setValidationRulesString] = useState(
    JSON.stringify(initialFieldState.validation || [], null, 2)
  );

  useEffect(() => {
    // If the field prop changes (e.g., selecting a different field to edit), reset the form
    setFormData(initialFieldState);
    setValidationRulesString(JSON.stringify(initialFieldState.validation || [], null, 2));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleTypeChange = (value: TemplateFieldType) => {
    setFormData(prev => ({
      ...prev,
      type: value,
      // Reset options if type is no longer 'select'
      options: value === 'select' ? prev.options : []
    }));
  };

  const handleOptionChange = (index: number, optionPart: 'label' | 'value', optionValue: string) => {
    const newOptions = [...(formData.options || [])];
    newOptions[index] = { ...newOptions[index], [optionPart]: optionValue };
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const addOption = () => {
    const newOptions = [...(formData.options || []), { label: '', value: '' }];
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const removeOption = (index: number) => {
    const newOptions = (formData.options || []).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const handleValidationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValidationRulesString(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let parsedValidationRules: ValidationRule[];
    try {
      parsedValidationRules = validationRulesString.trim() ? JSON.parse(validationRulesString) : [];
      if (!Array.isArray(parsedValidationRules)) {
        throw new Error("Validation rules must be a JSON array.");
      }
      // Basic validation for each rule object can be added here if needed
    } catch (error) {
      alert(`Error parsing validation rules: ${error instanceof Error ? error.message : String(error)}\nPlease ensure it's a valid JSON array.`);
      return;
    }

    onSave({ ...formData, validation: parsedValidationRules });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 border rounded-lg shadow-md bg-white">
      <h2 className="text-xl font-semibold text-gray-800">{isEditing ? 'Edit Field' : 'Add New Field'}</h2>

      <div>
        <Label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-1">Field Label</Label>
        <Input
          id="label"
          name="label"
          value={formData.label}
          onChange={handleChange}
          placeholder="e.g., Student Name, Assignment Title"
          required
          className="mt-1 block w-full"
        />
      </div>

      <div>
        <Label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Field Type</Label>
        <Select name="type" value={formData.type} onValueChange={handleTypeChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select field type" />
          </SelectTrigger>
          <SelectContent>
            {availableFieldTypes.map(type => (
              <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {formData.type === 'select' && (
        <div className="space-y-3 p-4 border rounded-md">
          <Label className="block text-sm font-medium text-gray-700">Options for Select</Label>
          {(formData.options || []).map((opt, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={opt.label}
                onChange={(e) => handleOptionChange(index, 'label', e.target.value)}
                placeholder="Option Label"
                className="flex-1"
              />
              <Input
                value={opt.value.toString()} // Ensure value is string for input
                onChange={(e) => handleOptionChange(index, 'value', e.target.value)}
                placeholder="Option Value"
                className="flex-1"
              />
              <Button type="button" variant="ghost" size="icon" onClick={() => removeOption(index)} aria-label="Remove option">
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addOption} className="mt-2">
            <Plus className="h-4 w-4 mr-2" /> Add Option
          </Button>
        </div>
      )}

      <div>
        <Label htmlFor="placeholder" className="block text-sm font-medium text-gray-700 mb-1">Placeholder</Label>
        <Input
          id="placeholder"
          name="placeholder"
          value={formData.placeholder}
          onChange={handleChange}
          placeholder="e.g., Enter your full name"
          className="mt-1 block w-full"
        />
      </div>

      <div>
        <Label htmlFor="defaultValue" className="block text-sm font-medium text-gray-700 mb-1">Default Value</Label>
        <Input
          id="defaultValue"
          name="defaultValue"
          value={formData.defaultValue}
          onChange={handleChange}
          placeholder="e.g., John Doe"
          className="mt-1 block w-full"
        />
      </div>

      <div>
        <Label htmlFor="helperText" className="block text-sm font-medium text-gray-700 mb-1">Helper Text</Label>
        <Textarea
          id="helperText"
          name="helperText"
          value={formData.helperText}
          onChange={handleChange}
          placeholder="e.g., This text will appear below the input field."
          className="mt-1 block w-full"
          rows={2}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="required"
          name="required"
          checked={formData.required}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, required: !!checked }))}
        />
        <Label htmlFor="required" className="text-sm font-medium text-gray-700">Required Field</Label>
      </div>

      <div>
        <Label htmlFor="validation" className="block text-sm font-medium text-gray-700 mb-1">
          Validation Rules (JSON format)
        </Label>
        <Textarea
          id="validation"
          name="validation"
          value={validationRulesString}
          onChange={handleValidationChange}
          placeholder='e.g., [{"type": "minLength", "value": 5, "message": "Too short"}]'
          className="mt-1 block w-full font-mono text-sm"
          rows={4}
        />
        <p className="mt-1 text-xs text-gray-500">
          Enter a valid JSON array of validation rule objects. Each object should have a 'type' and optionally 'value' and 'message'.
        </p>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          {isEditing ? 'Save Changes' : 'Add Field'}
        </Button>
      </div>
    </form>
  );
}
