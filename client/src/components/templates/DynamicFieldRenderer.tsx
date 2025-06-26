import React from 'react';
import { TemplateField } from '@/types/templates';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox'; // Assuming we might want a boolean field type later
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import FileUploadInput from '@/components/ui/FileUploadInput'; // Import the new component

interface DynamicFieldRendererProps {
  field: TemplateField;
  value: any;
  onChange: (fieldId: string, value: any) => void;
  // We might need to pass 'error' state for each field later for form validation display
  // error?: string | null;
}

export default function DynamicFieldRenderer({ field, value, onChange }: DynamicFieldRendererProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(field.id, e.target.value);
  };

  const handleSelectChange = (selectValue: string | number) => {
    onChange(field.id, selectValue);
  };

  const handleFileChange = (file: File | null) => {
    onChange(field.id, file);
  };

  const handleCheckboxChange = (checked: boolean) => {
    onChange(field.id, checked);
  };

  const renderInput = () => {
    switch (field.type) {
      case 'text':
        return (
          <Input
            type="text"
            id={field.id}
            value={value || ''}
            onChange={handleInputChange}
            placeholder={field.placeholder}
            defaultValue={field.defaultValue}
            required={field.required}
            disabled={field.isEditable === false}
          />
        );
      case 'textarea':
        return (
          <Textarea
            id={field.id}
            value={value || ''}
            onChange={handleInputChange}
            placeholder={field.placeholder}
            defaultValue={field.defaultValue}
            required={field.required}
            disabled={field.isEditable === false}
            rows={4} // Default rows, could be configurable
          />
        );
      case 'number':
      case 'grade': // Treat 'grade' as a number input for rendering
        const min = field.validation?.find(v => v.type === 'range')?.min;
        const max = field.validation?.find(v => v.type === 'range')?.max;
        return (
          <Input
            type="number"
            id={field.id}
            value={value || ''}
            onChange={handleInputChange}
            placeholder={field.placeholder}
            defaultValue={field.defaultValue}
            required={field.required}
            disabled={field.isEditable === false}
            min={min}
            max={max}
            step={field.type === 'grade' ? '0.1' : 'any'} // Allow decimals for grade
          />
        );
      case 'date':
        return (
          <Input
            type="date"
            id={field.id}
            value={value || ''} // Date input expects YYYY-MM-DD format
            onChange={handleInputChange}
            defaultValue={field.defaultValue}
            required={field.required}
            disabled={field.isEditable === false}
          />
        );
      case 'select':
        return (
          <Select
            value={value?.toString() || field.defaultValue?.toString() || undefined}
            onValueChange={handleSelectChange}
            required={field.required}
            disabled={field.isEditable === false}
          >
            <SelectTrigger id={field.id}>
              <SelectValue placeholder={field.placeholder || "Select an option"} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map(option => (
                <SelectItem key={option.value.toString()} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'file':
        const fileParams = field.validation?.find(v => v.type === 'fileParams');
        return (
          <FileUploadInput
            id={field.id}
            onChange={handleFileChange}
            acceptedFileTypes={fileParams?.acceptedTypes}
            maxFileSizeMB={fileParams?.maxSizeMB}
            // initialFile={value instanceof File ? value : null} // If form can be pre-filled with a File object
          />
        );
      // Example for a boolean type if added later
      // case 'boolean':
      //   return (
      //     <div className="flex items-center space-x-2">
      //       <Checkbox
      //         id={field.id}
      //         checked={!!value}
      //         onCheckedChange={handleCheckboxChange}
      //         disabled={field.isEditable === false}
      //       />
      //       <Label htmlFor={field.id} className="text-sm font-normal">
      //         {field.placeholder || 'Enable this option'}
      //       </Label>
      //     </div>
      //   );
      default:
        return <p className="text-red-500 text-sm">Unsupported field type: {field.type}</p>;
    }
  };

  return (
    <div className="mb-4 w-full">
      <Label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {renderInput()}
      {field.helperText && (
        <p className="mt-1 text-xs text-gray-500">{field.helperText}</p>
      )}
      {/* {error && <p className="mt-1 text-xs text-destructive">{error}</p>} */}
    </div>
  );
}
