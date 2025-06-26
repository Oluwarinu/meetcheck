/**
 * Defines the possible types for a template field.
 */
export type TemplateFieldType = 'text' | 'file' | 'date' | 'grade' | 'select' | 'textarea' | 'number';

/**
 * Represents a validation rule for a template field.
 * More specific validation rule types can be defined as needed.
 * For example, for 'text': { type: 'minLength', value: 5 }
 * For 'number': { type: 'range', min: 0, max: 100 }
 */
export interface ValidationRule {
  type: string; // e.g., 'minLength', 'maxLength', 'pattern', 'range', 'fileType'
  value?: any; // Value for the rule, e.g., regex pattern, min/max length
  message?: string; // Custom error message
  [key: string]: any; // Allow other properties like min, max for range
}

/**
 * Represents a single configurable field within a template.
 */
export interface TemplateField {
  /** Unique identifier for the field (e.g., UUID or a slug-like name). */
  id: string;
  /** The type of the field, determining its rendering and behavior. */
  type: TemplateFieldType;
  /** User-friendly label for the field. */
  label: string;
  /** Placeholder text for the input field, if applicable. */
  placeholder?: string;
  /** Indicates if the field is mandatory. */
  required: boolean;
  /** Default value for the field. */
  defaultValue?: any;
  /** Array of validation rules for the field. */
  validation?: ValidationRule[];
  /** Options for 'select' type fields. */
  options?: Array<{ label: string; value: string | number }>;
  /** Helper text or description for the field. */
  helperText?: string;
  /** Controls visibility of the field, can be dynamic in future. */
  isHidden?: boolean;
  /** Controls if the field is editable, can be dynamic in future. */
  isEditable?: boolean;
}

/**
 * Defines the possible types for template features.
 */
export type TemplateFeatureType = 'file_upload' | 'grade_tracking' | 'attendance' | 'submissions' | 'collaboration' | 'analytics';

/**
 * Represents a specific feature enabled for a template, with its configuration.
 */
export interface TemplateFeature {
  /** The type of the feature. */
  type: TemplateFeatureType;
  /** Indicates if the feature is enabled. */
  enabled: boolean;
  /** Specific configuration for the feature. Structure depends on the feature type. */
  config: Record<string, any>; // e.g., for 'file_upload': { maxSizeMB: 10, allowedTypes: ['pdf', 'docx'] }
}

/**
 * Defines the structure for a complete template.
 */
export interface Template {
  /** Unique identifier for the template. */
  id: string;
  /** Name of the template. */
  name: string;
  /** Description of the template. */
  description?: string;
  /** Category of the template, influencing its applicability. */
  category: 'academic' | 'corporate' | 'networking' | 'other';
  /** Array of fields that make up the template. */
  fields: TemplateField[];
  /** Array of features associated with the template. */
  features: TemplateFeature[];
  /** Version of the template schema, for future migrations. */
  version: number;
  /** Timestamp of creation. */
  createdAt: Date;
  /** Timestamp of the last update. */
  updatedAt: Date;
  /** User ID of the creator/owner. */
  createdBy?: string;
  /** Icon or visual representation for the template. */
  icon?: string;
}
