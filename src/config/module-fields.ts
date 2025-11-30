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
  sortableFields: ['title', 'category', 'created_at'],
  editableFields: ['title', 'category', 'file_url']
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
          label: 'Profile PDF',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.pdf',
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
      sortableFields: ['title', 'description', 'document_url', 'created_at'],
      editableFields: ['title', 'desscription', 'document_url']
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
    'physical-facilities': {
      tableName: 'cai_physical_facilities',
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
            { value: 'Laboratories', label: 'Laboratories' },
            { value: 'Class Rooms', label: 'Class Rooms' },
            { value: 'Timetables', label: 'Timetables' },
            { value: 'Seminar Halls', label: 'Seminar Halls' }
          ]
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
            { value: 'FDP Attended', label: 'Attended' },
            { value: 'FDP Conducted', label: 'Conducted' },
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
            { value: 'extracurricular activities', label: 'Extracurricular Activities' },
            { value: 'laboratories', label: 'Laboratories' }
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
      displayField: 'activity_name',
      fields: [
        {
          name: 'activity_name',
          label: 'Activity Name',
          type: 'text',
          placeholder: 'e.g., Maitri Association, Tech Club',
          required: true,
          size: 'full',
          description: 'Name of the extra-curricular activity/association'
        },
        {
          name: 'category',
          label: 'Category',
          type: 'select',
          required: true,
          size: 'half',
          description: 'Type of activity',
          options: [
            { value: 'social_service', label: 'Social Service' },
            { value: 'cultural', label: 'Cultural' },
            { value: 'sports', label: 'Sports' },
            { value: 'technical', label: 'Technical' },
            { value: 'professional', label: 'Professional Society' },
            { value: 'community', label: 'Community Service' }
          ]
        },
        {
          name: 'academic_year',
          label: 'Academic Year',
          type: 'text',
          placeholder: 'e.g., 2024-25',
          required: false,
          size: 'half',
          description: 'Academic year of the activity'
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          placeholder: 'Enter detailed description of the activity',
          required: true,
          size: 'full',
          rows: 6,
          description: 'Detailed information about the activity'
        },
        {
          name: 'faculty_coordinator_name',
          label: 'Faculty Coordinator Name',
          type: 'text',
          placeholder: 'e.g., Mr. M Yesu Sekharam',
          required: false,
          size: 'full',
          description: 'Name of the primary faculty coordinator'
        },
        {
          name: 'faculty_coordinator_designation',
          label: 'Coordinator Designation',
          type: 'text',
          placeholder: 'e.g., Assistant Professor',
          required: false,
          size: 'half',
          description: 'Designation of the coordinator'
        },
        {
          name: 'image_url',
          label: 'Activity Cover Image',
          type: 'file',
          required: false,
          size: 'half',
          accept: '.jpg,.jpeg,.png,.gif,.webp',
          description: 'Cover image for the activity'
        },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          required: true,
          size: 'half',
          options: [
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
            { value: 'archived', label: 'Archived' }
          ],
          description: 'Activity status'
        }
      ],
      searchableFields: ['activity_name', 'category', 'faculty_coordinator_name'],
      sortableFields: ['activity_name', 'category', 'academic_year', 'created_at'],
      editableFields: [
        'activity_name',
        'category',
        'academic_year',
        'description',
        'faculty_coordinator_name',
        'faculty_coordinator_designation',
        'image_url',
        'status'
      ]
    },
    'activity-coordinators': {
      tableName: 'cai_activity_coordinators',
      displayField: 'name',
      fields: [
        {
          name: 'activity_id',
          label: 'Activity ID',
          type: 'number',
          placeholder: 'e.g., 1',
          required: true,
          size: 'half',
          hidden: true,
          description: 'Internal: Activity reference ID'
        },
        {
          name: 'name',
          label: 'Coordinator Name',
          type: 'text',
          placeholder: 'e.g., Mr. M Yesu Sekharam',
          required: true,
          size: 'full',
          description: 'Name of the coordinator'
        },
        {
          name: 'designation',
          label: 'Designation',
          type: 'text',
          placeholder: 'e.g., Assistant Professor',
          required: false,
          size: 'half',
          description: 'Job designation'
        },
        {
          name: 'role',
          label: 'Role Type',
          type: 'select',
          required: true,
          size: 'half',
          options: [
            { value: 'faculty_coordinator', label: 'Faculty Coordinator' },
            { value: 'student_coordinator', label: 'Student Coordinator' },
            { value: 'co_coordinator', label: 'Co-Coordinator' }
          ],
          description: 'Coordinator role type'
        },
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          placeholder: 'e.g., name@example.com',
          required: false,
          size: 'half',
          description: 'Contact email address'
        },
        {
          name: 'phone',
          label: 'Phone',
          type: 'text',
          placeholder: 'e.g., +91 9876543210',
          required: false,
          size: 'half',
          description: 'Contact phone number'
        },
        {
          name: 'order_seq',
          label: 'Display Order',
          type: 'number',
          placeholder: 'e.g., 1',
          required: false,
          size: 'half',
          description: 'Order of display in frontend'
        }
      ],
      searchableFields: ['name', 'designation', 'role'],
      sortableFields: ['name', 'role', 'order_seq', 'created_at'],
      editableFields: ['name', 'designation', 'role', 'email', 'phone', 'order_seq']
    },
    'activity-events': {
      tableName: 'cai_activity_events',
      displayField: 'event_title',
      fields: [
        {
          name: 'activity_id',
          label: 'Activity ID',
          type: 'number',
          placeholder: 'e.g., 1',
          required: true,
          size: 'half',
          hidden: true,
          description: 'Internal: Activity reference ID'
        },
        {
          name: 'academic_year',
          label: 'Academic Year',
          type: 'text',
          placeholder: 'e.g., 2023-24',
          required: true,
          size: 'half',
          description: 'Year the event was conducted'
        },
        {
          name: 'event_title',
          label: 'Event Title',
          type: 'text',
          placeholder: 'e.g., Maitri Event 2023',
          required: true,
          size: 'full',
          description: 'Title or name of the event'
        },
        {
          name: 'event_date',
          label: 'Event Date',
          type: 'date',
          required: false,
          size: 'half',
          description: 'Date the event was conducted'
        },
        {
          name: 'description',
          label: 'Event Description',
          type: 'textarea',
          placeholder: 'Enter event details and outcomes',
          required: false,
          size: 'full',
          rows: 4,
          description: 'Detailed description of the event'
        },
        {
          name: 'file_url',
          label: 'Event Document/Report',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png',
          description: 'Upload event report, certificate, or document'
        },
        {
          name: 'image_url',
          label: 'Event Photo',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.jpg,.jpeg,.png,.gif,.webp',
          description: 'Upload event photo/image'
        }
      ],
      searchableFields: ['event_title', 'academic_year'],
      sortableFields: ['event_title', 'event_date', 'academic_year', 'created_at'],
      editableFields: ['academic_year', 'event_title', 'event_date', 'description', 'file_url', 'image_url']
    },
    'activity-gallery': {
      tableName: 'cai_activity_gallery',
      displayField: 'image_title',
      fields: [
        {
          name: 'activity_id',
          label: 'Activity ID',
          type: 'number',
          placeholder: 'e.g., 1',
          required: true,
          size: 'half',
          hidden: true,
          description: 'Internal: Activity reference ID'
        },
        {
          name: 'academic_year',
          label: 'Academic Year',
          type: 'text',
          placeholder: 'e.g., 2024-25',
          required: false,
          size: 'half',
          description: 'Year of the activity'
        },
        {
          name: 'image_url',
          label: 'Gallery Image',
          type: 'file',
          required: true,
          size: 'full',
          accept: '.jpg,.jpeg,.png,.gif,.webp',
          description: 'Upload image for gallery (JPG, PNG, GIF, or WebP)'
        },
        {
          name: 'image_title',
          label: 'Image Caption/Title',
          type: 'text',
          placeholder: 'e.g., Maitri Event Group Photo',
          required: false,
          size: 'full',
          description: 'Caption or title for the image'
        },
        {
          name: 'description',
          label: 'Image Description',
          type: 'textarea',
          placeholder: 'Enter description of the image',
          required: false,
          size: 'full',
          rows: 3,
          description: 'Detailed description of what the image shows'
        },
        {
          name: 'order_seq',
          label: 'Display Order',
          type: 'number',
          placeholder: 'e.g., 1',
          required: false,
          size: 'half',
          description: 'Order of display in gallery'
        }
      ],
      searchableFields: ['image_title', 'academic_year'],
      sortableFields: ['image_title', 'academic_year', 'order_seq', 'created_at'],
      editableFields: ['academic_year', 'image_url', 'image_title', 'description', 'order_seq']
    },
    'department-overview': {
      tableName: 'cai_department_overview',
      displayField: 'hod_name',
      fields: [
        {
          name: 'hod_name',
          label: 'HOD Name',
          type: 'text',

          required: true,
          size: 'full',
          description: 'Enter the full name of the Head of Department'
        },
        {
          name: 'hod_email',
          label: 'HOD Email',
          type: 'email',

          required: false,
          size: 'half',
          description: 'Enter HOD email address'
        },
        {
          name: 'hod_qualification',
          label: 'HOD Qualification',
          type: 'text',
          required: false,
          size: 'half',
          description: 'Enter highest educational qualification'
        },
        {
          name: 'hod_image_url',
          label: 'HOD Image',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.jpg,.jpeg,.png,.gif,.webp',
          description: 'Upload HOD profile image (JPG, PNG, GIF, or WebP format)'
        },
        {
          name: 'description',
          label: 'Department Description',
          type: 'textarea',
          placeholder: 'Enter department description and overview',
          required: false,
          size: 'full',
          rows: 6,
          description: 'Detailed description of the department'
        }
      ],
      searchableFields: ['hod_name', 'hod_email'],
      sortableFields: ['hod_name', 'created_at'],
      editableFields: ['hod_name', 'hod_email', 'hod_qualification', 'hod_image_url', 'description']
    }
  },

  // ================================================================================================
  'cst': {


    'faculty': {
      tableName: 'cst_faculty',
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
          label: 'Profile PDF',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.pdf',
          description: 'Upload profile photo or image (JPG, PNG, GIF, or WebP)'
        }
      ],
      searchableFields: ['title', 'designation'],
      sortableFields: ['title', 'designation', 'created_at'],
      editableFields: ['title', 'qualification', 'designation', 'profileUrl']
    },
    'workshops': {
      tableName: 'cst_workshops',
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

            { value: 'Guest Lecturers/Seminars', label: 'Guest Lecturers/Seminars' },
            { value: 'Workshops/SOC', label: 'Workshops/SOC' }
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
      sortableFields: ['title', 'category', 'created_at'],
      editableFields: ['title', 'category', 'file_url']
    },
    'technical-faculty': {
      tableName: 'cst_technical_faculty',
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
      tableName: 'cst_technical_association',
      displayField: 'batch',
      fields: [
        {
          name: 'title',
          label: 'Title',
          type: 'text',

          required: true,
          size: 'full',
          description: 'Enter the batch year for this placement'
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
    'non-teaching-faculty': {
      tableName: 'cst_non_teaching_faculty',
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
      tableName: 'cst_academictoppers',
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
      tableName: 'cst_faculty_achievements',
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
      tableName: 'cst_faculty_development_programs',
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
            { value: 'FDP Attended', label: 'Attended' },
            { value: 'FDP Conducted', label: 'Conducted' },
            { value: 'Workshops/Training', label: 'Workshops/Training' },

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
      tableName: 'cst_placements',
      displayField: 'batch',
      fields: [
        {
          name: 'title',
          label: 'Title',
          type: 'text',

          required: true,
          size: 'full',
          description: 'Enter the batch year for this placement'
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
      tableName: 'cst_hackathons_gallery',
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
            { value: 'toppers', label: 'Academic Toppers' },
            { value: 'technical', label: 'Technical Association' },
            { value: 'activities', label: 'Extracurricular Activities' },
            { value: 'labs', label: 'Laboratories' },
            { value: 'placements', label: 'Placements' },
            { value: 'training', label: 'Training Activities' },
            { value: 'gate', label: 'GATE' },
            { value: 'honour', label: 'Roll of Honour' },
            { value: 'workshops', label: 'Workshops' },
            { value: 'lectures', label: 'Guest Lecturers' },
            { value: 'faculty', label: 'Faculty Development Programs' },


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
      tableName: 'cst_bos_members',
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
      tableName: 'cst_bos_minutes',
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
      tableName: 'cst_eresources',
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
      tableName: 'cst_hackathons',
      displayField: 'title',
      fields: [

        {
          name: 'academic_year',
          label: 'Academic Year',
          type: 'text',
          placeholder: 'e.g., 2024-25',
          required: true,
          size: 'half'
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
      sortableFields: ['title', 'academic_year', 'created_at'],
      editableFields: ['title', 'academic_year', 'brochure_url', 'winners_url']
    },
    'newsletters': {
      tableName: 'cst_newsletters',
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
          name: 'file_url',
          label: 'Newsletter PDF',
          type: 'file',
          required: true,
          size: 'full',
          accept: '.pdf'
        }
      ],
      searchableFields: ['title', 'year', 'volume'],
      sortableFields: ['title', 'volume', 'issue', 'year'],
      editableFields: ['title', 'volume', 'issue', 'year', 'file_url']
    },
    'merit-scholarships': {
      tableName: 'cst_merit_scholarships',
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
      tableName: 'cst_mous',
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
        },
        {
          name: 'file_url',
          label: 'MOU Document',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png',
          description: 'Upload the MOU document or agreement (PDF, DOC, DOCX, or Image files)'
        }
      ],
      searchableFields: ['mou_with', 'status'],
      sortableFields: ['mou_with', 'from_date', 'to_date', 'status', 'created_at'],
      editableFields: ['mou_with', 'from_date', 'to_date', 'status', 'file_url']
    },
    'industry-programs': {
      tableName: 'cst_industry_programs',
      displayField: 'title',
      fields: [
        {
          name: 'title',
          label: 'Program Title',
          type: 'text',
          placeholder: 'e.g., Industry Interaction Session, Corporate Training',
          required: true,
          size: 'full',
          description: 'Enter the title of the industry program or interaction'
        },
        {
          name: 'academic_year',
          label: 'Academic Year',
          type: 'text',
          placeholder: 'e.g., 2024-25',
          required: true,
          size: 'half',
          description: 'Enter the academic year'
        },

        {
          name: 'file_url',
          label: 'Program Document/Brochure',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png',
          description: 'Upload program details, brochure, or related document (PDF, DOC, DOCX, or Image files)'
        }
      ],
      searchableFields: ['title', 'academic_year'],
      sortableFields: ['title', 'academic_year'],
      editableFields: ['title', 'academic_year', 'file_url']
    },
    'syllabus': {
      tableName: 'cst_syllabus',
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
      tableName: 'cst_student_achievements',
      displayField: 'title',
      fields: [
        {
          name: 'category',
          label: 'Category',
          type: 'select',
          required: false,
          size: 'half',
          options: [
            { value: 'Internships', label: 'Internships' },
            { value: 'Journals', label: 'Journals' },
            { value: 'Conference Publications', label: 'Conference Publications' },
            { value: 'NPTEL/Other Certifications', label: 'NPTEL/Other Certifications' },
            { value: 'Global Certifications', label: 'Global Certifications' },
            { value: 'Community Service Project', label: 'Community Service Project' },
            { value: 'Student Research Projects', label: 'Student Research Projects' },
            { value: 'Awards', label: 'Awards' },
            { value: 'GIF', label: 'GIF' }
          ]
        },
        {
          name: 'year',
          label: 'Year',
          type: 'text',
          placeholder: 'e.g., 2024',
          required: false,
          size: 'half',
          description: 'Academic year'
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
      searchableFields: ['title', 'category', 'year'],
      sortableFields: ['title', 'category', 'year', 'created_at'],
      editableFields: ['title', 'category', 'year', 'file_url']
    },
    'extra-curricular': {
      tableName: 'cst_extracurricular_activities',
      displayField: 'activity_name',
      fields: [
        {
          name: 'activity_name',
          label: 'Activity Name',
          type: 'text',
          placeholder: 'e.g., Maitri Association, Tech Club',
          required: true,
          size: 'full',
          description: 'Name of the extra-curricular activity/association'
        },
        {
          name: 'category',
          label: 'Category',
          type: 'select',
          required: true,
          size: 'half',
          description: 'Type of activity',
          options: [
            { value: 'social_service', label: 'Social Service' },
            { value: 'cultural', label: 'Cultural' },
            { value: 'sports', label: 'Sports' },
            { value: 'technical', label: 'Technical' },
            { value: 'professional', label: 'Professional Society' },
            { value: 'community', label: 'Community Service' }
          ]
        },
        {
          name: 'academic_year',
          label: 'Academic Year',
          type: 'text',
          placeholder: 'e.g., 2024-25',
          required: false,
          size: 'half',
          description: 'Academic year of the activity'
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          placeholder: 'Enter detailed description of the activity',
          required: true,
          size: 'full',
          rows: 6,
          description: 'Detailed information about the activity'
        },
        {
          name: 'faculty_coordinator_name',
          label: 'Faculty Coordinator Name',
          type: 'text',
          placeholder: 'e.g., Mr. M Yesu Sekharam',
          required: false,
          size: 'full',
          description: 'Name of the primary faculty coordinator'
        },
        {
          name: 'faculty_coordinator_designation',
          label: 'Coordinator Designation',
          type: 'text',
          placeholder: 'e.g., Assistant Professor',
          required: false,
          size: 'half',
          description: 'Designation of the coordinator'
        },
        {
          name: 'image_url',
          label: 'Activity Cover Image',
          type: 'file',
          required: false,
          size: 'half',
          accept: '.jpg,.jpeg,.png,.gif,.webp',
          description: 'Cover image for the activity'
        },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          required: true,
          size: 'half',
          options: [
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
            { value: 'archived', label: 'Archived' }
          ],
          description: 'Activity status'
        }
      ],
      searchableFields: ['activity_name', 'category', 'faculty_coordinator_name'],
      sortableFields: ['activity_name', 'category', 'academic_year', 'created_at'],
      editableFields: [
        'activity_name',
        'category',
        'academic_year',
        'description',
        'faculty_coordinator_name',
        'faculty_coordinator_designation',
        'image_url',
        'status'
      ]
    },
    'activity-coordinators': {
      tableName: 'cst_activity_coordinators',
      displayField: 'name',
      fields: [
        {
          name: 'activity_id',
          label: 'Activity ID',
          type: 'number',
          placeholder: 'e.g., 1',
          required: true,
          size: 'half',
          hidden: true,
          description: 'Internal: Activity reference ID'
        },
        {
          name: 'name',
          label: 'Coordinator Name',
          type: 'text',
          placeholder: 'e.g., Mr. M Yesu Sekharam',
          required: true,
          size: 'full',
          description: 'Name of the coordinator'
        },
        {
          name: 'designation',
          label: 'Designation',
          type: 'text',
          placeholder: 'e.g., Assistant Professor',
          required: false,
          size: 'half',
          description: 'Job designation'
        },
        {
          name: 'role',
          label: 'Role Type',
          type: 'select',
          required: true,
          size: 'half',
          options: [
            { value: 'faculty_coordinator', label: 'Faculty Coordinator' },
            { value: 'student_coordinator', label: 'Student Coordinator' },
            { value: 'co_coordinator', label: 'Co-Coordinator' }
          ],
          description: 'Coordinator role type'
        },
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          placeholder: 'e.g., name@example.com',
          required: false,
          size: 'half',
          description: 'Contact email address'
        },
        {
          name: 'phone',
          label: 'Phone',
          type: 'text',
          placeholder: 'e.g., +91 9876543210',
          required: false,
          size: 'half',
          description: 'Contact phone number'
        },
        {
          name: 'order_seq',
          label: 'Display Order',
          type: 'number',
          placeholder: 'e.g., 1',
          required: false,
          size: 'half',
          description: 'Order of display in frontend'
        }
      ],
      searchableFields: ['name', 'designation', 'role'],
      sortableFields: ['name', 'role', 'order_seq', 'created_at'],
      editableFields: ['name', 'designation', 'role', 'email', 'phone', 'order_seq']
    },
    'activity-events': {
      tableName: 'cst_activity_events',
      displayField: 'event_title',
      fields: [
        {
          name: 'activity_id',
          label: 'Activity ID',
          type: 'number',
          placeholder: 'e.g., 1',
          required: true,
          size: 'half',
          hidden: true,
          description: 'Internal: Activity reference ID'
        },
        {
          name: 'academic_year',
          label: 'Academic Year',
          type: 'text',
          placeholder: 'e.g., 2023-24',
          required: true,
          size: 'half',
          description: 'Year the event was conducted'
        },
        {
          name: 'event_title',
          label: 'Event Title',
          type: 'text',
          placeholder: 'e.g., Maitri Event 2023',
          required: true,
          size: 'full',
          description: 'Title or name of the event'
        },
        {
          name: 'event_date',
          label: 'Event Date',
          type: 'date',
          required: false,
          size: 'half',
          description: 'Date the event was conducted'
        },
        {
          name: 'description',
          label: 'Event Description',
          type: 'textarea',
          placeholder: 'Enter event details and outcomes',
          required: false,
          size: 'full',
          rows: 4,
          description: 'Detailed description of the event'
        },
        {
          name: 'file_url',
          label: 'Event Document/Report',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png',
          description: 'Upload event report, certificate, or document'
        },
        {
          name: 'image_url',
          label: 'Event Photo',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.jpg,.jpeg,.png,.gif,.webp',
          description: 'Upload event photo/image'
        }
      ],
      searchableFields: ['event_title', 'academic_year'],
      sortableFields: ['event_title', 'event_date', 'academic_year', 'created_at'],
      editableFields: ['academic_year', 'event_title', 'event_date', 'description', 'file_url', 'image_url']
    },
    'activity-gallery': {
      tableName: 'cst_activity_gallery',
      displayField: 'image_title',
      fields: [
        {
          name: 'activity_id',
          label: 'Activity ID',
          type: 'number',
          placeholder: 'e.g., 1',
          required: true,
          size: 'half',
          hidden: true,
          description: 'Internal: Activity reference ID'
        },
        {
          name: 'academic_year',
          label: 'Academic Year',
          type: 'text',
          placeholder: 'e.g., 2024-25',
          required: false,
          size: 'half',
          description: 'Year of the activity'
        },
        {
          name: 'image_url',
          label: 'Gallery Image',
          type: 'file',
          required: true,
          size: 'full',
          accept: '.jpg,.jpeg,.png,.gif,.webp',
          description: 'Upload image for gallery (JPG, PNG, GIF, or WebP)'
        },
        {
          name: 'image_title',
          label: 'Image Caption/Title',
          type: 'text',
          placeholder: 'e.g., Maitri Event Group Photo',
          required: false,
          size: 'full',
          description: 'Caption or title for the image'
        },
        {
          name: 'description',
          label: 'Image Description',
          type: 'textarea',
          placeholder: 'Enter description of the image',
          required: false,
          size: 'full',
          rows: 3,
          description: 'Detailed description of what the image shows'
        },
        {
          name: 'order_seq',
          label: 'Display Order',
          type: 'number',
          placeholder: 'e.g., 1',
          required: false,
          size: 'half',
          description: 'Order of display in gallery'
        }
      ],
      searchableFields: ['image_title', 'academic_year'],
      sortableFields: ['image_title', 'academic_year', 'order_seq', 'created_at'],
      editableFields: ['academic_year', 'image_url', 'image_title', 'description', 'order_seq']
    },
    'department-overview': {
      tableName: 'cst_department_overview',
      displayField: 'hod_name',
      fields: [
        {
          name: 'hod_name',
          label: 'HOD Name',
          type: 'text',

          required: true,
          size: 'full',
          description: 'Enter the full name of the Head of Department'
        },
        {
          name: 'hod_email',
          label: 'HOD Email',
          type: 'email',

          required: false,
          size: 'half',
          description: 'Enter HOD email address'
        },
        {
          name: 'hod_qualification',
          label: 'HOD Qualification',
          type: 'text',
          required: false,
          size: 'half',
          description: 'Enter highest educational qualification'
        },
        {
          name: 'hod_image_url',
          label: 'HOD Image',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.jpg,.jpeg,.png,.gif,.webp',
          description: 'Upload HOD profile image (JPG, PNG, GIF, or WebP format)'
        },
        {
          name: 'description',
          label: 'Department Description',
          type: 'textarea',
          placeholder: 'Enter department description and overview',
          required: false,
          size: 'full',
          rows: 6,
          description: 'Detailed description of the department'
        }
      ],
      searchableFields: ['hod_name', 'hod_email'],
      sortableFields: ['hod_name', 'created_at'],
      editableFields: ['hod_name', 'hod_email', 'hod_qualification', 'hod_image_url', 'description']
    },
    'gate': {
      tableName: 'cst_gate',
      displayField: 'name',
      fields: [
        {
          name: 'rollno',
          label: 'Roll Number',
          type: 'text',

          required: true,
          size: 'half',
          description: 'Student roll number'
        },
        {
          name: 'name',
          label: 'Student Name',
          type: 'text',

          required: true,
          size: 'half',
          description: 'Full name of the student'
        },
        {
          name: 'score',
          label: 'GATE Score',
          type: 'number',
          placeholder: 'Enter score',
          required: true,
          size: 'half',
          description: 'GATE exam score'
        },
        {
          name: 'year',
          label: 'Year',
          type: 'text',
          placeholder: 'e.g., 2024',
          required: true,
          size: 'half',
          description: 'Academic year'
        }
      ],
      searchableFields: ['name', 'roll_no'],
      sortableFields: ['name', 'score', 'year', 'created_at'],
      editableFields: ['name', 'score', 'year']
    },
    'roll-of-honour': {
      tableName: 'cst_roll_of_honour',
      displayField: 'name',
      fields: [
        {
          name: 'rollno',
          label: 'Roll Number',
          type: 'text',
          placeholder: 'e.g., CST2021001',
          required: true,
          size: 'half',
          description: 'Student roll number'
        },
        {
          name: 'name',
          label: 'Student Name',
          type: 'text',
          placeholder: 'Enter full name',
          required: true,
          size: 'half',
          description: 'Full name of the student'
        },
        {
          name: 'batch',
          label: 'Batch',
          type: 'text',
          placeholder: 'e.g., 2024',
          required: true,
          size: 'half',
          description: 'Batch/Year'
        },
        {
          name: 'cgpa',
          label: 'CGPA',
          type: 'text',
          placeholder: 'e.g., 9.5',
          required: true,
          size: 'half',
          description: 'Cumulative Grade Point Average'
        }
      ],
      searchableFields: ['name', 'rollno', 'batch'],
      sortableFields: ['name', 'cgpa', 'batch', 'created_at'],
      editableFields: ['name', 'batch', 'cgpa']
    },
    'sahaya-events': {
      tableName: 'cst_sahaya_events',
      displayField: 'title',
      fields: [
        {
          name: 'title',
          label: 'Title',
          type: 'text',
          placeholder: 'e.g., Sahaya Events',
          required: true,
          size: 'full',
          description: 'Enter the title for the Sahaya event section',
          validation: {
            max: 1000,
            message: 'Title must not exceed 1000 characters'
          }
        },
        {
          name: 'year',
          label: 'Year',
          type: 'text',
          placeholder: 'e.g., 2024',
          required: true,
          size: 'half',
          description: 'Enter the year of the event'
        },
        {
          name: 'category',
          label: 'Category',
          type: 'select',
          required: true,
          size: 'half',
          description: 'Select the category for this event',
          options: [
            { value: 'ecactivities', label: 'EC Activities' },
            { value: 'sahaya', label: 'Sahaya' }
          ]
        },
        {
          name: 'file_url',
          label: 'Event Document/PDF',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png',
          description: 'Upload event document, certificate, or related file (PDF, DOC, DOCX, or Image files)'
        }
      ],
      searchableFields: ['title', 'year', 'category'],
      sortableFields: ['title', 'year', 'category', 'created_at'],
      editableFields: ['title', 'year', 'category', 'file_url']
    }
  },
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
    'bos-members': {
      tableName: 'civil_bos_members',
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
      tableName: 'civil_bos_minutes',
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
    'extra-curricular': {
      tableName: 'civil_extracurricular_activities',
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
        },
        {
          name: 'laboratory_gallery',
          label: 'Laboratory Gallery',
          type: 'select',
          required: false,
          size: 'full',
          description: 'Select laboratory from gallery (will be populated from database)',
          options: []
        }
      ],
      searchableFields: ['name', 'category'],
      editableFields: ['category', 'name', 'description', 'laboratory_gallery']
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
    'department-overview': {
      tableName: 'bsh_department_overview',
      displayField: 'hod_name',
      fields: [
        {
          name: 'hod_name',
          label: 'HOD Name',
          type: 'text',
          placeholder: 'e.g., Dr. John Smith',
          required: true,
          size: 'full',
          description: 'Enter the full name of the Head of Department'
        },
        {
          name: 'hod_email',
          label: 'HOD Email',
          type: 'email',
          placeholder: 'e.g., hod@example.com',
          required: false,
          size: 'half',
          description: 'Enter HOD email address'
        },
        {
          name: 'hod_qualification',
          label: 'HOD Qualification',
          type: 'text',
          placeholder: 'e.g., Ph.D. in Science',
          required: false,
          size: 'half',
          description: 'Enter highest educational qualification'
        },
        {
          name: 'hod_image_url',
          label: 'HOD Image',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.jpg,.jpeg,.png,.gif,.webp',
          description: 'Upload HOD profile image (JPG, PNG, GIF, or WebP format)'
        },
        {
          name: 'description',
          label: 'Department Description',
          type: 'textarea',
          placeholder: 'Enter department description and overview',
          required: false,
          size: 'full',
          rows: 6,
          description: 'Detailed description of the department'
        }
      ],
      searchableFields: ['hod_name', 'hod_email'],
      sortableFields: ['hod_name', 'created_at'],
      editableFields: ['hod_name', 'hod_email', 'hod_qualification', 'hod_image_url', 'description']
    },
    'syllabus': {
      tableName: 'bsh_syllabus',
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
    'workshops': {
      tableName: 'mba_workshops',
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
      sortableFields: ['title', 'category', 'created_at'],
      editableFields: ['title', 'category', 'file_url']
    },
    'faculty': {
      tableName: 'mba_faculty',
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
          label: 'Profile PDF',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.pdf',
          description: 'Upload profile photo or image (JPG, PNG, GIF, or WebP)'
        }
      ],
      searchableFields: ['title', 'designation'],
      sortableFields: ['title', 'designation', 'created_at'],
      editableFields: ['title', 'qualification', 'designation', 'profileUrl']
    },
    'technical-faculty': {
      tableName: 'mba_technical_faculty',
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
      tableName: 'mba_technical_association',
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
      sortableFields: ['title', 'description', 'document_url', 'created_at'],
      editableFields: ['title', 'desscription', 'document_url']
    },
    'non-teaching-faculty': {
      tableName: 'mba_non_teaching_faculty',
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
      tableName: 'mba_academictoppers',
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
      tableName: 'mba_faculty_achievements',
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
    'placements': {
      tableName: 'mba_placements',
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
          description: 'File Upload Guidelines\n• Maximum size: 1MB - Files larger than 1MB will be rejected\n• Supported formats: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX\n• Files will be stored in: /uploads/mba/placements/'
        }
      ],
      searchableFields: ['title', 'batch'],
      sortableFields: ['title', 'batch', 'created_at'],
      editableFields: ['title', 'batch', 'file_url']
    },
    'hackathons-gallery': {
      tableName: 'mba_hackathons_gallery',
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
            { value: 'extracurricular activities', label: 'Extracurricular Activities' },
            { value: 'laboratory', label: 'Laboratory' }
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
      tableName: 'mba_bos_members',
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
      tableName: 'mba_bos_minutes',
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
    'hackathons': {
      tableName: 'mba_hackathons',
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
    'merit-scholarships': {
      tableName: 'mba_merit_scholarships',
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
      tableName: 'mba_mous',
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
      tableName: 'mba_syllabus',
      displayField: 'title',
      fields: [
        {
          name: 'type',
          label: 'Type',
          type: 'select',
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
      tableName: 'mba_student_achievements',
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
      tableName: 'mba_extracurricular_activities',
      displayField: 'title',
      fields: [
        {
          name: 'title',
          label: 'Newsletter/Magazine Title',
          type: 'text',
          placeholder: 'e.g., Tech Insights, Business Today',
          required: true,
          size: 'full',
          description: 'Enter the name of the newsletter or magazine'
        },
        {
          name: 'volume',
          label: 'Volume Number',
          type: 'number',
          placeholder: 'e.g., 5',
          required: false,
          size: 'half',
          description: 'Volume number (numeric only)'
        },
        {
          name: 'issue',
          label: 'Issue Number',
          type: 'number',
          placeholder: 'e.g., 2',
          required: false,
          size: 'half',
          description: 'Issue number (numeric only)'
        },
        {
          name: 'academic_year',
          label: 'Academic Year',
          type: 'text',
          placeholder: 'e.g., 2024-25',
          required: true,
          size: 'half',
          description: 'Academic year of publication'
        },
        {
          name: 'publish_date',
          label: 'Publish Date',
          type: 'date',
          required: false,
          size: 'half',
          description: 'Date of publication'
        },
        {
          name: 'pdf_url',
          label: 'PDF Document',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.pdf',
          description: 'Upload newsletter/magazine PDF (max 5MB)'
        },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          required: false,
          size: 'half',
          options: [
            { value: 'published', label: 'Published' },
            { value: 'draft', label: 'Draft' },
            { value: 'archived', label: 'Archived' }
          ],
          description: 'Publication status'
        }
      ],
      searchableFields: ['title', 'volume', 'issue', 'academic_year'],
      sortableFields: ['title', 'publish_date', 'academic_year', 'volume', 'issue'],
      editableFields: ['title', 'volume', 'issue', 'academic_year', 'publish_date', 'pdf_url', 'status']
    },
    'activity-coordinators': {
      tableName: 'mba_activity_coordinators',
      displayField: 'name',
      fields: [
        {
          name: 'activity_id',
          label: 'Activity ID',
          type: 'number',
          placeholder: 'e.g., 1',
          required: true,
          size: 'half',
          hidden: true,
          description: 'Internal: Activity reference ID'
        },
        {
          name: 'name',
          label: 'Coordinator Name',
          type: 'text',
          placeholder: 'e.g., Mr. M Yesu Sekharam',
          required: true,
          size: 'full',
          description: 'Name of the coordinator'
        },
        {
          name: 'designation',
          label: 'Designation',
          type: 'text',
          placeholder: 'e.g., Assistant Professor',
          required: false,
          size: 'half',
          description: 'Job designation'
        },
        {
          name: 'role',
          label: 'Role Type',
          type: 'select',
          required: true,
          size: 'half',
          options: [
            { value: 'faculty_coordinator', label: 'Faculty Coordinator' },
            { value: 'student_coordinator', label: 'Student Coordinator' },
            { value: 'co_coordinator', label: 'Co-Coordinator' }
          ],
          description: 'Coordinator role type'
        },
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          placeholder: 'e.g., name@example.com',
          required: false,
          size: 'half',
          description: 'Contact email address'
        },
        {
          name: 'phone',
          label: 'Phone',
          type: 'text',
          placeholder: 'e.g., +91 9876543210',
          required: false,
          size: 'half',
          description: 'Contact phone number'
        },
        {
          name: 'order_seq',
          label: 'Display Order',
          type: 'number',
          placeholder: 'e.g., 1',
          required: false,
          size: 'half',
          description: 'Order of display in frontend'
        }
      ],
      searchableFields: ['name', 'designation', 'role'],
      sortableFields: ['name', 'role', 'order_seq', 'created_at'],
      editableFields: ['name', 'designation', 'role', 'email', 'phone', 'order_seq']
    },
    'activity-events': {
      tableName: 'mba_activity_events',
      displayField: 'event_title',
      fields: [
        {
          name: 'activity_id',
          label: 'Activity ID',
          type: 'number',
          placeholder: 'e.g., 1',
          required: true,
          size: 'half',
          hidden: true,
          description: 'Internal: Activity reference ID'
        },
        {
          name: 'academic_year',
          label: 'Academic Year',
          type: 'text',
          placeholder: 'e.g., 2023-24',
          required: true,
          size: 'half',
          description: 'Year the event was conducted'
        },
        {
          name: 'event_title',
          label: 'Event Title',
          type: 'text',
          placeholder: 'e.g., Maitri Event 2023',
          required: true,
          size: 'full',
          description: 'Title or name of the event'
        },
        {
          name: 'event_date',
          label: 'Event Date',
          type: 'date',
          required: false,
          size: 'half',
          description: 'Date the event was conducted'
        },
        {
          name: 'description',
          label: 'Event Description',
          type: 'textarea',
          placeholder: 'Enter event details and outcomes',
          required: false,
          size: 'full',
          rows: 4,
          description: 'Detailed description of the event'
        },
        {
          name: 'file_url',
          label: 'Event Document/Report',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png',
          description: 'Upload event report, certificate, or document'
        },
        {
          name: 'image_url',
          label: 'Event Photo',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.jpg,.jpeg,.png,.gif,.webp',
          description: 'Upload event photo/image'
        }
      ],
      searchableFields: ['event_title', 'academic_year'],
      sortableFields: ['event_title', 'event_date', 'academic_year', 'created_at'],
      editableFields: ['academic_year', 'event_title', 'event_date', 'description', 'file_url', 'image_url']
    },
    'activity-gallery': {
      tableName: 'mba_activity_gallery',
      displayField: 'image_title',
      fields: [
        {
          name: 'activity_id',
          label: 'Activity ID',
          type: 'number',
          placeholder: 'e.g., 1',
          required: true,
          size: 'half',
          hidden: true,
          description: 'Internal: Activity reference ID'
        },
        {
          name: 'academic_year',
          label: 'Academic Year',
          type: 'text',
          placeholder: 'e.g., 2024-25',
          required: false,
          size: 'half',
          description: 'Year of the activity'
        },
        {
          name: 'image_url',
          label: 'Gallery Image',
          type: 'file',
          required: true,
          size: 'full',
          accept: '.jpg,.jpeg,.png,.gif,.webp',
          description: 'Upload image for gallery (JPG, PNG, GIF, or WebP)'
        },
        {
          name: 'image_title',
          label: 'Image Caption/Title',
          type: 'text',
          placeholder: 'e.g., Maitri Event Group Photo',
          required: false,
          size: 'full',
          description: 'Caption or title for the image'
        },
        {
          name: 'description',
          label: 'Image Description',
          type: 'textarea',
          placeholder: 'Enter description of the image',
          required: false,
          size: 'full',
          rows: 3,
          description: 'Detailed description of what the image shows'
        },
        {
          name: 'order_seq',
          label: 'Display Order',
          type: 'number',
          placeholder: 'e.g., 1',
          required: false,
          size: 'half',
          description: 'Order of display in gallery'
        }
      ],
      searchableFields: ['image_title', 'academic_year'],
      sortableFields: ['image_title', 'academic_year', 'order_seq', 'created_at'],
      editableFields: ['academic_year', 'image_url', 'image_title', 'description', 'order_seq']
    },
    'department-overview': {
      tableName: 'mba_department_overview',
      displayField: 'hod_name',
      fields: [
        {
          name: 'hod_name',
          label: 'HOD Name',
          type: 'text',
          placeholder: 'e.g., Dr. John Smith',
          required: true,
          size: 'full',
          description: 'Enter the full name of the Head of Department'
        },
        {
          name: 'hod_email',
          label: 'HOD Email',
          type: 'email',
          placeholder: 'e.g., hod@example.com',
          required: false,
          size: 'half',
          description: 'Enter HOD email address'
        },
        {
          name: 'hod_qualification',
          label: 'HOD Qualification',
          type: 'text',
          placeholder: 'e.g., Ph.D. in Management',
          required: false,
          size: 'half',
          description: 'Enter highest educational qualification'
        },
        {
          name: 'hod_image_url',
          label: 'HOD Image',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.jpg,.jpeg,.png,.gif,.webp',
          description: 'Upload HOD profile image (JPG, PNG, GIF, or WebP format)'
        },
        {
          name: 'description',
          label: 'Department Description',
          type: 'textarea',
          placeholder: 'Enter department description and overview',
          required: false,
          size: 'full',
          rows: 6,
          description: 'Detailed description of the department'
        }
      ],
      searchableFields: ['hod_name', 'hod_email'],
      sortableFields: ['hod_name', 'created_at'],
      editableFields: ['hod_name', 'hod_email', 'hod_qualification', 'hod_image_url', 'description']
    },
    'handbooks': {
      tableName: 'mba_handbooks',
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
          name: 'academic_year',
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
          placeholder: 'e.g., I, II, III, IV',
          required: false,
          size: 'half',
          description: 'Enter semester (if applicable)'
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
      searchableFields: ['title', 'academic_year', 'semester'],
      sortableFields: ['title', 'academic_year', 'created_at'],
      editableFields: ['title', 'academic_year', 'semester', 'file_url']
    },
    'newsletters': {
      tableName: 'mba_newsletters',
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
          name: 'file_url',
          label: 'Newsletter PDF',
          type: 'file',
          required: true,
          size: 'full',
          accept: '.pdf'
        }
      ],
      searchableFields: ['title', 'year', 'volume'],
      sortableFields: ['title', 'volume', 'issue', 'year'],
      editableFields: ['title', 'volume', 'issue', 'year', 'file_url']
    },
    'department-library': {
      tableName: 'mba_department_library',
      displayField: 'title',
      fields: [
        {
          name: 'title',
          label: 'Book Title',
          type: 'text',
          placeholder: 'e.g., Advanced Management Techniques',
          required: true,
          size: 'full',
          description: 'Enter the book or resource title'
        },
        {
          name: 'author',
          label: 'Author',
          type: 'text',
          placeholder: 'e.g., John Smith',
          required: false,
          size: 'half'
        },
        {
          name: 'category',
          label: 'Category',
          type: 'text',
          placeholder: 'e.g., Management, Finance',
          required: false,
          size: 'half'
        },
        {
          name: 'isbn',
          label: 'ISBN',
          type: 'text',
          placeholder: 'e.g., 978-3-16-148410-0',
          required: false,
          size: 'half'
        },
        {
          name: 'available_copies',
          label: 'Available Copies',
          type: 'number',
          placeholder: 'e.g., 5',
          required: false,
          size: 'half'
        }
      ],
      searchableFields: ['title', 'author', 'category'],
      sortableFields: ['title', 'author', 'available_copies', 'created_at'],
      editableFields: ['title', 'author', 'category', 'isbn', 'available_copies']
    },
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
    'workshops': workshopsFieldConfig,
    'syllabus': {
      tableName: 'aiml_syllabus',
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
          size: 'full',
          description: 'Enter job designation'
        },
        {
          name: 'profileUrl',
          label: 'Profile PDF',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.pdf',
          description: 'Upload profile photo or image (JPG, PNG, GIF, or WebP)'
        }
      ],
      searchableFields: ['title', 'designation'],
      sortableFields: ['title', 'designation', 'created_at'],
      editableFields: ['title', 'qualification', 'designation', 'profileUrl']
    },
    'technical-faculty': {
      tableName: 'aiml_technical_faculty',
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
      tableName: 'aiml_technical_association',
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
      sortableFields: ['title', 'description', 'document_url', 'created_at'],
      editableFields: ['title', 'desscription', 'document_url']
    },
    'non-teaching-faculty': {
      tableName: 'aiml_non_teaching_faculty',
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
      tableName: 'aiml_academictoppers',
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
      tableName: 'aiml_faculty_achievements',
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
      tableName: 'aiml_faculty_development_programs',
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
    'physical-facilities': {
      tableName: 'aiml_physical_facilities',
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
            { value: 'Laboratories', label: 'Laboratories' },
            { value: 'Class Rooms', label: 'Class Rooms' },
            { value: 'Timetables', label: 'Timetables' },
            { value: 'Seminar Halls', label: 'Seminar Halls' }
          ]
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
      searchableFields: ['title', 'category'],
      sortableFields: ['title', 'category', 'created_at'],
      editableFields: ['title', 'category', 'file_url']
    },
    'placements': {
      tableName: 'aiml_placements',
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
      tableName: 'aiml_hackathons_gallery',
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
            { value: 'extracurricular activities', label: 'Extracurricular Activities' },
            { value: 'laboratory', label: 'Laboratory' }
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
    'eresources': {
      tableName: 'aiml_eresources',
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
      tableName: 'aiml_hackathons',
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
      tableName: 'aiml_newsletters',
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
      tableName: 'aiml_merit_scholarships',
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
      tableName: 'aiml_mous',
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
      editableFields: ['title', 'category', 'description', 'file_url']
    },
    'extra-curricular': {
      tableName: 'aiml_extracurricular_activities',
      displayField: 'activity_name',
      fields: [
        {
          name: 'activity_name',
          label: 'Activity Name',
          type: 'text',
          placeholder: 'e.g., Maitri Association, Tech Club',
          required: true,
          size: 'full',
          description: 'Name of the extra-curricular activity/association'
        },
        {
          name: 'category',
          label: 'Category',
          type: 'select',
          required: true,
          size: 'half',
          description: 'Type of activity',
          options: [
            { value: 'social_service', label: 'Social Service' },
            { value: 'cultural', label: 'Cultural' },
            { value: 'sports', label: 'Sports' },
            { value: 'technical', label: 'Technical' },
            { value: 'professional', label: 'Professional Society' },
            { value: 'community', label: 'Community Service' }
          ]
        },
        {
          name: 'academic_year',
          label: 'Academic Year',
          type: 'text',
          placeholder: 'e.g., 2024-25',
          required: false,
          size: 'half',
          description: 'Academic year of the activity'
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          placeholder: 'Enter detailed description of the activity',
          required: true,
          size: 'full',
          rows: 6,
          description: 'Detailed information about the activity'
        },
        {
          name: 'faculty_coordinator_name',
          label: 'Faculty Coordinator Name',
          type: 'text',
          placeholder: 'e.g., Mr. M Yesu Sekharam',
          required: false,
          size: 'full',
          description: 'Name of the primary faculty coordinator'
        },
        {
          name: 'faculty_coordinator_designation',
          label: 'Coordinator Designation',
          type: 'text',
          placeholder: 'e.g., Assistant Professor',
          required: false,
          size: 'half',
          description: 'Designation of the coordinator'
        },
        {
          name: 'image_url',
          label: 'Activity Cover Image',
          type: 'file',
          required: false,
          size: 'half',
          accept: '.jpg,.jpeg,.png,.gif,.webp',
          description: 'Cover image for the activity'
        },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          required: true,
          size: 'half',
          options: [
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
            { value: 'archived', label: 'Archived' }
          ],
          description: 'Activity status'
        }
      ],
      searchableFields: ['activity_name', 'category', 'faculty_coordinator_name'],
      sortableFields: ['activity_name', 'category', 'academic_year', 'created_at'],
      editableFields: [
        'activity_name',
        'category',
        'academic_year',
        'description',
        'faculty_coordinator_name',
        'faculty_coordinator_designation',
        'image_url',
        'status'
      ]
    },
    'activity-coordinators': {
      tableName: 'aiml_activity_coordinators',
      displayField: 'name',
      fields: [
        {
          name: 'activity_id',
          label: 'Activity ID',
          type: 'number',
          placeholder: 'e.g., 1',
          required: true,
          size: 'half',
          hidden: true,
          description: 'Internal: Activity reference ID'
        },
        {
          name: 'name',
          label: 'Coordinator Name',
          type: 'text',
          placeholder: 'e.g., Mr. M Yesu Sekharam',
          required: true,
          size: 'full',
          description: 'Name of the coordinator'
        },
        {
          name: 'designation',
          label: 'Designation',
          type: 'text',
          placeholder: 'e.g., Assistant Professor',
          required: false,
          size: 'half',
          description: 'Job designation'
        },
        {
          name: 'role',
          label: 'Role Type',
          type: 'select',
          required: true,
          size: 'half',
          options: [
            { value: 'faculty_coordinator', label: 'Faculty Coordinator' },
            { value: 'student_coordinator', label: 'Student Coordinator' },
            { value: 'co_coordinator', label: 'Co-Coordinator' }
          ],
          description: 'Coordinator role type'
        },
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          placeholder: 'e.g., name@example.com',
          required: false,
          size: 'half',
          description: 'Contact email address'
        },
        {
          name: 'phone',
          label: 'Phone',
          type: 'text',
          placeholder: 'e.g., +91 9876543210',
          required: false,
          size: 'half',
          description: 'Contact phone number'
        },
        {
          name: 'order_seq',
          label: 'Display Order',
          type: 'number',
          placeholder: 'e.g., 1',
          required: false,
          size: 'half',
          description: 'Order of display in frontend'
        }
      ],
      searchableFields: ['name', 'designation', 'role'],
      sortableFields: ['name', 'role', 'order_seq', 'created_at'],
      editableFields: ['name', 'designation', 'role', 'email', 'phone', 'order_seq']
    },
    'activity-events': {
      tableName: 'aiml_activity_events',
      displayField: 'event_title',
      fields: [
        {
          name: 'activity_id',
          label: 'Activity ID',
          type: 'number',
          placeholder: 'e.g., 1',
          required: true,
          size: 'half',
          hidden: true,
          description: 'Internal: Activity reference ID'
        },
        {
          name: 'academic_year',
          label: 'Academic Year',
          type: 'text',
          placeholder: 'e.g., 2023-24',
          required: true,
          size: 'half',
          description: 'Year the event was conducted'
        },
        {
          name: 'event_title',
          label: 'Event Title',
          type: 'text',
          placeholder: 'e.g., Maitri Event 2023',
          required: true,
          size: 'full',
          description: 'Title or name of the event'
        },
        {
          name: 'event_date',
          label: 'Event Date',
          type: 'date',
          required: false,
          size: 'half',
          description: 'Date the event was conducted'
        },
        {
          name: 'description',
          label: 'Event Description',
          type: 'textarea',
          placeholder: 'Enter event details and outcomes',
          required: false,
          size: 'full',
          rows: 4,
          description: 'Detailed description of the event'
        },
        {
          name: 'file_url',
          label: 'Event Document/Report',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png',
          description: 'Upload event report, certificate, or document'
        },
        {
          name: 'image_url',
          label: 'Event Photo',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.jpg,.jpeg,.png,.gif,.webp',
          description: 'Upload event photo/image'
        }
      ],
      searchableFields: ['event_title', 'academic_year'],
      sortableFields: ['event_title', 'event_date', 'academic_year', 'created_at'],
      editableFields: ['academic_year', 'event_title', 'event_date', 'description', 'file_url', 'image_url']
    },
    'activity-gallery': {
      tableName: 'aiml_activity_gallery',
      displayField: 'image_title',
      fields: [
        {
          name: 'activity_id',
          label: 'Activity ID',
          type: 'number',
          placeholder: 'e.g., 1',
          required: true,
          size: 'half',
          hidden: true,
          description: 'Internal: Activity reference ID'
        },
        {
          name: 'academic_year',
          label: 'Academic Year',
          type: 'text',
          placeholder: 'e.g., 2024-25',
          required: false,
          size: 'half',
          description: 'Year of the activity'
        },
        {
          name: 'image_url',
          label: 'Gallery Image',
          type: 'file',
          required: true,
          size: 'full',
          accept: '.jpg,.jpeg,.png,.gif,.webp',
          description: 'Upload image for gallery (JPG, PNG, GIF, or WebP)'
        },
        {
          name: 'image_title',
          label: 'Image Caption/Title',
          type: 'text',
          placeholder: 'e.g., Maitri Event Group Photo',
          required: false,
          size: 'full',
          description: 'Caption or title for the image'
        },
        {
          name: 'description',
          label: 'Image Description',
          type: 'textarea',
          placeholder: 'Enter description of the image',
          required: false,
          size: 'full',
          rows: 3,
          description: 'Detailed description of what the image shows'
        },
        {
          name: 'order_seq',
          label: 'Display Order',
          type: 'number',
          placeholder: 'e.g., 1',
          required: false,
          size: 'half',
          description: 'Order of display in gallery'
        }
      ],
      searchableFields: ['image_title', 'academic_year'],
      sortableFields: ['image_title', 'academic_year', 'order_seq', 'created_at'],
      editableFields: ['academic_year', 'image_url', 'image_title', 'description', 'order_seq']
    },
    'department-overview': {
      tableName: 'aiml_department_overview',
      displayField: 'hod_name',
      fields: [
        {
          name: 'hod_name',
          label: 'HOD Name',
          type: 'text',
          placeholder: 'e.g., Dr. John Smith',
          required: true,
          size: 'full',
          description: 'Enter the full name of the Head of Department'
        },
        {
          name: 'hod_email',
          label: 'HOD Email',
          type: 'email',
          placeholder: 'e.g., hod@example.com',
          required: false,
          size: 'half',
          description: 'Enter HOD email address'
        },
        {
          name: 'hod_qualification',
          label: 'HOD Qualification',
          type: 'text',
          placeholder: 'e.g., Ph.D. in AI/ML',
          required: false,
          size: 'half',
          description: 'Enter highest educational qualification'
        },
        {
          name: 'hod_image_url',
          label: 'HOD Image',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.jpg,.jpeg,.png,.gif,.webp',
          description: 'Upload HOD profile image (JPG, PNG, GIF, or WebP format)'
        },
        {
          name: 'description',
          label: 'Department Description',
          type: 'textarea',
          placeholder: 'Enter department description and overview',
          required: false,
          size: 'full',
          rows: 6,
          description: 'Detailed description of the department'
        }
      ],
      searchableFields: ['hod_name', 'hod_email'],
      sortableFields: ['hod_name', 'created_at'],
      editableFields: ['hod_name', 'hod_email', 'hod_qualification', 'hod_image_url', 'description']
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
    'workshops': workshopsFieldConfig,
    'faculty': {
      tableName: 'ds_faculty',
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
          label: 'Profile PDF',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.pdf',
          description: 'Upload profile photo or image (JPG, PNG, GIF, or WebP)'
        }
      ],
      searchableFields: ['title', 'designation'],
      sortableFields: ['title', 'designation', 'created_at'],
      editableFields: ['title', 'qualification', 'designation', 'profileUrl']
    },
    'technical-faculty': {
      tableName: 'ds_technical_faculty',
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
      tableName: 'ds_technical_association',
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
      sortableFields: ['title', 'description', 'document_url', 'created_at'],
      editableFields: ['title', 'desscription', 'document_url']
    },
    'non-teaching-faculty': {
      tableName: 'ds_non_teaching_faculty',
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
      tableName: 'ds_academictoppers',
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
      tableName: 'ds_faculty_development_programs',
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
            { value: 'FDP Attended', label: 'Attended' },
            { value: 'FDP Conducted', label: 'Conducted' },
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
    'hackathons-gallery': {
      tableName: 'ds_hackathons_gallery',
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
            { value: 'extracurricular activities', label: 'Extracurricular Activities' },
            { value: 'laboratories', label: 'Laboratories' }
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
      tableName: 'ds_bos_members',
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
      tableName: 'ds_bos_minutes',
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
      tableName: 'ds_eresources',
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
      tableName: 'ds_hackathons',
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
      tableName: 'ds_newsletters',
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
      tableName: 'ds_merit_scholarships',
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
    'syllabus': {
      tableName: 'ds_syllabus',
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
    'extra-curricular': {
      tableName: 'ds_extracurricular_activities',
      displayField: 'activity_name',
      fields: [
        {
          name: 'activity_name',
          label: 'Activity Name',
          type: 'text',
          placeholder: 'e.g., Maitri Association, Tech Club',
          required: true,
          size: 'full',
          description: 'Name of the extra-curricular activity/association'
        },
        {
          name: 'category',
          label: 'Category',
          type: 'select',
          required: true,
          size: 'half',
          description: 'Type of activity',
          options: [
            { value: 'social_service', label: 'Social Service' },
            { value: 'cultural', label: 'Cultural' },
            { value: 'sports', label: 'Sports' },
            { value: 'technical', label: 'Technical' },
            { value: 'professional', label: 'Professional Society' },
            { value: 'community', label: 'Community Service' }
          ]
        },
        {
          name: 'academic_year',
          label: 'Academic Year',
          type: 'text',
          placeholder: 'e.g., 2024-25',
          required: false,
          size: 'half',
          description: 'Academic year of the activity'
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          placeholder: 'Enter detailed description of the activity',
          required: true,
          size: 'full',
          rows: 6,
          description: 'Detailed information about the activity'
        },
        {
          name: 'faculty_coordinator_name',
          label: 'Faculty Coordinator Name',
          type: 'text',
          placeholder: 'e.g., Mr. M Yesu Sekharam',
          required: false,
          size: 'full',
          description: 'Name of the primary faculty coordinator'
        },
        {
          name: 'faculty_coordinator_designation',
          label: 'Coordinator Designation',
          type: 'text',
          placeholder: 'e.g., Assistant Professor',
          required: false,
          size: 'half',
          description: 'Designation of the coordinator'
        },
        {
          name: 'image_url',
          label: 'Activity Cover Image',
          type: 'file',
          required: false,
          size: 'half',
          accept: '.jpg,.jpeg,.png,.gif,.webp',
          description: 'Cover image for the activity'
        },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          required: true,
          size: 'half',
          options: [
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
            { value: 'archived', label: 'Archived' }
          ],
          description: 'Activity status'
        }
      ],
      searchableFields: ['activity_name', 'category', 'faculty_coordinator_name'],
      sortableFields: ['activity_name', 'category', 'academic_year', 'created_at'],
      editableFields: [
        'activity_name',
        'category',
        'academic_year',
        'description',
        'faculty_coordinator_name',
        'faculty_coordinator_designation',
        'image_url',
        'status'
      ]
    },
    'activity-coordinators': {
      tableName: 'ds_activity_coordinators',
      displayField: 'name',
      fields: [
        {
          name: 'activity_id',
          label: 'Activity ID',
          type: 'number',
          placeholder: 'e.g., 1',
          required: true,
          size: 'half',
          hidden: true,
          description: 'Internal: Activity reference ID'
        },
        {
          name: 'name',
          label: 'Coordinator Name',
          type: 'text',
          placeholder: 'e.g., Mr. M Yesu Sekharam',
          required: true,
          size: 'full',
          description: 'Name of the coordinator'
        },
        {
          name: 'designation',
          label: 'Designation',
          type: 'text',
          placeholder: 'e.g., Assistant Professor',
          required: false,
          size: 'half',
          description: 'Job designation'
        },
        {
          name: 'role',
          label: 'Role Type',
          type: 'select',
          required: true,
          size: 'half',
          options: [
            { value: 'faculty_coordinator', label: 'Faculty Coordinator' },
            { value: 'student_coordinator', label: 'Student Coordinator' },
            { value: 'co_coordinator', label: 'Co-Coordinator' }
          ],
          description: 'Coordinator role type'
        },
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          placeholder: 'e.g., name@example.com',
          required: false,
          size: 'half',
          description: 'Contact email address'
        },
        {
          name: 'phone',
          label: 'Phone',
          type: 'text',
          placeholder: 'e.g., +91 9876543210',
          required: false,
          size: 'half',
          description: 'Contact phone number'
        },
        {
          name: 'order_seq',
          label: 'Display Order',
          type: 'number',
          placeholder: 'e.g., 1',
          required: false,
          size: 'half',
          description: 'Order of display in frontend'
        }
      ],
      searchableFields: ['name', 'designation', 'role'],
      sortableFields: ['name', 'role', 'order_seq', 'created_at'],
      editableFields: ['name', 'designation', 'role', 'email', 'phone', 'order_seq']
    },
    'activity-events': {
      tableName: 'ds_activity_events',
      displayField: 'event_title',
      fields: [
        {
          name: 'activity_id',
          label: 'Activity ID',
          type: 'number',
          placeholder: 'e.g., 1',
          required: true,
          size: 'half',
          hidden: true,
          description: 'Internal: Activity reference ID'
        },
        {
          name: 'academic_year',
          label: 'Academic Year',
          type: 'text',
          placeholder: 'e.g., 2023-24',
          required: true,
          size: 'half',
          description: 'Year the event was conducted'
        },
        {
          name: 'event_title',
          label: 'Event Title',
          type: 'text',
          placeholder: 'e.g., Maitri Event 2023',
          required: true,
          size: 'full',
          description: 'Title or name of the event'
        },
        {
          name: 'event_date',
          label: 'Event Date',
          type: 'date',
          required: false,
          size: 'half',
          description: 'Date the event was conducted'
        },
        {
          name: 'description',
          label: 'Event Description',
          type: 'textarea',
          placeholder: 'Enter event details and outcomes',
          required: false,
          size: 'full',
          rows: 4,
          description: 'Detailed description of the event'
        },
        {
          name: 'file_url',
          label: 'Event Document/Report',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png',
          description: 'Upload event report, certificate, or document'
        },
        {
          name: 'image_url',
          label: 'Event Photo',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.jpg,.jpeg,.png,.gif,.webp',
          description: 'Upload event photo/image'
        }
      ],
      searchableFields: ['event_title', 'academic_year'],
      sortableFields: ['event_title', 'event_date', 'academic_year', 'created_at'],
      editableFields: ['academic_year', 'event_title', 'event_date', 'description', 'file_url', 'image_url']
    },
    'activity-gallery': {
      tableName: 'ds_activity_gallery',
      displayField: 'image_title',
      fields: [
        {
          name: 'activity_id',
          label: 'Activity ID',
          type: 'number',
          placeholder: 'e.g., 1',
          required: true,
          size: 'half',
          hidden: true,
          description: 'Internal: Activity reference ID'
        },
        {
          name: 'academic_year',
          label: 'Academic Year',
          type: 'text',
          placeholder: 'e.g., 2024-25',
          required: false,
          size: 'half',
          description: 'Year of the activity'
        },
        {
          name: 'image_url',
          label: 'Gallery Image',
          type: 'file',
          required: true,
          size: 'full',
          accept: '.jpg,.jpeg,.png,.gif,.webp',
          description: 'Upload image for gallery (JPG, PNG, GIF, or WebP)'
        },
        {
          name: 'image_title',
          label: 'Image Caption/Title',
          type: 'text',
          placeholder: 'e.g., Maitri Event Group Photo',
          required: false,
          size: 'full',
          description: 'Caption or title for the image'
        },
        {
          name: 'description',
          label: 'Image Description',
          type: 'textarea',
          placeholder: 'Enter description of the image',
          required: false,
          size: 'full',
          rows: 3,
          description: 'Detailed description of what the image shows'
        },
        {
          name: 'order_seq',
          label: 'Display Order',
          type: 'number',
          placeholder: 'e.g., 1',
          required: false,
          size: 'half',
          description: 'Order of display in gallery'
        }
      ],
      searchableFields: ['image_title', 'academic_year'],
      sortableFields: ['image_title', 'academic_year', 'order_seq', 'created_at'],
      editableFields: ['academic_year', 'image_url', 'image_title', 'description', 'order_seq']
    },
    'department-overview': {
      tableName: 'ds_department_overview',
      displayField: 'hod_name',
      fields: [
        {
          name: 'hod_name',
          label: 'HOD Name',
          type: 'text',
          placeholder: 'e.g., Dr. John Smith',
          required: true,
          size: 'full',
          description: 'Enter the full name of the Head of Department'
        },
        {
          name: 'hod_email',
          label: 'HOD Email',
          type: 'email',
          placeholder: 'e.g., hod@example.com',
          required: false,
          size: 'half',
          description: 'Enter HOD email address'
        },
        {
          name: 'hod_qualification',
          label: 'HOD Qualification',
          type: 'text',
          placeholder: 'e.g., Ph.D. in Data Science',
          required: false,
          size: 'half',
          description: 'Enter highest educational qualification'
        },
        {
          name: 'hod_image_url',
          label: 'HOD Image',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.jpg,.jpeg,.png,.gif,.webp',
          description: 'Upload HOD profile image (JPG, PNG, GIF, or WebP format)'
        },
        {
          name: 'description',
          label: 'Department Description',
          type: 'textarea',
          placeholder: 'Enter department description and overview',
          required: false,
          size: 'full',
          rows: 6,
          description: 'Detailed description of the department'
        }
      ],
      searchableFields: ['hod_name', 'hod_email'],
      sortableFields: ['hod_name', 'created_at'],
      editableFields: ['hod_name', 'hod_email', 'hod_qualification', 'hod_image_url', 'description']
    }
  },
  // ================================================================================================
  'cse': {
    'faculty-development': {
      tableName: 'cse_faculty_development_programs',
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
            { value: 'FDP Attended', label: 'Attended' },
            { value: 'FDP Conducted', label: 'Conducted' },
            { value: 'Workshops/Training', label: 'Workshops/Training' },
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
    'workshops': {
      tableName: 'cse_workshops',
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

            { value: 'Guest Lecturers/Seminars', label: 'Guest Lecturers/Seminars' },
            { value: 'Workshops/SOC', label: 'Workshops/SOC' }
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
      sortableFields: ['title', 'category', 'created_at'],
      editableFields: ['title', 'category', 'file_url']
    },
    'faculty-achievements': {
      tableName: 'cse_faculty_achievements',
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
            { value: 'Awards', label: 'Awards' },
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
    'syllabus': {

      tableName: 'cse_syllabus',
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
            { label: 'B.Tech Syllabus', value: 'B.Tech Syllabus' },
            { label: 'M.Tech Syllabus', value: 'M.Tech Syllabus' }
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
    'academic-toppers': {

      tableName: 'cse_academic_toppers',
      displayField: 'title',

      fields: [
        {
          name: 'type',
          label: 'Type',
          type: 'select',              // dropdown
          required: true,
          size: 'full',
          options: [
            { label: 'Merit Scholarships', value: 'Merit Scholarships' },
            { label: 'Academic Toppers', value: 'Academic Toppers' },

          ],
          description: 'Select whether this document is Merit Scholarships or Academic Toppers'
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
    'department-overview': {
      tableName: 'cse_department_overview',
      displayField: 'title',
      fields: [
        {
          name: 'title',
          label: 'Title',
          type: 'text',
          placeholder: 'e.g., Department Overview',
          required: true,
          size: 'full',
          description: 'Enter the title for this overview section',
          validation: {
            max: 1000,
            message: 'Title must not exceed 1000 characters'
          }
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          placeholder: 'Enter detailed description...',
          required: true,
          size: 'full',
          rows: 6,
          description: 'Provide a comprehensive description for this section',
          validation: {
            max: 5000,
            message: 'Description must not exceed 5000 characters'
          }
        },
        {
          name: 'file_url',
          label: 'Related Document/Image',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png',
          description: 'Upload related document, image, or brochure (PDF, DOC, DOCX, or Image files)'
        }
      ],
      searchableFields: ['title', 'description'],
      sortableFields: ['title', 'created_at'],
      editableFields: ['title', 'description', 'file_url']
    },
    'sahaya-events': {
      tableName: 'cse_sahaya_events',
      displayField: 'title',
      fields: [
        {
          name: 'title',
          label: 'Title',
          type: 'text',
          placeholder: 'e.g., Sahaya Events',
          required: true,
          size: 'full',
          description: 'Enter the title for the Sahaya event section',
          validation: {
            max: 1000,
            message: 'Title must not exceed 1000 characters'
          }
        },
        {
          name: 'year',
          label: 'Year',
          type: 'text',
          placeholder: 'e.g., 2024',
          required: true,
          size: 'half',
          description: 'Enter the year of the event'
        },
        {
          name: 'category',
          label: 'Category',
          type: 'select',
          required: true,
          size: 'half',
          description: 'Select the category for this event',
          options: [
            { value: 'ecactivities', label: 'EC Activities' },
            { value: 'sahaya', label: 'Sahaya' }
          ]
        },
        {
          name: 'file_url',
          label: 'Event Document/PDF',
          type: 'file',
          required: false,
          size: 'full',
          accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png',
          description: 'Upload event document, certificate, or related file (PDF, DOC, DOCX, or Image files)'
        }
      ],
      searchableFields: ['title', 'year', 'category'],
      sortableFields: ['title', 'year', 'category', 'created_at'],
      editableFields: ['title', 'year', 'category', 'file_url']
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

