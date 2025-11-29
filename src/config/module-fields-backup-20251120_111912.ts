/**
 * ================================================================================================
 * MODULE FIELD CONFIGURATION - ORGANIZED BY DEPARTMENT
 * ================================================================================================
 * 
 * This file defines the form fields and their metadata for each department module
 * Used by the admin dashboard for dynamic form rendering
 * 
 * Department Structure:
 * - CSE-AI: Computer Science & AI (Table Prefix: cai_*)
 * - CST: Computer Science & Technology (Table Prefix: cst_*)  
 * - ECE: Electronics & Communication Engineering (Table Prefix: ece_*)
 * - Civil: Civil Engineering (Table Prefix: civil_*)
 * - BSH: Basic Sciences & Humanities (Table Prefix: bsh_*)
 * - MBA: Business Administration (Table Prefix: mba_*)
 * - AIML: AI & Machine Learning (Table Prefix: aiml_*)
 * - CSE-DS: Computer Science & Data Science (Table Prefix: ds_*)
 * 
 * ================================================================================================
 */

export type FieldType = 'text' | 'email' | 'number' | 'date' | 'textarea' | 'select' | 'file' | 'checkbox';
export type FieldSize = 'full' | 'half' | 'third';

export interface ModuleField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  size?: FieldSize; // For grid layout
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  options?: Array<{ value: string; label: string }>; // For select fields
  accept?: string; // For file fields (e.g., ".pdf,.doc,.docx")
  description?: string; // Help text below field
  rows?: number; // For textarea
  hidden?: boolean; // Hide from form but include in submission
}

export interface ModuleFieldConfig {
  tableName: string;
  displayField: string; // Field to show in list view
  fields: ModuleField[];
  searchableFields?: string[]; // Fields to search by
  sortableFields?: string[]; // Fields that can be sorted
  editableFields?: string[]; // Fields that can be edited (exclude id, created_at, etc)
}

/**
 * Workshops Module Field Configuration
 * Table: cai_workshops
 * Fields: id, category, year, title, file_url, created_at
 */
export const workshopsFieldConfig: ModuleFieldConfig = {
  tableName: 'cai_workshops',
  displayField: 'title',
  fields: [
     {
      name: 'category',
      label: 'Category',
      type: 'select',
      required: true,
      size: 'half',
      description: 'Select the workshop category',
      options: [
        { value: 'SOC', label: 'SOC' },
        { value: 'Guest Lecturers/Seminars', label: 'Guest Lecturers/Seminars' },
        { value: 'Workshops', label: 'Workshops' }
      ]
    },
    {
      name: 'title',
      label: 'Workshop Title',
      type: 'text',
      placeholder: 'e.g., Machine Learning Fundamentals',
      required: true,
      size: 'full',
      description: 'Enter the title of the workshop'
    },
   
    {
      name: 'file_url',
      label: 'Workshop Document/Brochure',
      type: 'file',
      required: false,
      size: 'full',
      accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png',
      description: 'Upload workshop document, brochure, or image (PDF, DOC, or Image files)'
    }
  ],
  searchableFields: ['title', 'category',],
  sortableFields: ['title', 'category','created_at'],
  editableFields: ['title', 'category','file_url']
};

/**
 * Complete module field configurations for all departments
 * Structure: { dept: { module: config } }
 */
export const MODULES_FIELD_CONFIG: Record<string, Record<string, ModuleFieldConfig>> = {
  
  // ================================================================================================
  // CSE-AI DEPARTMENT (Computer Science & AI)
  // Table Prefix: cai_*
  // 
  // Modules (alphabetical order):
  // • academic-toppers, bos-members, bos-minutes, department-overview, eresources
  // • extra-curricular, faculty, faculty-achievements, faculty-development, hackathons
  // • hackathons-gallery, merit-scholarships, mous, newsletters, non-teaching-faculty
  // • placements, student-achievements, syllabus, technical-association, technical-faculty, workshops
  // ================================================================================================
  'cse-ai': {
    'workshops': workshopsFieldConfig,
    'faculty': {
      tableName: 'cai_faculty',
      displayField: 'title',
      fields: [
        {
          name: 'title',
          label: 'Faculty Name',
          type: 'text',
          placeholder: 'e.g., Dr. John Smith',
          required: true,
          size: 'full',
          description: 'Enter faculty member full name'
        },
        {
          name: 'qualification',
          label: 'Qualification',
          type: 'text',
          placeholder: 'e.g., Ph.D. in Computer Science',
          required: false,
          size: 'full',
          description: 'Enter highest educational qualification'
        },
        {
          name: 'designation',
          label: 'Designation',
          type: 'text',
          placeholder: 'e.g., Professor',
          required: true,
          size: 'full',
          description: 'Enter job designation'
        },
        {
          name: 'profileUrl',
          label: 'Profile Photo/Image',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.jpg,.jpeg,.png,.gif,.webp',
          description: 'Upload profile photo or image (JPG, PNG, GIF, or WebP)'
        }
      ],
      searchableFields: ['title', 'designation'],
      sortableFields: ['title', 'designation', 'created_at'],
      editableFields: ['title', 'qualification', 'designation', 'profileUrl']
    },
    'technical-faculty': {
      tableName: 'cai_technical_faculty',
      displayField: 'title',
      fields: [
        {
          name: 'title',
          label: 'Technical Faculty Name',
          type: 'text',
          placeholder: 'e.g., Mr. John Doe',
          required: true,
          size: 'full',
          description: 'Enter technical faculty member full name'
        },
        
        {
          name: 'designation',
          label: 'Designation',
          type: 'text',
          placeholder: 'e.g., Lab Technician, Technical Officer',
          required: true,
          size: 'full',
          description: 'Enter job designation'
        },
       
      ],
         searchableFields: ['title', 'designation'],
      sortableFields: ['title', 'designation', 'created_at'],
      editableFields: ['title', 'designation']
    },
    'technical-association': {
      tableName: 'cai_technical_association',
      displayField: 'title',
      fields: [
        {
          name: 'title',
          label: 'Technical Faculty Name',
          type: 'text',
          
          required: true,
          size: 'full',
          description: 'Enter technical faculty member full name'
        },
        
        {
          name: 'description',
          label: 'description',
          type: 'text',
          
          required: true,
          size: 'full',
          description: 'Enter job designation'
        },
        {
          name: 'document_url',
          label: 'document url',
          type: 'file',
          
          required: true,
          size: 'full',
          description: 'Enter job designation'
        },
       
      ],
         searchableFields: ['title', 'description'],
      sortableFields: ['title', 'description','document_url', 'created_at'],
      editableFields: ['title', 'desscription','document_url']
    },
    'non-teaching-faculty': {
      tableName: 'cai_non_teaching_faculty',
      displayField: 'title',
      fields: [
        {
          name: 'title',
          label: 'Staff Name',
          type: 'text',
          placeholder: 'e.g., Mr. Rajesh Kumar',
          required: true,
          size: 'full',
          description: 'Enter non-teaching staff member full name'
        },
        {
          name: 'designation',
          label: 'Designation',
          type: 'text',
          placeholder: 'e.g., Office Assistant, Administrative Staff',
          required: true,
          size: 'full',
          description: 'Enter job designation'
        }
      ],
      searchableFields: ['title', 'designation'],
      sortableFields: ['title', 'designation', 'created_at'],
      editableFields: ['title', 'designation']
    },
    'academic-toppers': {
      tableName: 'cai_academictoppers',
      displayField: 'particulars',
      fields: [
        {
          name: 'batch',
          label: 'Batch',
          type: 'text',
          placeholder: 'e.g., 2024-25',
          required: true,
          size: 'half',
          description: 'Enter the batch year'
        },
        {
          name: 'academic_year',
          label: 'Academic Year',
          type: 'text',
          placeholder: 'e.g., 2024-25',
          required: true,
          size: 'half',
          description: 'Enter the academic year in YYYY-YY format'
        },
        {
          name: 'particulars',
          label: 'Particulars/Details',
          type: 'text',
          placeholder: 'e.g., Academic Toppers',
          required: true,
          size: 'full',
          description: 'Enter details about the achievement'
        },
        {
          name: 'no_of_students_benefited',
          label: 'Number of Students Benefited',
          type: 'number',
          placeholder: 'e.g., 17',
          required: false,
          size: 'half',
          description: 'Number of students who benefited'
        },
        {
          name: 'scholarship_amount',
          label: 'Scholarship Amount (₹)',
          type: 'number',
          placeholder: 'e.g., 99500',
          required: false,
          size: 'half',
          description: 'Total scholarship amount in rupees'
        },
        {
          name: 'file_url',
          label: 'Certificate/Document Upload',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png',
          description: 'Upload certificate, document, or image (PDF, DOC, DOCX, or Image files)'
        }
      ],
      searchableFields: ['batch', 'particulars', 'academic_year'],
      sortableFields: ['batch', 'academic_year', 'no_of_students_benefited', 'created_at'],
      editableFields: ['batch', 'academic_year', 'particulars', 'no_of_students_benefited', 'scholarship_amount', 'file_url']
    },
    'faculty-achievements': {
      tableName: 'cai_faculty_achievements',
      displayField: 'title',
      
      fields: [
         {
          name: 'category',
          label: 'Category',
          type: 'select',
          required: true,
          size: 'half',
          description: 'Select the type of achievement',
          options: [
            { value: 'Journal Publications', label: 'Journal Publications' },
            { value: 'Conferences', label: 'Conferences' },
            { value: 'Book Publications', label: 'Book Publications' },
            { value: 'Certifications', label: 'Certifications' },
            { value: 'Patents', label: 'Patents' },
            { value: 'Research Supervisors', label: 'Research Supervisors' },
            { value: 'Faculty Out-Reach', label: 'Faculty Out-Reach' }
          ]
        },
        {
          name: 'title',
          label: 'Achievement Title',
          type: 'text',
          placeholder: 'e.g., Best Teacher Award, Paper Title, etc.',
          required: true,
          size: 'full',
          description: 'Enter the title of the achievement, publication, or certification'
        },
        {
          name: 'file_url',
          label: 'Supporting Document',
          type: 'file',
          placeholder: 'Upload certificate, publication, or related document',
          required: false,
          size: 'full',
          accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png',
          description: 'Upload supporting document, certificate, or publication (PDF, DOC, DOCX, or Image files max 1MB)'
        }
      ],
      searchableFields: ['title', 'category'],
      sortableFields: ['title', 'category', 'created_at'],
      editableFields: ['title', 'category', 'file_url']
    },
    'faculty-development': {
      tableName: 'cai_faculty_development_programs',
      displayField: 'title',
      fields: [
        {
          name: 'title',
          label: 'Program Title',
          type: 'text',
          placeholder: 'e.g., Teaching with Technology Workshop',
          required: true,
          size: 'full',
          description: 'Enter the faculty development program title'
        },
        {
          name: 'category',
          label: 'Program Type',
          type: 'select',
          required: true,
          size: 'half',
          description: 'Select the program type',
          options: [
            { value: 'Attended', label: 'Attended' },
            { value: 'Conducted', label: 'Conducted' },
            { value: 'Workshops/Training', label: 'Workshops/Training' },
            { value: 'Gallery', label: 'Gallery' }
          ]
        },
        {
          name: 'year',
          label: 'Year/Academic Year',
          type: 'text',
          placeholder: 'e.g., 2024 or 2024-25',
          required: false,
          size: 'half',
          description: 'Enter the year or academic year'
        },
        {
          name: 'file_url',
          label: 'Program Document/Certificate',
          type: 'file',
          placeholder: 'Upload program details or certificate',
          required: false,
          size: 'full',
          accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png',
          description: 'Upload program document, certificate, or image (PDF, DOC, DOCX, or Image files max 1MB)'
        }
      ],
      searchableFields: ['title', 'category', 'year'],
      sortableFields: ['title', 'category', 'year', 'created_at'],
      editableFields: ['title', 'category', 'year', 'file_url']
    },
    'placements': {
      tableName: 'cai_placements',
      displayField: 'title',
      fields: [
        {
          name: 'title',
          label: 'Title',
          type: 'text',
          placeholder: 'Enter title',
          required: false,
          size: 'full',
          description: 'Enter the placement title or description'
        },
        {
          name: 'batch',
          label: 'Batch',
          type: 'text',
          placeholder: 'Enter batch',
          required: true,
          size: 'full',
          description: 'Enter the batch year for this placement'
        },
        {
          name: 'file_url',
          label: 'File Url',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx',
          description: 'File Upload Guidelines\n• Maximum size: 1MB - Files larger than 1MB will be rejected\n• Supported formats: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX\n• Files will be stored in: /uploads/cseai/placements/'
        }
      ],
      searchableFields: ['title', 'batch'],
      sortableFields: ['title', 'batch', 'created_at'],
      editableFields: ['title', 'batch', 'file_url']
    },
    'hackathons-gallery': {
      tableName: 'cai_hackathons_gallery',
      displayField: 'category',
      fields: [
        {
          name: 'category',
          label: 'Category',
          type: 'select',
          required: true,
          size: 'full',
          description: 'Select the gallery category',
          options: [
            { value: 'hackathon', label: 'Hackathon' },
            { value: 'academic toppers', label: 'Academic Toppers' },
            { value: 'technical association', label: 'Technical Association' },
            { value: 'extracurricular activities', label: 'Extracurricular Activities' }
          ]
        },
        {
          name: 'academic_year',
          label: 'Academic Year',
          type: 'text',
          placeholder: 'e.g., 2024-2025',
          required: true,
          size: 'half',
          description: 'Enter the academic year'
        },
        {
          name: 'gallery',
          label: 'Gallery Image',
          type: 'file',
          required: true,
          size: 'half',
          accept: '.jpg,.jpeg,.png,.gif,.webp',
          description: 'Upload a single image for the gallery (JPG, PNG, GIF, or WebP)'
        }
      ],
      searchableFields: ['category', 'academic_year'],
      sortableFields: ['category', 'academic_year', 'created_at'],
      editableFields: ['category', 'academic_year', 'gallery']
    },
    'bos-members': {
      tableName: 'cai_bos_members',
      displayField: 'name',
      fields: [
        {
          name: 'name',
          label: 'Member Name',
          type: 'text',
          placeholder: 'e.g., Dr. John Smith',
          required: true,
          size: 'full'
        },
        {
          name: 'designation',
          label: 'Designation',
          type: 'text',
          placeholder: 'e.g., Professor, Industry Expert',
          required: false,
          size: 'half'
        },
        {
          name: 'organization',
          label: 'Organization',
          type: 'text',
          placeholder: 'e.g., XYZ University, ABC Corporation',
          required: false,
          size: 'half'
        },
        {
          name: 'position_in_job',
          label: 'Position',
          type: 'text',
          placeholder: 'e.g., Head of Department, Director',
          required: false,
          size: 'full'
        }
      ],
      searchableFields: ['name', 'designation', 'organization'],
      sortableFields: ['name', 'designation', 'organization', 'created_at'],
      editableFields: ['name', 'designation', 'organization', 'position_in_job']
    },
    'bos-minutes': {
      tableName: 'cai_bos_minutes',
      displayField: 'meeting_no',
      fields: [
        {
          name: 'meeting_no',
          label: 'Meeting Number',
          type: 'text',
          placeholder: 'e.g., 1st, 2nd, 3rd',
          required: true,
          size: 'half',
          description: 'Enter the meeting number'
        },
        {
          name: 'meeting_date',
          label: 'Meeting Date',
          type: 'date',
          required: true,
          size: 'half',
          description: 'Select the meeting date'
        },
        {
          name: 'file_url',
          label: 'Meeting Minutes File',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.pdf,.doc,.docx',
          description: 'Upload meeting minutes document (PDF, DOC, or DOCX format)'
        }
      ],
      searchableFields: ['meeting_no', 'meeting_date'],
      sortableFields: ['meeting_date', 'meeting_no', 'created_at'],
      editableFields: ['meeting_no', 'meeting_date', 'file_url']
    },
    'eresources': {
      tableName: 'cai_eresources',
      displayField: 'subject_name',
      fields: [
        {
          name: 'regulation',
          label: 'Regulation',
          type: 'text',
          placeholder: 'e.g., R18, R20',
          required: true,
          size: 'half'
        },
        {
          name: 'semester',
          label: 'Semester',
          type: 'text',
          placeholder: 'e.g., 1, 2, 3',
          required: true,
          size: 'half'
        },
        {
          name: 'subject_name',
          label: 'Subject Name',
          type: 'text',
          placeholder: 'e.g., Data Structures',
          required: true,
          size: 'full'
        },
        {
          name: 'file_type',
          label: 'File Type',
          type: 'select',
          required: false,
          size: 'half',
          options: [
            { value: 'PPT', label: 'PowerPoint (PPT)' },
            { value: 'PDF', label: 'PDF' },
            { value: 'DOCX', label: 'Document (DOCX)' },
            { value: 'XLS', label: 'Spreadsheet (XLS)' },
            { value: 'Video', label: 'Video' },
            { value: 'Other', label: 'Other' }
          ]
        },
        {
          name: 'academic_year',
          label: 'Academic Year',
          type: 'text',
          placeholder: 'e.g., 2024',
          required: false,
          size: 'half'
        },
        {
          name: 'file_url',
          label: 'Resource File',
          type: 'file',
          required: true,
          size: 'full',
          accept: '.pdf,.ppt,.pptx,.docx,.xls,.xlsx,.mp4,.mov'
        }
      ],
      searchableFields: ['subject_name', 'regulation', 'semester'],
      sortableFields: ['subject_name', 'regulation', 'semester', 'academic_year'],
      editableFields: ['regulation', 'semester', 'subject_name', 'file_type', 'academic_year', 'file_url']
    },
    'hackathons': {
      tableName: 'cai_hackathons',
      displayField: 'title',
      fields: [
        {
          name: 'title',
          label: 'Hackathon Title',
          type: 'text',
          placeholder: 'e.g., Annual Hackathon 2024',
          required: true,
          size: 'full'
        },
        {
          name: 'academic_year',
          label: 'Academic Year',
          type: 'text',
          placeholder: 'e.g., 2024-25',
          required: true,
          size: 'half'
        },
        {
          name: 'event_date',
          label: 'Event Date',
          type: 'date',
          required: false,
          size: 'half'
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          placeholder: 'Enter hackathon details and objectives',
          required: false,
          size: 'full',
          rows: 4
        },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          required: false,
          size: 'half',
          options: [
            { value: 'approved', label: 'Approved' },
            { value: 'pending', label: 'Pending' },
            { value: 'draft', label: 'Draft' }
          ]
        },
        {
          name: 'brochure_url',
          label: 'Brochure',
          type: 'file',
          required: false,
          size: 'half',
          accept: '.pdf,.jpg,.jpeg,.png'
        },
        {
          name: 'winners_url',
          label: 'Winners Details',
          type: 'file',
          required: false,
          size: 'half',
          accept: '.pdf,.doc,.docx'
        }
      ],
      searchableFields: ['title', 'academic_year'],
      sortableFields: ['title', 'academic_year', 'event_date', 'status', 'created_at'],
      editableFields: ['title', 'academic_year', 'event_date', 'description', 'status', 'brochure_url', 'winners_url']
    },
    'newsletters': {
      tableName: 'cai_newsletters',
      displayField: 'title',
      fields: [
        {
          name: 'title',
          label: 'Newsletter Title',
          type: 'text',
          placeholder: 'e.g., Monthly Newsletter',
          required: true,
          size: 'full'
        },
        {
          name: 'volume',
          label: 'Volume',
          type: 'number',
          placeholder: 'e.g., 1',
          required: true,
          size: 'half'
        },
        {
          name: 'issue',
          label: 'Issue',
          type: 'number',
          placeholder: 'e.g., 1, 2, 3',
          required: true,
          size: 'half'
        },
        {
          name: 'year',
          label: 'Year',
          type: 'text',
          placeholder: 'e.g., 2024',
          required: true,
          size: 'half'
        },
        {
          name: 'publish_date',
          label: 'Publish Date',
          type: 'date',
          required: true,
          size: 'half'
        },
        {
          name: 'pdf_url',
          label: 'Newsletter PDF',
          type: 'file',
          required: true,
          size: 'full',
          accept: '.pdf'
        }
      ],
      searchableFields: ['title', 'year', 'volume'],
      sortableFields: ['title', 'volume', 'issue', 'year', 'publish_date'],
      editableFields: ['title', 'volume', 'issue', 'year', 'publish_date', 'pdf_url']
    },
    'merit-scholarships': {
      tableName: 'cai_merit_scholarships',
      displayField: 'particulars',
      fields: [
        {
          name: 'academic_year',
          label: 'Academic Year',
          type: 'text',
          placeholder: 'e.g., 2024-25',
          required: false,
          size: 'half'
        },
        {
          name: 'particulars',
          label: 'Details',
          type: 'text',
          placeholder: 'e.g., Merit Scholarship Details',
          required: false,
          size: 'full'
        },
        {
          name: 'students_benefited',
          label: 'Number of Students Benefited',
          type: 'number',
          placeholder: 'e.g., 50',
          required: false,
          size: 'half'
        },
        {
          name: 'scholarship_amount',
          label: 'Total Scholarship Amount (₹)',
          type: 'number',
          placeholder: 'e.g., 500000',
          required: false,
          size: 'half'
        }
      ],
      searchableFields: ['particulars', 'academic_year'],
      sortableFields: ['academic_year', 'scholarship_amount', 'students_benefited'],
      editableFields: ['academic_year', 'particulars', 'students_benefited', 'scholarship_amount']
    },
    'mous': {
      tableName: 'cai_mous',
      displayField: 'mou_with',
      fields: [
        {
          name: 'mou_with',
          label: 'Organization/Institute',
          type: 'text',
          placeholder: 'e.g., IIT Delhi, Google India, Microsoft',
          required: true,
          size: 'full'
        },
        {
          name: 'from_date',
          label: 'MOU Start Date',
          type: 'text',
          placeholder: 'e.g., 2024-01-15 or 01-01-2024',
          required: true,
          size: 'half'
        },
        {
          name: 'to_date',
          label: 'MOU End Date',
          type: 'text',
          placeholder: 'e.g., 2026-01-14 or 31-12-2026',
          required: true,
          size: 'half'
        },
        {
          name: 'status',
          label: 'MOU Status',
          type: 'select',
          required: true,
          size: 'half',
          options: [
            { value: 'Till Date', label: 'Till Date' },
            { value: 'Expired', label: 'Expired' },
            { value: 'Terminated', label: 'Terminated' },
            
          ]
        }
      ],
      searchableFields: ['mou_with', 'status'],
      sortableFields: ['mou_with', 'from_date', 'to_date', 'status', 'created_at'],
      editableFields: ['mou_with', 'from_date', 'to_date', 'status']
    },
    'syllabus': {
  tableName: 'cai_syllabus',
  displayField: 'title',

  fields: [
    {
      name: 'type',
      label: 'Type',
      type: 'select',              // dropdown
      required: true,
      size: 'full',
      options: [
        { label: 'SOC', value: 'soc' },
        { label: 'Syllabus', value: 'syllabus' }
      ],
      description: 'Select whether this document is SOC or Syllabus'
    },
    {
      name: 'title',
      label: 'Syllabus Title',
      type: 'text',
      placeholder: 'e.g., B.Tech CSE-AI - II Year Syllabus',
      required: true,
      size: 'full',
      description: 'Enter the title or name of the syllabus document',
      validation: {
        min: 5,
        max: 200,
        pattern: '^[a-zA-Z0-9\\s\\-.,()]+$',
        message: 'Title must be 5-200 characters with alphanumeric characters and basic punctuation'
      }
    },
    {
      name: 'fileUrl',
      label: 'Syllabus PDF Document',
      type: 'file',
      required: true,
      size: 'full',
      accept: '.pdf,.doc,.docx',
      description: 'Upload the syllabus document (PDF, DOC, or DOCX format). Old files are automatically managed.'
    }
  ],

  searchableFields: ['title', 'type'],
  sortableFields: ['title', 'created_at'],
  editableFields: ['type', 'title', 'fileUrl']
},

    'student-achievements': {
      tableName: 'cai_student_achievements',
      displayField: 'title',
      fields: [
        {
          name: 'category',
          label: 'Category',
          type: 'text',
          required: false,
          size: 'half'
        },
        {
          name: 'title',
          label: 'Achievement Title',
          type: 'text',
          required: true,
          size: 'full'
        },
        {
          name: 'file_url',
          label: 'Certificate/Image',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.pdf,.jpg,.jpeg,.png'
        }
      ],
      searchableFields: ['title', 'category'],
      sortableFields: ['title', 'category', 'created_at'],
      editableFields: ['title', 'category', 'description', 'file_url']
    },
    'extra-curricular': {
      tableName: 'cai_extracurricular_activities',
      displayField: 'title',
      fields: [
        {
          name: 'title',
          label: 'Activity Title',
          type: 'text',
          placeholder: 'e.g., Tech Talk Series',
          required: true,
          size: 'full'
        },
        {
          name: 'academic_year',
          label: 'Academic Year',
          type: 'text',
          placeholder: 'e.g., 2024-25',
          required: true,
          size: 'half'
        },
        {
          name: 'volume',
          label: 'Volume',
          type: 'number',
          placeholder: 'e.g., 1',
          required: false,
          size: 'half'
        },
        {
          name: 'issue',
          label: 'Issue',
          type: 'text',
          placeholder: 'e.g., Jan, Feb',
          required: false,
          size: 'half'
        },
        {
          name: 'publish_date',
          label: 'Date',
          type: 'date',
          required: false,
          size: 'half'
        },
        {
          name: 'pdf_url',
          label: 'Activity Document/Report',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png'
        }
      ],
      searchableFields: ['title', 'academic_year'],
      sortableFields: ['title', 'academic_year', 'publish_date', 'created_at'],
      editableFields: ['title', 'academic_year', 'volume', 'issue', 'publish_date', 'pdf_url']
    },
    'department-overview': {
      tableName: 'cai_department_overview',
      displayField: 'title',
      fields: [
        {
          name: 'title',
          label: 'Section Title',
          type: 'text',
          placeholder: 'e.g., Department Mission',
          required: true,
          size: 'full'
        },
        {
          name: 'content',
          label: 'Content',
          type: 'textarea',
          placeholder: 'Enter detailed content',
          required: true,
          size: 'full',
          rows: 6
        }
      ],
      searchableFields: ['title'],
      sortableFields: ['title', 'created_at'],
      editableFields: ['title', 'content']
    }
  },
  
  // ================================================================================================
  // CST DEPARTMENT (Computer Science & Technology)
  // Table Prefix: cst_*
  //
  // Modules (alphabetical order):
  // • department-library, handbooks, workshops
  // ================================================================================================
  'cst': {
    'workshops': workshopsFieldConfig
  },
  
  // ================================================================================================
  // ECE DEPARTMENT (Electronics & Communication Engineering)
  // Table Prefix: ece_*
  //
  // Modules (alphabetical order):
  // • department-library, handbooks, workshops  
  // ================================================================================================
  'ece': {
    'workshops': {
      tableName: 'ece_worshops_gl',
      displayField: 'title',
      fields: [
        {
          name: 'title',
          label: 'Workshop Title',
          type: 'text',
          required: true,
          size: 'full'
        },
        {
          name: 'category',
          label: 'Category',
          type: 'text',
          required: false,
          size: 'half'
        },
        {
          name: 'year',
          label: 'Year',
          type: 'text',
          required: false,
          size: 'half'
        },
        {
          name: 'file_url',
          label: 'Document',
          type: 'file',
          required: false,
          size: 'full'
        }
      ],
      searchableFields: ['title', 'category'],
      editableFields: ['title', 'category', 'year', 'file_url']
    },
    'handbooks': {
      tableName: 'cai_handbooks',
      displayField: 'title',
      fields: [
        {
          name: 'title',
          label: 'Handbook Title',
          type: 'text',
          placeholder: 'e.g., Academic Handbook 2024-25',
          required: true,
          size: 'full',
          description: 'Enter the handbook title'
        },
        {
          name: 'year',
          label: 'Academic Year',
          type: 'text',
          placeholder: 'e.g., 2024-25',
          required: true,
          size: 'half',
          description: 'Enter the academic year'
        },
        {
          name: 'semester',
          label: 'Semester',
          type: 'text',
          placeholder: 'e.g., I, II',
          required: false,
          size: 'half',
          description: 'Enter semester information (if applicable)'
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          placeholder: 'Enter handbook description',
          required: false,
          size: 'full',
          rows: 3,
          description: 'Brief description of the handbook content'
        },
        {
          name: 'file_url',
          label: 'Handbook File (PDF)',
          type: 'file',
          required: true,
          size: 'full',
          accept: '.pdf',
          description: 'Upload the handbook PDF file (PDF format required)'
        }
      ],
      searchableFields: ['title', 'year'],
      sortableFields: ['title', 'year', 'created_at'],
      editableFields: ['title', 'year', 'semester', 'description', 'file_url']
    },
    'department-library': {
      tableName: 'cai_department_library',
      displayField: 'titles',
      fields: [
        {
          name: 'titles',
          label: 'Number of Titles',
          type: 'text',
          placeholder: 'e.g., 1500',
          required: true,
          size: 'half',
          description: 'Total number of unique titles in library'
        },
        {
          name: 'volumes',
          label: 'Number of Volumes',
          type: 'text',
          placeholder: 'e.g., 2000',
          required: true,
          size: 'half',
          description: 'Total number of volumes in library'
        },
        {
          name: 'faculty_incharge',
          label: 'Faculty In-charge',
          type: 'text',
          placeholder: 'e.g., Dr. John Smith',
          required: true,
          size: 'full',
          description: 'Name of faculty member responsible for library'
        },
        {
          name: 'phone',
          label: 'Phone Number',
          type: 'text',
          placeholder: 'e.g., +91 9876543210',
          required: false,
          size: 'half',
          description: 'Contact phone number'
        },
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          placeholder: 'e.g., library@example.com',
          required: false,
          size: 'half',
          description: 'Contact email address'
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          placeholder: 'Enter library information and resources',
          required: false,
          size: 'full',
          rows: 4,
          description: 'Detailed description of library facilities and resources'
        },
        {
          name: 'image_url',
          label: 'Library Image',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.jpg,.jpeg,.png,.gif,.webp',
          description: 'Upload library image (JPG, PNG, GIF, or WebP)'
        }
      ],
      searchableFields: ['faculty_incharge', 'titles'],
      sortableFields: ['titles', 'volumes', 'created_at'],
      editableFields: ['titles', 'volumes', 'faculty_incharge', 'phone', 'email', 'description', 'image_url']
    }
  },
  
  // ================================================================================================
  // CIVIL DEPARTMENT (Civil Engineering)
  // Table Prefix: civil_*
  //
  // Modules (alphabetical order):
  // • board-of-studies, consultancy, extra-curricular-activities, newsletters
  // • physical-facilities, syllabus, technical-association, workshops
  // ================================================================================================
  'civil': {
    'board-of-studies': {
      tableName: 'board_of_studies',
      displayField: 'name',
      filterField: 'dept',
      filterValue: 'civil',
      fields: [
        {
          name: 'name',
          label: 'Member Name',
          type: 'text',
          required: true,
          size: 'half',
          placeholder: 'e.g., Dr. John Smith'
        },
        {
          name: 'designation',
          label: 'Designation',
          type: 'text',
          required: true,
          size: 'half',
          placeholder: 'e.g., Professor'
        },
        {
          name: 'organization',
          label: 'Organization',
          type: 'text',
          required: false,
          size: 'half',
          placeholder: 'e.g., SVEC'
        },
        {
          name: 'position',
          label: 'Position',
          type: 'text',
          required: false,
          size: 'half',
          placeholder: 'e.g., Chairman'
        }
      ],
      searchableFields: ['name', 'designation'],
      editableFields: ['name', 'designation', 'organization', 'position']
    },
    'consultancy': {
      tableName: 'civil_consultancy',
      displayField: 'name',
      fields: [
        {
          name: 'year',
          label: 'Academic Year',
          type: 'text',
          required: true,
          placeholder: 'e.g., 2023-2024',
          size: 'half'
        },
        {
          name: 'name',
          label: 'Consultancy Title',
          type: 'text',
          required: true,
          placeholder: 'e.g., Consultancy Details',
          size: 'full'
        },
        {
          name: 'url',
          label: 'Document URL',
          type: 'file',
          required: false,
          accept: '.pdf,.doc,.docx',
          size: 'full',
          description: 'Upload consultancy document'
        }
      ],
      searchableFields: ['name', 'year'],
      editableFields: ['year', 'name', 'url']
    },
    'extra-curricular-activities': {
      tableName: 'civil_extra_curricular_activities',
      displayField: 'name',
      fields: [
        {
          name: 'year',
          label: 'Academic Year',
          type: 'text',
          required: true,
          placeholder: 'e.g., 2023-2024',
          size: 'half'
        },
        {
          name: 'name',
          label: 'Activity Name',
          type: 'text',
          required: true,
          placeholder: 'e.g., Technical Festival',
          size: 'full'
        },
        {
          name: 'url',
          label: 'Activity Document/Photo',
          type: 'file',
          required: false,
          accept: '.pdf,.doc,.docx,.jpg,.png',
          size: 'full',
          description: 'Upload activity document or photo'
        }
      ],
      searchableFields: ['name', 'year'],
      editableFields: ['year', 'name', 'url']
    },
    'newsletters': {
      tableName: 'civil_newsletters',
      displayField: 'issue',
      fields: [
        {
          name: 'issue',
          label: 'Issue',
          type: 'text',
          required: true,
          placeholder: 'e.g., December 2024',
          size: 'half'
        },
        {
          name: 'date',
          label: 'Publication Date',
          type: 'date',
          required: true,
          size: 'half'
        },
        {
          name: 'url',
          label: 'Newsletter PDF',
          type: 'file',
          required: true,
          accept: '.pdf',
          size: 'full',
          description: 'Upload newsletter PDF document'
        }
      ],
      searchableFields: ['issue'],
      editableFields: ['issue', 'date', 'url']
    },
    'physical-facilities': {
      tableName: 'cai_physical_facilities',
      displayField: 'title',
      fields: [
        {
          name: 'category',
          label: 'Category',
          type: 'select',
          required: true,
          size: 'half',
          description: 'Select the facility category',
          options: [
             { value: 'Laboratory', label: 'Laboratory' },
            { value: 'Classroom', label: 'Classroom' },
            { value: 'Timetables', label: 'Timetables' },
            { value: 'Seminar Halls', label: 'Seminar Halls' },
          ]
        },
        {
          name: 'title',
          label: 'Facility Name',
          type: 'text',
          placeholder: 'e.g., Advanced Computer Lab',
          required: true,
          size: 'full',
          description: 'Enter the name of the facility'
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          placeholder: 'Enter facility details and specifications',
          required: false,
          size: 'full',
          rows: 4,
          description: 'Detailed description of the facility'
        },
        {
          name: 'file_url',
          label: 'Document/Image',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.pdf,.jpg,.jpeg,.png,.doc,.docx',
          description: 'Upload facility document or image (PDF, Image, or DOC formats)'
        }
      ],
      searchableFields: ['title', 'category', 'description'],
      sortableFields: ['title', 'category', 'created_at'],
      editableFields: ['category', 'title', 'description', 'file_url']
    },
    
    'physical-facilities': {
      tableName: 'civil_physical_facilities',
      displayField: 'name',
      fields: [
        {
          name: 'category',
          label: 'Facility Category',
          type: 'select',
          required: true,
          options: [
            { value: 'Class Timetable', label: 'Class Timetable' },
            { value: 'Class Room', label: 'Class Room' },
            { value: 'Laboratory', label: 'Laboratory' },
            { value: 'Infrastructure', label: 'Infrastructure' },
            { value: 'Equipment', label: 'Equipment' }
          ],
          size: 'half'
        },
        {
          name: 'name',
          label: 'Facility Name',
          type: 'text',
          required: true,
          placeholder: 'e.g., CAD & GIS Lab',
          size: 'full'
        },
        {
          name: 'description',
          label: 'Description/URL',
          type: 'textarea',
          required: false,
          placeholder: 'Description or URL to facility document/image',
          size: 'full'
        }
      ],
      searchableFields: ['name', 'category'],
      editableFields: ['category', 'name', 'description']
    },
    'syllabus': {
      tableName: 'cai_syllabus',
      displayField: 'title',
      fields: [
        {
          name: 'title',
          label: 'Syllabus Title',
          type: 'text',
          placeholder: 'e.g., B.Tech CSE-AI - II Year Syllabus',
          required: true,
          size: 'full',
          description: 'Enter the title or name of the syllabus document',
          validation: {
            min: 5,
            max: 200,
            pattern: '^[a-zA-Z0-9\\s\\-.,()]+$',
            message: 'Title must be 5-200 characters with alphanumeric characters and basic punctuation'
          }
        },
        {
          name: 'fileUrl',
          label: 'Syllabus PDF Document',
          type: 'file',
          required: true,
          size: 'full',
          accept: '.pdf,.doc,.docx',
          description: 'Upload the syllabus document (PDF, DOC, or DOCX format). Old files are automatically managed.'
        }
      ],
      searchableFields: ['title'],
      sortableFields: ['title',  'created_at'],
      editableFields: [ 'title',  'fileUrl']
    },
    'technical-association': {
      tableName: 'civil_technical_association',
      displayField: 'committee',
      fields: [
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          required: true,
          placeholder: 'Description of technical association activities',
          size: 'full'
        },
        {
          name: 'committee',
          label: 'Committee Details',
          type: 'textarea',
          required: false,
          placeholder: 'Committee member details',
          size: 'full'
        },
        {
          name: 'images',
          label: 'Association Images',
          type: 'file',
          required: false,
          accept: '.jpg,.png,.jpeg',
          multiple: true,
          size: 'full',
          description: 'Upload association photos (multiple allowed)'
        }
      ],
      searchableFields: ['committee'],
      editableFields: ['description', 'committee', 'images']
    },
    'workshops': {
      tableName: 'civil_workshops',
      displayField: 'name',
      fields: [
        {
          name: 'year',
          label: 'Academic Year',
          type: 'text',
          required: true,
          placeholder: 'e.g., 2023-2024',
          size: 'half'
        },
        {
          name: 'name',
          label: 'Workshop Title',
          type: 'text',
          required: true,
          placeholder: 'e.g., Workshops organized during Academic Year',
          size: 'full'
        },
        {
          name: 'url',
          label: 'Workshop Document',
          type: 'file',
          required: false,
          accept: '.pdf,.doc,.docx',
          size: 'full',
          description: 'Upload workshop details document'
        }
      ],
      searchableFields: ['name', 'year'],
      editableFields: ['year', 'name', 'url']
    }
  },
  
  // ================================================================================================
  // BSH DEPARTMENT (Basic Sciences & Humanities)
  // Table Prefix: bsh_*
  //
  // Modules (alphabetical order):
  // • fdps, photogallery, syllabus
  // ================================================================================================
  'bsh': {
     'syllabus': {
      tableName: 'bsh_syllabus',
      displayField: 'title',
      fields: [
        {
          name: 'title',
          label: 'Syllabus Title',
          type: 'text',
          placeholder: 'e.g., B.Tech CSE-AI - II Year Syllabus',
          required: true,
          size: 'full',
          description: 'Enter the title or name of the syllabus document',
          validation: {
            min: 5,
            max: 200,
            pattern: '^[a-zA-Z0-9\\s\\-.,()]+$',
            message: 'Title must be 5-200 characters with alphanumeric characters and basic punctuation'
          }
        },
        {
          name: 'fileUrl',
          label: 'Syllabus PDF Document',
          type: 'file',
          required: true,
          size: 'full',
          accept: '.pdf,.doc,.docx',
          description: 'Upload the syllabus document (PDF, DOC, or DOCX format). Old files are automatically managed.'
        }
      ],
      searchableFields: ['title'],
      sortableFields: ['title',  'created_at'],
      editableFields: [ 'title',  'fileUrl']
    },
    'photogallery': {
      tableName: 'bsh_photogallery',
      displayField: 'title',
      fields: [
        {
          name: 'title',
          label: 'Photo/Event Title',
          type: 'text',
          placeholder: 'e.g., Annual Science Exhibition 2024',
          required: true,
          size: 'full',
          description: 'Enter the title of the photo or event'
        },
        {
          name: 'url',
          label: 'Photo/Image',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.jpg,.jpeg,.png,.gif,.webp',
          description: 'Upload photo/image (JPG, PNG, GIF, WebP format)'
        },
        {
          name: 'year',
          label: 'Year',
          type: 'text',
          placeholder: 'e.g., 2024-2025 or 2024',
          required: false,
          size: 'full',
          description: 'Enter the year of the photo/event'
        }
      ],
      searchableFields: ['title', 'year'],
      sortableFields: ['title', 'year'],
      editableFields: ['title', 'url', 'year']
    },
    'fdps': {
      tableName: 'bsh_fdps',
      displayField: 'title',
      fields: [
        {
          name: 'title',
          label: 'FDP/Program Title',
          type: 'text',
          placeholder: 'e.g., Advanced Teaching Methodologies Workshop',
          required: true,
          size: 'full',
          description: 'Enter the title of the FDP, workshop, or guest lecture'
        },
        {
          name: 'url',
          label: 'Program Document/Link',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.pdf,.doc,.docx,.txt',
          description: 'Upload program document or details (PDF, DOC, DOCX, TXT format)'
        },
        {
          name: 'year',
          label: 'Year',
          type: 'text',
          placeholder: 'e.g., 2024-2025 or 2024',
          required: false,
          size: 'full',
          description: 'Enter the year or academic year'
        }
      ],
      searchableFields: ['title', 'year'],
      sortableFields: ['title', 'year'],
      editableFields: ['title', 'url', 'year']
    }
  },
  
  // ================================================================================================
  // MBA DEPARTMENT (Business Administration)
  // Table Prefix: mba_*
  //
  // Modules (alphabetical order):
  // • (modules to be added)
  // ================================================================================================
  'mba': {
    // MBA department uses mba_* tables with dynamic schema detection
    // No explicit field configuration needed - system will auto-detect from MySQL schema
    // This enables dynamic field generation similar to CSE-AI approach
  },
  
  // ================================================================================================
  // AIML DEPARTMENT (AI & Machine Learning)
  // Table Prefix: aiml_*
  // Note: Contains all CSE-AI modules with aiml_* table prefixes
  //
  // Modules (alphabetical order):
  // • academic-toppers, bos-members, bos-minutes, department-overview, eresources
  // • extra-curricular, faculty, faculty-achievements, faculty-development, hackathons
  // • hackathons-gallery, merit-scholarships, mous, newsletters, non-teaching-faculty
  // • placements, student-achievements, syllabus, technical-association, technical-faculty, workshops
  // ================================================================================================
  'aiml': {
    'academic-toppers': {
      tableName: 'aiml_academic_toppers',
      displayField: 'student_name',
      fields: [
        {
          name: 'student_name',
          label: 'Student Name',
          type: 'text',
          placeholder: 'Enter student full name',
          required: true,
          size: 'full',
          description: 'Enter the full name of the student'
        },
        {
          name: 'roll_number',
          label: 'Roll Number',
          type: 'text',
          placeholder: 'e.g., 19BCS001',
          required: true,
          size: 'half',
          description: 'Enter student roll number'
        },
        {
          name: 'cgpa',
          label: 'CGPA',
          type: 'number',
          placeholder: 'e.g., 9.8',
          required: true,
          size: 'half',
          description: 'Enter CGPA achieved'
        },
        {
          name: 'category',
          label: 'Achievement Category',
          type: 'select',
          required: true,
          size: 'half',
          options: [
            { value: 'First Class with Distinction', label: 'First Class with Distinction' },
            { value: 'First Class', label: 'First Class' },
            { value: 'Second Class', label: 'Second Class' },
            { value: 'Rank Holder', label: 'Rank Holder' }
          ]
        }
      ],
      searchableFields: ['student_name', 'roll_number', 'category'],
      sortableFields: ['student_name', 'cgpa', 'roll_number', 'created_at'],
      editableFields: ['student_name', 'roll_number', 'cgpa', 'category']
    },

    'faculty': {
      tableName: 'aiml_faculty',
      displayField: 'title',
      fields: [
        {
          name: 'title',
          label: 'Faculty Name',
          type: 'text',
          placeholder: 'e.g., Dr. John Smith',
          required: true,
          size: 'full',
          description: 'Enter faculty member full name'
        },
        {
          name: 'qualification',
          label: 'Qualification',
          type: 'text',
          placeholder: 'e.g., Ph.D. in Computer Science',
          required: false,
          size: 'full',
          description: 'Enter highest educational qualification'
        },
        {
          name: 'designation',
          label: 'Designation',
          type: 'text',
          placeholder: 'e.g., Professor',
          required: true,
          size: 'half',
          description: 'Enter current position/designation'
        },
        {
          name: 'experience',
          label: 'Experience',
          type: 'text',
          placeholder: 'e.g., 10 years',
          required: false,
          size: 'half',
          description: 'Enter years of teaching experience'
        },
        {
          name: 'specialization',
          label: 'Specialization',
          type: 'text',
          placeholder: 'e.g., Machine Learning, Data Science',
          required: false,
          size: 'full',
          description: 'Enter areas of expertise and specialization'
        },
        {
          name: 'file_url',
          label: 'Profile Photo',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.jpg,.jpeg,.png,.pdf',
          description: 'Upload faculty profile photo or resume'
        }
      ],
      searchableFields: ['title', 'qualification', 'designation'],
      sortableFields: ['title', 'designation', 'experience', 'created_at'],
      editableFields: ['title', 'qualification', 'designation', 'experience', 'specialization', 'file_url']
    },

    'student-achievements': {
      tableName: 'aiml_student_achievements',
      displayField: 'title',
      fields: [
        {
          name: 'category',
          label: 'Category',
          type: 'text',
          required: false,
          size: 'half'
        },
        {
          name: 'title',
          label: 'Achievement Title',
          type: 'text',
          required: true,
          size: 'full'
        },
        {
          name: 'file_url',
          label: 'Certificate/Image',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.pdf,.jpg,.jpeg,.png'
        }
      ],
      searchableFields: ['title', 'category'],
      sortableFields: ['title', 'category', 'created_at'],
      editableFields: ['title', 'category', 'file_url']
    },

    'bos-minutes': {
      tableName: 'aiml_bos_minutes',
      displayField: 'meeting_no',
      fields: [
        {
          name: 'meeting_no',
          label: 'Meeting Number',
          type: 'text',
          placeholder: 'e.g., 1st, 2nd, 3rd',
          required: true,
          size: 'half',
          description: 'Enter the meeting number'
        },
        {
          name: 'meeting_date',
          label: 'Meeting Date',
          type: 'date',
          required: true,
          size: 'half',
          description: 'Select the meeting date'
        },
        {
          name: 'file_url',
          label: 'Meeting Minutes File',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.pdf,.doc,.docx',
          description: 'Upload meeting minutes document (PDF, DOC, or DOCX format)'
        }
      ],
      searchableFields: ['meeting_no', 'meeting_date'],
      sortableFields: ['meeting_date', 'meeting_no', 'created_at'],
      editableFields: ['meeting_no', 'meeting_date', 'file_url']
    },

    'physical-facilities': {
      tableName: 'aiml_physical_facilities',
      displayField: 'title',
      fields: [
        {
          name: 'category',
          label: 'Category',
          type: 'select',
          required: true,
          size: 'half',
          description: 'Select the facility category',
          options: [
            { value: 'Laboratory', label: 'Laboratory' },
            { value: 'Classroom', label: 'Classroom' },
            { value: 'Timetables', label: 'Timetables' },
            { value: 'Seminar Halls', label: 'Seminar Halls' }
          ]
        },
        {
          name: 'title',
          label: 'Facility Name',
          type: 'text',
          placeholder: 'e.g., Advanced AI Research Lab',
          required: true,
          size: 'full',
          description: 'Enter the name of the facility'
        },
        {
          name: 'file_url',
          label: 'Documentation',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.pdf,.doc,.docx'
        }
      ],
      searchableFields: ['title', 'category'],
      sortableFields: ['title', 'category', 'created_at'],
      editableFields: ['category', 'title', 'file_url']
    }
  },

  // ================================================================================================  
  // CSE-DS DEPARTMENT (Data Science)
  // Table Prefix: ds_*
  // Note: Contains modules for Data Science department activities
  //
  // Modules (alphabetical order):
  // • faculty-achievements, faculty-development, hackathons, hackathons-gallery, handbooks
  // • placements, student-achievements, syllabus, technical-association, workshops  
  // ================================================================================================
  'cse-ds': {
    'hackathons': {
      tableName: 'ds_hackathons',
      displayField: 'title',
      fields: [
        {
          name: 'title',
          label: 'Hackathon Title',
          type: 'text',
          placeholder: 'e.g., AI Innovation Challenge 2024',
          required: true,
          size: 'full',
          description: 'Enter the title of the hackathon event'
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          placeholder: 'Enter event details and objectives',
          required: false,
          size: 'full',
          rows: 4,
          description: 'Describe the hackathon event, objectives, and outcomes'
        },
        {
          name: 'event_date',
          label: 'Event Date',
          type: 'date',
          required: false,
          size: 'half',
          description: 'Date when the hackathon took place'
        },
        {
          name: 'file_url',
          label: 'Event Document',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png',
          description: 'Upload event documentation, results, or related materials'
        }
      ],
      searchableFields: ['title', 'description'],
      sortableFields: ['title', 'event_date', 'created_at'],
      editableFields: ['title', 'description', 'event_date', 'file_url']
    },

    'hackathons-gallery': {
      tableName: 'ds_hackathons_gallery',
      displayField: 'title',
      fields: [
        {
          name: 'title',
          label: 'Gallery Title',
          type: 'text',
          placeholder: 'e.g., AI Hackathon 2024 Photos',
          required: true,
          size: 'full',
          description: 'Enter descriptive title for the gallery item'
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          placeholder: 'Enter description of the images',
          required: false,
          size: 'full',
          rows: 3,
          description: 'Describe what the images show'
        },
        {
          name: 'file_url',
          label: 'Image/Gallery',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.jpg,.jpeg,.png,.gif,.pdf',
          description: 'Upload images from hackathon events'
        }
      ],
      searchableFields: ['title', 'description'],
      sortableFields: ['title', 'created_at'],
      editableFields: ['title', 'description', 'file_url']
    },

    'handbooks': {
      tableName: 'ds_handbooks',
      displayField: 'title',
      fields: [
        {
          name: 'title',
          label: 'Handbook Title',
          type: 'text',
          placeholder: 'e.g., Student Handbook 2024-25',
          required: true,
          size: 'full',
          description: 'Enter the title of the handbook'
        },
        {
          name: 'academic_year',
          label: 'Academic Year',
          type: 'select',
          required: true,
          size: 'half',
          options: [
            { value: '2023-24', label: '2023-24' },
            { value: '2024-25', label: '2024-25' },
            { value: '2025-26', label: '2025-26' },
            { value: '2026-27', label: '2026-27' }
          ],
          description: 'Select the academic year for this handbook'
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          placeholder: 'Enter handbook description and contents overview',
          required: false,
          size: 'full',
          rows: 4,
          description: 'Describe the contents and purpose of the handbook'
        },
        {
          name: 'file_url',
          label: 'Handbook Document',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.pdf,.doc,.docx',
          description: 'Upload the handbook document (PDF preferred)'
        }
      ],
      searchableFields: ['title', 'academic_year'],
      sortableFields: ['title', 'academic_year', 'created_at'],
      editableFields: ['title', 'academic_year', 'description', 'file_url']
    },

    'syllabus': {
      tableName: 'ds_syllabus',
      displayField: 'title',
      fields: [
        {
          name: 'title',
          label: 'Course/Subject Title',
          type: 'text',
          placeholder: 'e.g., Data Structures and Algorithms',
          required: true,
          size: 'full',
          description: 'Enter the course or subject title'
        },
        {
          name: 'academic_year',
          label: 'Academic Year',
          type: 'select',
          required: true,
          size: 'half',
          options: [
            { value: '2023-24', label: '2023-24' },
            { value: '2024-25', label: '2024-25' },
            { value: '2025-26', label: '2025-26' },
            { value: '2026-27', label: '2026-27' }
          ],
          description: 'Select the academic year'
        },
        {
          name: 'semester',
          label: 'Semester',
          type: 'select',
          required: false,
          size: 'half',
          options: [
            { value: '1', label: 'Semester 1' },
            { value: '2', label: 'Semester 2' },
            { value: '3', label: 'Semester 3' },
            { value: '4', label: 'Semester 4' },
            { value: '5', label: 'Semester 5' },
            { value: '6', label: 'Semester 6' },
            { value: '7', label: 'Semester 7' },
            { value: '8', label: 'Semester 8' }
          ],
          description: 'Select the semester'
        },
        {
          name: 'file_url',
          label: 'Syllabus Document',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.pdf,.doc,.docx',
          description: 'Upload the syllabus document (PDF preferred)'
        }
      ],
      searchableFields: ['title', 'academic_year', 'semester'],
      sortableFields: ['title', 'academic_year', 'semester', 'created_at'],
      editableFields: ['title', 'academic_year', 'semester', 'file_url']
    },

    'workshops': {
      tableName: 'ds_workshops',
      displayField: 'title',
      fields: [
        {
          name: 'title',
          label: 'Workshop Title',
          type: 'text',
          placeholder: 'e.g., Machine Learning Workshop',
          required: true,
          size: 'full',
          description: 'Enter the title of the workshop'
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          placeholder: 'Enter workshop description and objectives',
          required: false,
          size: 'full',
          rows: 4,
          description: 'Describe the workshop content and learning outcomes'
        },
        {
          name: 'event_date',
          label: 'Workshop Date',
          type: 'date',
          required: false,
          size: 'half',
          description: 'Date when the workshop was conducted'
        },
        {
          name: 'duration',
          label: 'Duration',
          type: 'text',
          placeholder: 'e.g., 2 days, 1 week',
          required: false,
          size: 'half',
          description: 'Duration of the workshop'
        },
        {
          name: 'file_url',
          label: 'Workshop Materials',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.pdf,.doc,.docx,.ppt,.pptx',
          description: 'Upload workshop materials, presentations, or certificates'
        }
      ],
      searchableFields: ['title', 'description'],
      sortableFields: ['title', 'event_date', 'created_at'],
      editableFields: ['title', 'description', 'event_date', 'duration', 'file_url']
    },

    'technical-association': {
      tableName: 'ds_technical_association',
      displayField: 'title',
      fields: [
        {
          name: 'title',
          label: 'Association/Activity Title',
          type: 'text',
          placeholder: 'e.g., IEEE Student Chapter, ACM Club Activity',
          required: true,
          size: 'full',
          description: 'Enter the title of the technical association or activity'
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          placeholder: 'Enter description of the association and its activities',
          required: false,
          size: 'full',
          rows: 4,
          description: 'Describe the association and its technical activities'
        },
        {
          name: 'association_type',
          label: 'Association Type',
          type: 'select',
          required: false,
          size: 'half',
          options: [
            { value: 'IEEE', label: 'IEEE' },
            { value: 'ACM', label: 'ACM' },
            { value: 'CSI', label: 'CSI' },
            { value: 'Professional Body', label: 'Professional Body' },
            { value: 'Student Chapter', label: 'Student Chapter' },
            { value: 'Technical Club', label: 'Technical Club' },
            { value: 'Other', label: 'Other' }
          ],
          description: 'Select the type of technical association'
        },
        {
          name: 'file_url',
          label: 'Documentation',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png',
          description: 'Upload related documents, certificates, or activity photos'
        }
      ],
      searchableFields: ['title', 'description', 'association_type'],
      sortableFields: ['title', 'association_type', 'created_at'],
      editableFields: ['title', 'description', 'association_type', 'file_url']
    },

    'non-teaching-faculty': {
      tableName: 'ds_non_teaching_faculty',
      displayField: 'name',
      fields: [
        {
          name: 'name',
          label: 'Faculty Name',
          type: 'text',
          placeholder: 'e.g., Dr. John Smith',
          required: true,
          size: 'full',
          description: 'Enter the full name of the non-teaching faculty member'
        },
        {
          name: 'designation',
          label: 'Designation',
          type: 'text',
          placeholder: 'e.g., Lab Assistant, Administrative Officer',
          required: true,
          size: 'half',
          description: 'Enter the designation or position'
        },
        {
          name: 'qualification',
          label: 'Qualification',
          type: 'text',
          placeholder: 'e.g., M.Tech, MBA, B.E.',
          required: false,
          size: 'half',
          description: 'Enter educational qualifications'
        },
        {
          name: 'experience',
          label: 'Experience',
          type: 'text',
          placeholder: 'e.g., 5 years',
          required: false,
          size: 'half',
          description: 'Enter years of experience'
        },
        {
          name: 'specialization',
          label: 'Specialization/Area',
          type: 'text',
          placeholder: 'e.g., Laboratory Management, Administration',
          required: false,
          size: 'half',
          description: 'Enter area of specialization or expertise'
        },
        {
          name: 'file_url',
          label: 'Profile Photo/Resume',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.jpg,.jpeg,.png,.pdf,.doc,.docx',
          description: 'Upload profile photo or resume'
        }
      ],
      searchableFields: ['name', 'designation', 'qualification'],
      sortableFields: ['name', 'designation', 'experience', 'created_at'],
      editableFields: ['name', 'designation', 'qualification', 'experience', 'specialization', 'file_url']
    },

    'academic-toppers': {
      tableName: 'ds_academictoppers',
      displayField: 'student_name',
      fields: [
        {
          name: 'student_name',
          label: 'Student Name',
          type: 'text',
          placeholder: 'e.g., Rajesh Kumar',
          required: true,
          size: 'full',
          description: 'Enter the full name of the student'
        },
        {
          name: 'academic_year',
          label: 'Academic Year',
          type: 'select',
          required: true,
          size: 'half',
          options: [
            { value: '2023-24', label: '2023-24' },
            { value: '2024-25', label: '2024-25' },
            { value: '2025-26', label: '2025-26' },
            { value: '2026-27', label: '2026-27' }
          ],
          description: 'Select the academic year'
        },
        {
          name: 'semester',
          label: 'Semester',
          type: 'select',
          required: false,
          size: 'half',
          options: [
            { value: '1', label: 'Semester 1' },
            { value: '2', label: 'Semester 2' },
            { value: '3', label: 'Semester 3' },
            { value: '4', label: 'Semester 4' },
            { value: '5', label: 'Semester 5' },
            { value: '6', label: 'Semester 6' },
            { value: '7', label: 'Semester 7' },
            { value: '8', label: 'Semester 8' }
          ],
          description: 'Select the semester'
        },
        {
          name: 'cgpa',
          label: 'CGPA/Percentage',
          type: 'text',
          placeholder: 'e.g., 9.8 CGPA or 98%',
          required: false,
          size: 'half',
          description: 'Enter CGPA or percentage achieved'
        },
        {
          name: 'rank',
          label: 'Rank',
          type: 'select',
          required: false,
          size: 'half',
          options: [
            { value: '1', label: '1st Rank' },
            { value: '2', label: '2nd Rank' },
            { value: '3', label: '3rd Rank' },
            { value: 'Merit', label: 'Merit Student' }
          ],
          description: 'Select the rank achieved'
        },
        {
          name: 'file_url',
          label: 'Certificate/Document',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.pdf,.jpg,.jpeg,.png,.doc,.docx',
          description: 'Upload certificate or related document'
        }
      ],
      searchableFields: ['student_name', 'academic_year', 'semester', 'rank'],
      sortableFields: ['student_name', 'academic_year', 'semester', 'cgpa', 'rank', 'created_at'],
      editableFields: ['student_name', 'academic_year', 'semester', 'cgpa', 'rank', 'file_url']
    }
  },
  
  // ================================================================================================
  // CSE-DS DEPARTMENT (Computer Science & Data Science)  
  // Table Prefix: ds_*
  // Modules: student-achievements, faculty-achievements, faculty-development, placements, mous, 
  //          physical-facilities, bos-minutes, hackathons, hackathons-gallery, handbooks, 
  //          syllabus, workshops, technical-association, non-teaching-faculty, academic-toppers
  //
  // Modules (alphabetical order):
  // • academic-toppers, bos-minutes, faculty-achievements, faculty-development, hackathons
  // • hackathons-gallery, handbooks, mous, non-teaching-faculty, physical-facilities
  // • placements, student-achievements, syllabus, technical-association, workshops
  // ================================================================================================
  'cse-ds': {
    // CSE-DS department uses ds_* table prefixes
    // Modules available: student-achievements, faculty-achievements, faculty-development, placements, mous, physical-facilities, bos-minutes, hackathons, hackathons-gallery, handbooks, syllabus, workshops, technical-association, non-teaching-faculty, academic-toppers
    'student-achievements': {
      tableName: 'ds_student_achievements',
      displayField: 'title',
      fields: [
        {
          name: 'category',
          label: 'Category',
          type: 'text',
          required: false,
          size: 'half'
        },
        {
          name: 'title',
          label: 'Achievement Title',
          type: 'text',
          required: true,
          size: 'full'
        },
               {
          name: 'file_url',
          label: 'Certificate/Image',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.pdf,.jpg,.jpeg,.png'
        }
      ],
      searchableFields: ['title', 'category'],
      sortableFields: ['title', 'category', 'created_at'],
      editableFields: ['title', 'category', 'description', 'file_url']
    },
  
    'faculty-achievements': {
      tableName: 'ds_faculty_achievements',
      displayField: 'title',
      
      fields: [
         {
          name: 'category',
          label: 'Category',
          type: 'select',
          required: true,
          size: 'half',
          description: 'Select the type of achievement',
          options: [
            { value: 'Journal Publications', label: 'Journal Publications' },
            { value: 'Conferences', label: 'Conferences' },
            { value: 'Book Publications', label: 'Book Publications' },
            { value: 'Certifications', label: 'Certifications' },
            { value: 'Patents', label: 'Patents' },
            { value: 'Research Supervisors', label: 'Research Supervisors' },
            { value: 'Faculty Out-Reach', label: 'Faculty Out-Reach' }
          ]
        },
        {
          name: 'title',
          label: 'Achievement Title',
          type: 'text',
          placeholder: 'e.g., Best Teacher Award, Paper Title, etc.',
          required: true,
          size: 'full',
          description: 'Enter the title of the achievement, publication, or certification'
        },
        {
          name: 'file_url',
          label: 'Supporting Document',
          type: 'file',
          placeholder: 'Upload certificate, publication, or related document',
          required: false,
          size: 'full',
          accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png',
          description: 'Upload supporting document, certificate, or publication (PDF, DOC, DOCX, or Image files max 1MB)'
        }
      ],
      searchableFields: ['title', 'category'],
      sortableFields: ['title', 'category', 'created_at'],
      editableFields: ['title', 'category', 'file_url']
    },
    'faculty-development': {
      tableName: 'ds_faculty_development',
      displayField: 'title',
      fields: [
        {
          name: 'title',
          label: 'Program Title',
          type: 'text',
          placeholder: 'e.g., Data Science Workshop',
          required: true,
          size: 'full',
          description: 'Enter the title of the faculty development program'
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          placeholder: 'e.g., Details about the program',
          required: false,
          size: 'full',
          rows: 4,
          description: 'Enter description of the program'
        },
        {
          name: 'event_date',
          label: 'Event Date',
          type: 'date',
          required: false,
          size: 'half',
          description: 'Date of the faculty development event'
        },
        {
          name: 'document_url',
          label: 'Program Document',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.pdf,.doc,.docx',
          description: 'Upload program document or materials'
        },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          required: false,
          size: 'half',
          options: [
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' }
          ],
          description: 'Set the status of this program'
        }
      ],
      searchableFields: ['title', 'description'],
      sortableFields: ['title', 'event_date', 'status', 'created_at'],
      editableFields: ['title', 'description', 'event_date', 'document_url', 'status']
    },
    'placements': {
      tableName: 'ds_placements',
      displayField: 'title',
      fields: [
        {
          name: 'title',
          label: 'Title',
          type: 'text',
          placeholder: 'Enter title',
          required: false,
          size: 'full',
          description: 'Enter the placement title or description'
        },
        {
          name: 'batch',
          label: 'Batch',
          type: 'text',
          placeholder: 'Enter batch',
          required: true,
          size: 'full',
          description: 'Enter the batch year for this placement'
        },
        {
          name: 'file_url',
          label: 'File Url',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx',
          description: 'File Upload Guidelines\n• Maximum size: 1MB - Files larger than 1MB will be rejected\n• Supported formats: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX\n• Files will be stored in: /uploads/cseai/placements/'
        }
      ],
      searchableFields: ['title', 'batch'],
      sortableFields: ['title', 'batch', 'created_at'],
      editableFields: ['title', 'batch', 'file_url']
    },
    'mous': {
      tableName: 'ds_mous',
      displayField: 'mou_with',
      fields: [
        {
          name: 'mou_with',
          label: 'Organization/Institute',
          type: 'text',
          placeholder: 'e.g., IIT Delhi, Google India, Microsoft',
          required: true,
          size: 'full'
        },
        {
          name: 'from_date',
          label: 'MOU Start Date',
          type: 'text',
          placeholder: 'e.g., 2024-01-15 or 01-01-2024',
          required: true,
          size: 'half'
        },
        {
          name: 'to_date',
          label: 'MOU End Date',
          type: 'text',
          placeholder: 'e.g., 2026-01-14 or 31-12-2026',
          required: true,
          size: 'half'
        },
        {
          name: 'status',
          label: 'MOU Status',
          type: 'select',
          required: true,
          size: 'half',
          options: [
            { value: 'Till Date', label: 'Till Date' },
            { value: 'Expired', label: 'Expired' },
            { value: 'Terminated', label: 'Terminated' },
            
          ]
        }
      ],
      searchableFields: ['mou_with', 'status'],
      sortableFields: ['mou_with', 'from_date', 'to_date', 'status', 'created_at'],
      editableFields: ['mou_with', 'from_date', 'to_date', 'status']
    },
   
   'physical-facilities': {
      tableName: 'ds_physical_facilities',
      displayField: 'title',
      fields: [
        {
          name: 'category',
          label: 'Category',
          type: 'select',
          required: true,
          size: 'half',
          description: 'Select the facility category',
          options: [
            { value: 'Laboratory', label: 'Laboratory' },
            { value: 'Classroom', label: 'Classroom' },
            { value: 'Timetables', label: 'Timetables' },
            { value: 'Seminar Halls', label: 'Seminar Halls' },
            
          ]
        },
        {
          name: 'title',
          label: 'Facility Name',
          type: 'text',
          placeholder: 'e.g., Advanced AI Research Lab',
          required: true,
          size: 'full',
          description: 'Enter the name of the facility'
        },
        {
          name: 'document_url',
          label: 'Documentation',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.pdf,.doc,.docx'
        }
      ],
      searchableFields: ['title', 'category'],
      sortableFields: ['title', 'category', 'created_at'],
      editableFields: ['category', 'title', 'document_url']
    },
     'bos-minutes': {
      tableName: 'ds_bos_minutes',
      displayField: 'title',
      fields: [
        {
          name: 'title',
          label: 'Meeting Title',
          type: 'text',
          placeholder: 'e.g., BOS Meeting - January 2024',
          required: true,
          size: 'full'
        },
        {
          name: 'meeting_date',
          label: 'Meeting Date',
          type: 'date',
          required: true,
          size: 'half'
        },
        {
          name: 'academic_year',
          label: 'Academic Year',
          type: 'select',
          required: true,
          size: 'half',
          options: [
            { value: '2023-24', label: '2023-24' },
            { value: '2024-25', label: '2024-25' },
            { value: '2025-26', label: '2025-26' },
            { value: '2026-27', label: '2026-27' }
          ]
        },
        {
          name: 'description',
          label: 'Meeting Description',
          type: 'textarea',
          placeholder: 'Enter meeting agenda and details',
          required: false,
          size: 'full',
          rows: 4
        },
        {
          name: 'file_url',
          label: 'Meeting Minutes Document',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.pdf,.doc,.docx'
        }
      ],
      searchableFields: ['title', 'academic_year'],
      sortableFields: ['title', 'meeting_date', 'academic_year', 'created_at'],
      editableFields: ['title', 'meeting_date', 'academic_year', 'description', 'file_url']
    }
  }
};

// ================================================================================================
// UTILITY FUNCTIONS
// ================================================================================================

/**
 * Get field configuration for a specific module
 */
export function getModuleFieldConfig(
  dept: string,
  module: string
): ModuleFieldConfig | null {
  return MODULES_FIELD_CONFIG[dept]?.[module] || null;
}

/**
 * Get a specific field from module configuration
 */
export function getModuleField(
  dept: string,
  module: string,
  fieldName: string
): ModuleField | null {
  const config = getModuleFieldConfig(dept, module);
  if (!config) return null;
  return config.fields.find(f => f.name === fieldName) || null;
}

/**
 * Get all editable fields for a module
 */
export function getEditableFields(dept: string, module: string): string[] {
  const config = getModuleFieldConfig(dept, module);
  return config?.editableFields || [];
}

/**
 * Get searchable fields for a module
 */
export function getSearchableFields(dept: string, module: string): string[] {
  const config = getModuleFieldConfig(dept, module);
  return config?.searchableFields || ['title', 'name', 'description'];
}
