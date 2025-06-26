// Dynamic Template System Type Definitions

export interface TemplateField {
  id: string;
  type: 'text' | 'email' | 'file' | 'date' | 'grade' | 'select' | 'number' | 'tel' | 'url';
  label: string;
  required: boolean;
  placeholder?: string;
  validation?: ValidationRule;
  options?: string[]; // For select fields
  fileTypes?: string[]; // For file fields (e.g., ['.pdf', '.doc', '.docx'])
  maxFileSize?: number; // In bytes
}

export interface ValidationRule {
  min?: number;
  max?: number;
  pattern?: string;
  message?: string;
}

export interface TemplateFeature {
  type: 'file_upload' | 'grade_tracking' | 'attendance' | 'submissions' | 'location_verification' | 'qr_checkin';
  enabled: boolean;
  config: Record<string, any>;
}

export interface DynamicTemplate {
  id: string;
  name: string;
  description?: string;
  category: 'academic' | 'corporate' | 'networking';
  template_type: 'lecture' | 'assignment' | 'meeting' | 'conference' | 'workshop' | 'exam';
  dynamic_fields: TemplateField[];
  features: TemplateFeature[];
  max_attendees: number;
  duration_hours: number;
  is_system_template: boolean;
  created_by?: string;
  created_at: string;
  updated_at?: string;
}

// Pre-defined system templates with dynamic configuration
export const SYSTEM_TEMPLATES: DynamicTemplate[] = [
  {
    id: 'academic-lecture',
    name: 'Academic Lecture',
    description: 'Perfect for university lectures, seminars, and academic presentations',
    category: 'academic',
    template_type: 'lecture',
    max_attendees: 150,
    duration_hours: 2,
    is_system_template: true,
    created_at: new Date().toISOString(),
    dynamic_fields: [
      {
        id: 'name',
        type: 'text',
        label: 'Full Name',
        required: true,
        placeholder: 'Enter your full name'
      },
      {
        id: 'email',
        type: 'email',
        label: 'Email Address',
        required: true,
        placeholder: 'student@university.edu'
      },
      {
        id: 'student_id',
        type: 'text',
        label: 'Student ID',
        required: true,
        placeholder: 'Enter your student ID',
        validation: {
          pattern: '^[A-Z0-9]{6,12}$',
          message: 'Student ID must be 6-12 alphanumeric characters'
        }
      },
      {
        id: 'department',
        type: 'select',
        label: 'Department',
        required: true,
        options: ['Computer Science', 'Engineering', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Other']
      },
      {
        id: 'academic_year',
        type: 'select',
        label: 'Academic Year',
        required: true,
        options: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate', 'PhD']
      }
    ],
    features: [
      {
        type: 'attendance',
        enabled: true,
        config: { auto_checkin: false, location_required: true }
      },
      {
        type: 'qr_checkin',
        enabled: true,
        config: { expire_minutes: 30 }
      }
    ]
  },
  {
    id: 'assignment-submission',
    name: 'Assignment Submission',
    description: 'Complete assignment submission system with file uploads and grade tracking',
    category: 'academic',
    template_type: 'assignment',
    max_attendees: 100,
    duration_hours: 168, // 1 week duration
    is_system_template: true,
    created_at: new Date().toISOString(),
    dynamic_fields: [
      {
        id: 'name',
        type: 'text',
        label: 'Full Name',
        required: true,
        placeholder: 'Enter your full name'
      },
      {
        id: 'email',
        type: 'email',
        label: 'Email Address',
        required: true,
        placeholder: 'student@university.edu'
      },
      {
        id: 'student_id',
        type: 'text',
        label: 'Student ID',
        required: true,
        placeholder: 'Enter your student ID'
      },
      {
        id: 'assignment_file',
        type: 'file',
        label: 'Assignment File',
        required: true,
        fileTypes: ['.pdf', '.doc', '.docx', '.txt', '.zip'],
        maxFileSize: 10485760, // 10MB
        placeholder: 'Upload your assignment file'
      },
      {
        id: 'due_date',
        type: 'date',
        label: 'Due Date',
        required: true
      },
      {
        id: 'assignment_type',
        type: 'select',
        label: 'Assignment Type',
        required: true,
        options: ['Homework', 'Project', 'Essay', 'Research Paper', 'Lab Report', 'Presentation']
      }
    ],
    features: [
      {
        type: 'file_upload',
        enabled: true,
        config: { 
          max_files: 3,
          allowed_extensions: ['.pdf', '.doc', '.docx', '.txt', '.zip'],
          max_size_mb: 10
        }
      },
      {
        type: 'submissions',
        enabled: true,
        config: { 
          allow_late: true,
          late_penalty_percent: 10,
          resubmission_allowed: true
        }
      },
      {
        type: 'grade_tracking',
        enabled: true,
        config: {
          scale: 100,
          passing_grade: 60,
          grade_categories: ['Excellent', 'Good', 'Satisfactory', 'Needs Improvement', 'Fail']
        }
      }
    ]
  },
  {
    id: 'corporate-meeting',
    name: 'Corporate Meeting',
    description: 'Professional template for business meetings and corporate events',
    category: 'corporate',
    template_type: 'meeting',
    max_attendees: 50,
    duration_hours: 2,
    is_system_template: true,
    created_at: new Date().toISOString(),
    dynamic_fields: [
      {
        id: 'name',
        type: 'text',
        label: 'Full Name',
        required: true,
        placeholder: 'Enter your full name'
      },
      {
        id: 'email',
        type: 'email',
        label: 'Email Address',
        required: true,
        placeholder: 'name@company.com'
      },
      {
        id: 'company',
        type: 'text',
        label: 'Company',
        required: true,
        placeholder: 'Your company name'
      },
      {
        id: 'position',
        type: 'text',
        label: 'Position/Title',
        required: true,
        placeholder: 'Your job title'
      },
      {
        id: 'department',
        type: 'select',
        label: 'Department',
        required: false,
        options: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Other']
      }
    ],
    features: [
      {
        type: 'attendance',
        enabled: true,
        config: { auto_checkin: true, location_required: false }
      },
      {
        type: 'qr_checkin',
        enabled: true,
        config: { expire_minutes: 60 }
      }
    ]
  }
];

// Template field validation helpers
export const validateTemplateField = (field: TemplateField, value: any): { valid: boolean; error?: string } => {
  if (field.required && (!value || value === '')) {
    return { valid: false, error: `${field.label} is required` };
  }

  if (!value) return { valid: true };

  // Type-specific validation
  switch (field.type) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return { valid: false, error: 'Please enter a valid email address' };
      }
      break;

    case 'number':
    case 'grade':
      const num = Number(value);
      if (isNaN(num)) {
        return { valid: false, error: `${field.label} must be a number` };
      }
      if (field.validation?.min !== undefined && num < field.validation.min) {
        return { valid: false, error: `${field.label} must be at least ${field.validation.min}` };
      }
      if (field.validation?.max !== undefined && num > field.validation.max) {
        return { valid: false, error: `${field.label} must be at most ${field.validation.max}` };
      }
      break;

    case 'text':
      if (field.validation?.pattern) {
        const regex = new RegExp(field.validation.pattern);
        if (!regex.test(value)) {
          return { valid: false, error: field.validation.message || `${field.label} format is invalid` };
        }
      }
      break;

    case 'file':
      if (field.fileTypes && field.fileTypes.length > 0) {
        const fileName = value.name || value;
        const extension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
        if (!field.fileTypes.includes(extension)) {
          return { valid: false, error: `File must be one of: ${field.fileTypes.join(', ')}` };
        }
      }
      break;
  }

  return { valid: true };
};

export const getTemplateByType = (templateType: string): DynamicTemplate | undefined => {
  return SYSTEM_TEMPLATES.find(t => t.template_type === templateType);
};

export const getTemplatesByCategory = (category: string): DynamicTemplate[] => {
  return SYSTEM_TEMPLATES.filter(t => t.category === category);
};