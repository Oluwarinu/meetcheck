import React, { useState } from 'react';
import { TemplateField } from '@/types/templates';
import TemplateFieldEditor from './TemplateFieldEditor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit2, Trash2, GripVertical } from 'lucide-react';
// For drag and drop (optional, can be enhanced later)
// import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
// import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';

interface TemplateFieldsListProps {
  fields: TemplateField[];
  onChange: (fields: TemplateField[]) => void;
}

// // SortableItem component for drag and drop (if implemented)
// function SortableFieldItem({ id, field, onEdit, onDelete }: { id: string; field: TemplateField; onEdit: () => void; onDelete: () => void; }) {
//   const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     touchAction: 'none', // Recommended for pointer sensor
//   };

//   return (
//     <div ref={setNodeRef} style={style} {...attributes} className="flex items-center justify-between p-3 bg-gray-50 border rounded-md mb-2">
//       <div className="flex items-center">
//         <button {...listeners} className="cursor-grab mr-2 p-1" aria-label="Drag to reorder">
//           <GripVertical className="h-5 w-5 text-gray-400" />
//         </button>
//         <div>
//           <span className="font-medium text-gray-800">{field.label}</span>
//           <span className="text-sm text-gray-500 ml-2">({field.type})</span>
//         </div>
//       </div>
//       <div className="space-x-2">
//         <Button variant="outline" size="sm" onClick={onEdit} aria-label={`Edit ${field.label}`}>
//           <Edit2 className="h-4 w-4 mr-1" /> Edit
//         </Button>
//         <Button variant="destructive" size="sm" onClick={onDelete} aria-label={`Delete ${field.label}`}>
//           <Trash2 className="h-4 w-4 mr-1" /> Delete
//         </Button>
//       </div>
//     </div>
//   );
// }


export default function TemplateFieldsList({ fields, onChange }: TemplateFieldsListProps) {
  const [editingField, setEditingField] = useState<TemplateField | null | undefined>(null); // undefined for new, null for no edit, TemplateField for edit
  const [editingFieldIndex, setEditingFieldIndex] = useState<number | null>(null);

  // // DnD Sensors (if implemented)
  // const sensors = useSensors(
  //   useSensor(PointerSensor),
  //   useSensor(KeyboardSensor, {
  //     coordinateGetter: sortableKeyboardCoordinates,
  //   })
  // );

  const handleAddField = () => {
    setEditingField(undefined); // undefined indicates a new field
    setEditingFieldIndex(null);
  };

  const handleEditField = (field: TemplateField, index: number) => {
    setEditingField(field);
    setEditingFieldIndex(index);
  };

  const handleDeleteField = (index: number) => {
    if (window.confirm('Are you sure you want to delete this field?')) {
      const newFields = fields.filter((_, i) => i !== index);
      onChange(newFields);
    }
  };

  const handleSaveField = (fieldToSave: TemplateField) => {
    let newFields;
    if (editingFieldIndex !== null && editingField) { // Editing existing
      newFields = fields.map((f, i) => (i === editingFieldIndex ? fieldToSave : f));
    } else { // Adding new
      newFields = [...fields, fieldToSave];
    }
    onChange(newFields);
    setEditingField(null);
    setEditingFieldIndex(null);
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditingFieldIndex(null);
  };

  // // DnD Handler (if implemented)
  // const handleDragEnd = (event: any) => {
  //   const { active, over } = event;
  //   if (active.id !== over.id) {
  //     const oldIndex = fields.findIndex(f => f.id === active.id);
  //     const newIndex = fields.findIndex(f => f.id === over.id);
  //     onChange(arrayMove(fields, oldIndex, newIndex));
  //   }
  // };

  if (editingField !== null) { // If editingField is an object (editing) or undefined (new)
    return (
      <TemplateFieldEditor
        field={editingField} // Pass undefined for new, or the field object for editing
        onSave={handleSaveField}
        onCancel={handleCancelEdit}
      />
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Template Fields</CardTitle>
        <Button onClick={handleAddField} size="sm">
          <Plus className="h-4 w-4 mr-2" /> Add Field
        </Button>
      </CardHeader>
      <CardContent>
        {fields.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No fields added yet. Click "Add Field" to get started.</p>
        ) : (
          <div className="space-y-3">
            {/* <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                {fields.map((field, index) => (
                  <SortableFieldItem
                    key={field.id}
                    id={field.id}
                    field={field}
                    onEdit={() => handleEditField(field, index)}
                    onDelete={() => handleDeleteField(index)}
                  />
                ))}
              </SortableContext>
            </DndContext> */}
            {/* Non-DnD version */}
            {fields.map((field, index) => (
              <div key={field.id || index} className="flex items-center justify-between p-3 bg-gray-50 border rounded-md">
                <div className="flex items-center">
                  {/* Placeholder for drag handle if not using DnD library for now */}
                  <GripVertical className="h-5 w-5 text-gray-400 mr-2 cursor-grab" />
                  <div>
                    <span className="font-medium text-gray-800">{field.label}</span>
                    <span className="text-sm text-gray-500 ml-2">({field.type})</span>
                    {field.required && <span className="text-xs text-red-500 ml-2">*Required</span>}
                  </div>
                </div>
                <div className="space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditField(field, index)} aria-label={`Edit ${field.label}`}>
                    <Edit2 className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteField(index)} aria-label={`Delete ${field.label}`}>
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
