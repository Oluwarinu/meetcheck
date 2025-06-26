import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import RenderedTemplateForm from '@/components/templates/RenderedTemplateForm';
import { Template } from '@/types/templates'; // Using the full Template type

// Mock function to simulate fetching a template by ID
const fetchMockAssignmentTemplate = async (templateId: string): Promise<Template | null> => {
  console.log(`Fetching mock template for ID: ${templateId}`);
  // In a real app, this would be an API call:
  // const response = await apiClient.getTemplate(templateId);
  // return response.data;

  // For now, return a hardcoded assignment template
  // This structure should align with what can be created via ManageTemplatesPage
  const assignmentTemplate: Template = {
    id: templateId || 'assignment-default-123',
    name: 'Module 1: Critical Thinking Essay',
    description: 'Please submit your essay for Module 1. Ensure all guidelines are followed.',
    category: 'academic',
    version: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    fields: [
      {
        id: 'student_name',
        label: 'Full Name',
        type: 'text',
        required: true,
        placeholder: 'Enter your full name',
        defaultValue: '', // Could be pre-filled if user is logged in
        helperText: 'Please use the name you are registered with.',
      },
      {
        id: 'student_id',
        label: 'Student ID',
        type: 'text', // Or 'number' if IDs are strictly numeric
        required: true,
        placeholder: 'e.g., S1234567',
        defaultValue: '',
      },
      {
        id: 'essay_submission',
        label: 'Upload Your Essay',
        type: 'file',
        required: true,
        helperText: 'Submit your essay in .pdf or .docx format. Max 10MB.',
        validation: [
          { type: 'fileParams', acceptedTypes: ['.pdf', '.docx'], maxSizeMB: 10 }
        ]
      },
      {
        id: 'submission_date',
        label: 'Submission Date',
        type: 'date',
        required: true,
        defaultValue: new Date().toISOString().split('T')[0], // Default to today
        isEditable: false, // Example: Date is auto-set
        helperText: 'This date is recorded automatically.'
      },
      {
        id: 'comments',
        label: 'Additional Comments (Optional)',
        type: 'textarea',
        required: false,
        placeholder: 'Any additional comments or notes for your instructor...',
        helperText: 'Max 500 characters.',
        validation: [{ type: 'maxLength', value: 500 }]
      }
    ],
    features: [ // Example features
      { type: 'file_upload', enabled: true, config: { submissionFieldId: 'essay_submission' } },
      { type: 'grade_tracking', enabled: true, config: {} }
    ],
  };
  return new Promise(resolve => setTimeout(() => resolve(assignmentTemplate), 500)); // Simulate network delay
};


export default function SubmitAssignmentPage() {
  const { templateId = "default-assignment" } = useParams<{ templateId?: string }>(); // Get templateId from URL or use default
  const [template, setTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    fetchMockAssignmentTemplate(templateId)
      .then(data => {
        setTemplate(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Failed to load template:", error);
        setSubmissionStatus(`Error: Failed to load assignment details. ${error.message}`);
        setIsLoading(false);
      });
  }, [templateId]);

  const handleFormSubmit = async (formData: Record<string, any>) => {
    console.log('Assignment Submission Data:', formData);
    setIsSubmitting(true);
    setSubmissionStatus(null);

    // Simulate API call for submission
    try {
      // In a real app, you'd likely use FormData if there's a file:
      // const dataToSubmit = new FormData();
      // Object.keys(formData).forEach(key => {
      //   if (formData[key] instanceof File) {
      //     dataToSubmit.append(key, formData[key], (formData[key] as File).name);
      //   } else {
      //     dataToSubmit.append(key, formData[key]);
      //   }
      // });
      // await apiClient.submitAssignment(templateId, dataToSubmit);

      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      setSubmissionStatus('Assignment submitted successfully!');
      // Potentially redirect or clear form
    } catch (error: any) {
      console.error('Submission failed:', error);
      setSubmissionStatus(`Submission failed: ${error.message || 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-lg font-medium text-gray-700">Loading Assignment Details...</p>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <p className="text-xl font-semibold text-red-600">Assignment Not Found</p>
        <p className="text-gray-600">The assignment details could not be loaded. Please check the URL or contact support.</p>
      </div>
    );
  }

  if (submissionStatus && submissionStatus.includes('success')) {
    return (
        <div className="container mx-auto px-4 py-10 text-center">
            <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Submission Successful!</h1>
            <p className="text-gray-600">{submissionStatus}</p>
            {/* Add a button to navigate away, e.g., back to dashboard */}
        </div>
    );
  }


  return (
    <div className="container mx-auto px-4 py-10">
      <RenderedTemplateForm
        template={template}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />
      {submissionStatus && !submissionStatus.includes('success') && (
        <div className="mt-6 max-w-2xl mx-auto p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-center">
          <p>{submissionStatus}</p>
        </div>
      )}
    </div>
  );
}

// Add CheckCircle icon if not already imported/available globally
const CheckCircle = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
