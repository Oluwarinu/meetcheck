import React, { useState, useEffect } from 'react';
import { Template, TemplateField, TemplateFeature } from '@/types/templates';
import TemplateFieldsList from './TemplateFieldsList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TemplateFormProps {
  template?: Template | null; // Template to edit, or null/undefined for a new template
  onSubmit: (template: Template) => void;
  onCancel: () => void;
}

const availableCategories: Template['category'][] = ['academic', 'corporate', 'networking', 'other'];

export default function TemplateForm({ template, onSubmit, onCancel }: TemplateFormProps) {
  const isEditing = !!template;

  const initialFormState: Template = {
    id: template?.id || `template_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: template?.name || '',
    description: template?.description || '',
    category: template?.category || 'other',
    fields: template?.fields || [],
    features: template?.features || [], // Placeholder for features
    version: template?.version || 1,
    createdAt: template?.createdAt || new Date(),
    updatedAt: new Date(),
    // createdBy: template?.createdBy || currentUser?.id, // Assuming currentUser is available
  };

  const [formData, setFormData] = useState<Template>(initialFormState);

  useEffect(() => {
    // If the template prop changes, reset the form
    setFormData(initialFormState);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: Template['category']) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleFieldsChange = (updatedFields: TemplateField[]) => {
    setFormData(prev => ({ ...prev, fields: updatedFields }));
  };

  // Placeholder for features change handler
  const handleFeaturesChange = (updatedFeatures: TemplateFeature[]) => {
    setFormData(prev => ({ ...prev, features: updatedFeatures }));
    // This will need a dedicated UI similar to TemplateFieldsList
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Template name is required.");
      return;
    }
    if (formData.fields.length === 0) {
      alert("A template must have at least one field.");
      return;
    }
    onSubmit({ ...formData, updatedAt: new Date() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Template' : 'Create New Template'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Template Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Standard Lecture, Networking Event Check-in"
              required
              className="mt-1 block w-full"
            />
          </div>

          <div>
            <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="A brief description of what this template is for."
              className="mt-1 block w-full"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</Label>
            <Select name="category" value={formData.category} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {availableCategories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Template Fields Management */}
      <TemplateFieldsList fields={formData.fields} onChange={handleFieldsChange} />

      {/* Placeholder for Template Features Management */}
      <Card>
        <CardHeader>
          <CardTitle>Template Features (Coming Soon)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">
            Configuration for features like file uploads, grade tracking, etc., will be managed here.
          </p>
          {/* Example: <TemplateFeaturesList features={formData.features} onChange={handleFeaturesChange} /> */}
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-3 pt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          {isEditing ? 'Save Template Changes' : 'Create Template'}
        </Button>
      </div>
    </form>
  );
}
