import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import TemplateForm from '@/components/templates/TemplateForm'; // Import TemplateForm
import { Template } from '@/types/templates'; // Import Template type

export default function ManageTemplatesPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

  // Dummy list of templates - replace with API call later
  const [templates, setTemplates] = useState<Template[]>([]);

  const handleCreateNew = () => {
    setEditingTemplate(null); // Ensure no existing template is being edited
    setShowCreateForm(true);
  };

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template);
    setShowCreateForm(true);
  };

  const handleSubmitTemplate = (templateData: Template) => {
    console.log('Submitting template:', templateData);
    if (editingTemplate) {
      // Update existing template
      setTemplates(prev => prev.map(t => t.id === templateData.id ? templateData : t));
    } else {
      // Add new template
      setTemplates(prev => [...prev, templateData]);
    }
    setShowCreateForm(false);
    setEditingTemplate(null);
    // Here you would typically make an API call
    alert(`Template "${templateData.name}" ${editingTemplate ? 'updated' : 'created'} (mocked).`);
  };

  const handleCancelForm = () => {
    setShowCreateForm(false);
    setEditingTemplate(null);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Templates</h1>
          <p className="text-gray-600 mt-1">
            Create, view, and edit your event templates.
          </p>
        </div>
        {!showCreateForm && (
          <Button
            onClick={handleCreateNew}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Template
          </Button>
        )}
      </div>

      {showCreateForm ? (
        <TemplateForm
          template={editingTemplate}
          onSubmit={handleSubmitTemplate}
          onCancel={handleCancelForm}
        />
      ) : (
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Existing Templates</h2>
          {templates.length === 0 ? (
            <p className="text-gray-600">No templates created yet. Click "Create New Template" to start.</p>
          ) : (
            <ul className="space-y-3">
              {templates.map(t => (
                <li key={t.id} className="p-4 border rounded-md flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{t.name}</h3>
                    <p className="text-sm text-gray-500">{t.description || 'No description'}</p>
                    <p className="text-xs text-gray-400">Category: {t.category}, Fields: {t.fields.length}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleEditTemplate(t)}>Edit</Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
