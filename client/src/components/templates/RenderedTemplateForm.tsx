import React, { useState, useEffect } from 'react';
import { Template, TemplateField } from '@/types/templates';
import DynamicFieldRenderer from './DynamicFieldRenderer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface RenderedTemplateFormProps {
  template: Template;
  onSubmit: (formData: Record<string, any>) => void;
  isSubmitting?: boolean; // To disable button during submission
  initialData?: Record<string, any>; // For pre-filling form (e.g. draft)
}

export default function RenderedTemplateForm({
  template,
  onSubmit,
  isSubmitting = false,
  initialData = {}
}: RenderedTemplateFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Initialize form data with defaultValues from template fields or initialData
  useEffect(() => {
    const initialFormValues: Record<string, any> = {};
    template.fields.forEach(field => {
      if (initialData.hasOwnProperty(field.id)) {
        initialFormValues[field.id] = initialData[field.id];
      } else if (field.defaultValue !== undefined) {
        initialFormValues[field.id] = field.defaultValue;
      } else {
        // Set a sensible default for uncontrolled components if no defaultValue
        // For example, empty string for text, null for file, etc.
        initialFormValues[field.id] = field.type === 'file' ? null : '';
      }
    });
    setFormData(initialFormValues);
  }, [template, initialData]);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prevData => ({
      ...prevData,
      [fieldId]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic client-side validation: check for required fields
    for (const field of template.fields) {
      if (field.required) {
        const value = formData[field.id];
        if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
          // More sophisticated error handling/display can be added here
          alert(`Field "${field.label}" is required.`);
          // Focus on the field or highlight it
          const fieldElement = document.getElementById(field.id);
          fieldElement?.focus();
          return;
        }
      }
    }
    onSubmit(formData);
  };

  if (!template) {
    return <p>Loading template...</p>; // Or some other loading state
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{template.name}</CardTitle>
        {template.description && (
          <CardDescription>{template.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {template.fields
            .filter(field => field.isHidden !== true) // Filter out hidden fields
            .map(field => (
              <DynamicFieldRenderer
                key={field.id}
                field={field}
                value={formData[field.id]}
                onChange={handleFieldChange}
                // Pass error state for this field if implementing more advanced validation display
                // error={formErrors[field.id]}
              />
          ))}
          <div className="pt-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
