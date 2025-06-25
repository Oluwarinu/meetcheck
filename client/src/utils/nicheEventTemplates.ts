
export interface NicheParticipantField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea' | 'number';
  required: boolean;
  enabled: boolean;
  options?: string[];
  placeholder?: string;
  category: 'basic' | 'professional' | 'educational' | 'networking';
}

export interface NicheEventTemplate {
  id: string;
  name: string;
  description: string;
  category: 'corporate-training' | 'educational' | 'networking';
  icon: string;
  color: string;
  defaultTitle: string;
  defaultDescription: string;
  participantFields: NicheParticipantField[];
  analytics: string[];
  features: string[];
}

export const CORPORATE_TRAINING_FIELDS: NicheParticipantField[] = [
  { id: 'fullName', label: 'Full Name', type: 'text', required: true, enabled: true, category: 'basic' },
  { id: 'email', label: 'Email Address', type: 'email', required: true, enabled: true, category: 'basic' },
  { id: 'employeeId', label: 'Employee ID', type: 'text', required: true, enabled: true, placeholder: 'EMP001', category: 'professional' },
  { id: 'department', label: 'Department', type: 'select', required: true, enabled: true, category: 'professional',
    options: ['Human Resources', 'Engineering', 'Marketing', 'Sales', 'Finance', 'Operations', 'IT', 'Other'] },
  { id: 'managerName', label: 'Manager Name', type: 'text', required: false, enabled: true, category: 'professional' },
  { id: 'trainingLevel', label: 'Training Level', type: 'select', required: true, enabled: true, category: 'professional',
    options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'] },
  { id: 'certificationRequired', label: 'Certification Required', type: 'select', required: true, enabled: true, category: 'professional',
    options: ['Yes', 'No'] },
  { id: 'phone', label: 'Phone Number', type: 'tel', required: false, enabled: false, category: 'basic' },
  { id: 'preTrainingExperience', label: 'Pre-Training Experience', type: 'textarea', required: false, enabled: true, category: 'professional' }
];

export const EDUCATIONAL_FIELDS: NicheParticipantField[] = [
  { id: 'fullName', label: 'Full Name', type: 'text', required: true, enabled: true, category: 'basic' },
  { id: 'email', label: 'Email Address', type: 'email', required: true, enabled: true, category: 'basic' },
  { id: 'studentId', label: 'Student ID', type: 'text', required: true, enabled: true, placeholder: 'STU202401234', category: 'educational' },
  { id: 'courseCode', label: 'Course Code', type: 'text', required: true, enabled: true, placeholder: 'CS101', category: 'educational' },
  { id: 'academicYear', label: 'Academic Year', type: 'select', required: true, enabled: true, category: 'educational',
    options: ['2024/2025', '2025/2026', '2026/2027'] },
  { id: 'faculty', label: 'Faculty/Department', type: 'select', required: true, enabled: true, category: 'educational',
    options: ['Engineering', 'Sciences', 'Arts', 'Business', 'Medicine', 'Law', 'Education', 'Other'] },
  { id: 'gradeLevel', label: 'Grade Level', type: 'select', required: true, enabled: true, category: 'educational',
    options: ['100 Level', '200 Level', '300 Level', '400 Level', '500 Level', 'Graduate', 'PhD'] },
  { id: 'phone', label: 'Phone Number', type: 'tel', required: false, enabled: false, category: 'basic' },
  { id: 'campusLocation', label: 'Campus Location', type: 'select', required: false, enabled: true, category: 'educational',
    options: ['Main Campus', 'Satellite Campus A', 'Satellite Campus B', 'Online'] }
];

export const NETWORKING_FIELDS: NicheParticipantField[] = [
  { id: 'fullName', label: 'Full Name', type: 'text', required: true, enabled: true, category: 'basic' },
  { id: 'email', label: 'Email Address', type: 'email', required: true, enabled: true, category: 'basic' },
  { id: 'company', label: 'Company/Organization', type: 'text', required: true, enabled: true, category: 'networking' },
  { id: 'jobTitle', label: 'Job Title', type: 'text', required: true, enabled: true, category: 'networking' },
  { id: 'industry', label: 'Industry', type: 'select', required: true, enabled: true, category: 'networking',
    options: ['Technology', 'Finance', 'Healthcare', 'Education', 'Manufacturing', 'Retail', 'Consulting', 'Other'] },
  { id: 'linkedinProfile', label: 'LinkedIn Profile', type: 'text', required: false, enabled: true, placeholder: 'https://linkedin.com/in/username', category: 'networking' },
  { id: 'phone', label: 'Phone Number', type: 'tel', required: false, enabled: true, category: 'basic' },
  { id: 'yearsExperience', label: 'Years of Experience', type: 'select', required: false, enabled: true, category: 'networking',
    options: ['0-2 years', '3-5 years', '6-10 years', '11-15 years', '15+ years'] },
  { id: 'networkingGoals', label: 'Networking Goals', type: 'textarea', required: false, enabled: true, category: 'networking' }
];

export const NICHE_EVENT_TEMPLATES: NicheEventTemplate[] = [
  {
    id: 'corporate-training',
    name: 'Corporate Training',
    description: 'Professional training sessions with compliance tracking and skill assessment',
    category: 'corporate-training',
    icon: 'Building',
    color: 'blue',
    defaultTitle: 'Corporate Training Session - ',
    defaultDescription: 'Join us for a comprehensive training session designed to enhance your professional skills and knowledge.',
    participantFields: CORPORATE_TRAINING_FIELDS,
    analytics: ['Training completion rates', 'Department performance', 'Certification tracking', 'Skills assessment'],
    features: ['Compliance tracking', 'Manager notifications', 'Certification generation', 'Department analytics']
  },
  {
    id: 'educational-lecture',
    name: 'Educational Institution',
    description: 'Academic lectures, seminars, and institutional events with student tracking',
    category: 'educational',
    icon: 'GraduationCap',
    color: 'green',
    defaultTitle: 'Academic Session - ',
    defaultDescription: 'Join us for an engaging academic presentation covering important topics in your field of study.',
    participantFields: EDUCATIONAL_FIELDS,
    analytics: ['Attendance vs performance', 'Faculty engagement', 'Campus utilization', 'Student demographics'],
    features: ['Academic credit tracking', 'Professor assignments', 'Campus verification', 'Performance correlation']
  },
  {
    id: 'networking-event',
    name: 'Professional Networking',
    description: 'Business networking events with connection tracking and lead management',
    category: 'networking',
    icon: 'Users',
    color: 'purple',
    defaultTitle: 'Networking Event - ',
    defaultDescription: 'Connect with industry professionals, share insights, and build valuable business relationships.',
    participantFields: NETWORKING_FIELDS,
    analytics: ['Connection quality', 'Lead generation', 'Industry representation', 'Follow-up rates'],
    features: ['Digital business cards', 'Connection tracking', 'Follow-up automation', 'Lead qualification']
  }
];

export const getNicheTemplate = (templateId: string): NicheEventTemplate | undefined => {
  return NICHE_EVENT_TEMPLATES.find(template => template.id === templateId);
};

export const getTemplateByCategory = (category: string): NicheEventTemplate[] => {
  return NICHE_EVENT_TEMPLATES.filter(template => template.category === category);
};
