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

  // Helper to manage specific validation rules from dedicated inputs
  const updateSpecificValidation = (ruleType: string, value: any, isActive: boolean) => {
    let currentRules = formData.validation ? [...formData.validation] : [];
    // Remove existing rule of this type
    currentRules = currentRules.filter(rule => rule.type !== ruleType);
    // Add new rule if active and value is meaningful
    if (isActive && value !== undefined && value !== '') {
      const newRule: ValidationRule = { type: ruleType };
      if (ruleType === 'range' || ruleType === 'fileParams') {
         // For range, value is an object like { min, max }
         // For fileParams, value is an object like { maxSizeMB, acceptedTypes }
        Object.assign(newRule, value);
      } else {
        newRule.value = value;
      }
      currentRules.push(newRule);
    }
    setFormData(prev => ({ ...prev, validation: currentRules }));
  };

  // Separate states for specific validation inputs to avoid complex JSON parsing by user for these common cases
  const [gradeMin, setGradeMin] = useState<string>(formData.validation?.find(r => r.type === 'range')?.min?.toString() || '');
  const [gradeMax, setGradeMax] = useState<string>(formData.validation?.find(r => r.type === 'range')?.max?.toString() || '');
  const [acceptedFileTypes, setAcceptedFileTypes] = useState<string>(formData.validation?.find(r => r.type === 'fileParams')?.acceptedTypes?.join(', ') || '');
  const [maxFileSizeMB, setMaxFileSizeMB] = useState<string>(formData.validation?.find(r => r.type === 'fileParams')?.maxSizeMB?.toString() || '');


  useEffect(() => {
    // Update specific validation rules when formData.validation changes (e.g. field prop change)
    // This is to keep dedicated input fields in sync if validation rules are loaded/reset
    const rangeRule = formData.validation?.find(r => r.type === 'range');
    setGradeMin(rangeRule?.min?.toString() || '');
    setGradeMax(rangeRule?.max?.toString() || '');

    const fileParamsRule = formData.validation?.find(r => r.type === 'fileParams');
    setAcceptedFileTypes(fileParamsRule?.acceptedTypes?.join(', ') || '');
    setMaxFileSizeMB(fileParamsRule?.maxSizeMB?.toString() || '');

    // Update the generic JSON editor for other rules
    const otherRules = formData.validation?.filter(r => r.type !== 'range' && r.type !== 'fileParams') || [];
    setValidationRulesString(JSON.stringify(otherRules, null, 2));

  }, [formData.validation]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let otherParsedRules: ValidationRule[] = [];
    try {
      otherParsedRules = validationRulesString.trim() ? JSON.parse(validationRulesString) : [];
      if (!Array.isArray(otherParsedRules)) {
        throw new Error("Validation rules (JSON) must be an array.");
      }
    } catch (error) {
      alert(`Error parsing general validation rules: ${error instanceof Error ? error.message : String(error)}\nPlease ensure it's valid JSON.`);
      return;
    }

    let finalValidationRules = [...otherParsedRules];

    // Add/Update grade range rule
    if (formData.type === 'grade' && (gradeMin.trim() !== '' || gradeMax.trim() !== '')) {
      finalValidationRules = finalValidationRules.filter(r => r.type !== 'range'); // remove old one if any
      const rangeRule: ValidationRule = { type: 'range' };
      if (gradeMin.trim() !== '') rangeRule.min = parseFloat(gradeMin);
      if (gradeMax.trim() !== '') rangeRule.max = parseFloat(gradeMax);
      if (Object.keys(rangeRule).length > 1) finalValidationRules.push(rangeRule);
    }

    // Add/Update file params rule
    if (formData.type === 'file' && (acceptedFileTypes.trim() !== '' || maxFileSizeMB.trim() !== '')) {
      finalValidationRules = finalValidationRules.filter(r => r.type !== 'fileParams'); // remove old one
      const fileRule: ValidationRule = { type: 'fileParams' };
      if (acceptedFileTypes.trim() !== '') fileRule.acceptedTypes = acceptedFileTypes.split(',').map(s => s.trim()).filter(s => s);
      if (maxFileSizeMB.trim() !== '') fileRule.maxSizeMB = parseFloat(maxFileSizeMB);
      if (Object.keys(fileRule).length > 1) finalValidationRules.push(fileRule);
    }

    onSave({ ...formData, validation: finalValidationRules });
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

      {/* Conditional inputs for 'grade' type */}
      {formData.type === 'grade' && (
        <div className="space-y-3 p-4 border rounded-md bg-slate-50">
          <Label className="block text-sm font-medium text-gray-700">Grade Specific Options</Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="gradeMin" className="block text-xs font-medium text-gray-600 mb-1">Minimum Grade</Label>
              <Input
                id="gradeMin"
                name="gradeMin"
                type="number"
                value={gradeMin}
                onChange={(e) => setGradeMin(e.target.value)}
                placeholder="e.g., 0"
              />
            </div>
            <div>
              <Label htmlFor="gradeMax" className="block text-xs font-medium text-gray-600 mb-1">Maximum Grade</Label>
              <Input
                id="gradeMax"
                name="gradeMax"
                type="number"
                value={gradeMax}
                onChange={(e) => setGradeMax(e.target.value)}
                placeholder="e.g., 100"
              />
            </div>
          </div>
        </div>
      )}

      {/* Conditional inputs for 'file' type */}
      {formData.type === 'file' && (
        <div className="space-y-3 p-4 border rounded-md bg-slate-50">
          <Label className="block text-sm font-medium text-gray-700">File Upload Options</Label>
          <div>
            <Label htmlFor="acceptedFileTypes" className="block text-xs font-medium text-gray-600 mb-1">
              Accepted File Types (comma-separated)
            </Label>
            <Input
              id="acceptedFileTypes"
              name="acceptedFileTypes"
              value={acceptedFileTypes}
              onChange={(e) => setAcceptedFileTypes(e.target.value)}
              placeholder="e.g., .pdf, .docx, image/png"
            />
          </div>
          <div>
            <Label htmlFor="maxFileSizeMB" className="block text-xs font-medium text-gray-600 mb-1">
              Max File Size (MB)
            </Label>
            <Input
              id="maxFileSizeMB"
              name="maxFileSizeMB"
              type="number"
              value={maxFileSizeMB}
              onChange={(e) => setMaxFileSizeMB(e.target.value)}
              placeholder="e.g., 10"
            />
          </div>
        </div>
      )}

      {formData.type === 'select' && (
        <div className="space-y-3 p-4 border rounded-md bg-slate-50">
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
