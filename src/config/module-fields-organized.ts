/**
 * Module Field Configuration - Organized by Department
 * Defines the form fields and their metadata for each department module
 * Used by the admin dashboard for dynamic form rendering
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

// ================================================================================================
// DEPARTMENT CONFIGURATIONS
// ================================================================================================

export const MODULES_FIELD_CONFIG: Record<string, Record<string, ModuleFieldConfig>> = {

  // ================================================================================================
  // CSE-AI DEPARTMENT
  // ================================================================================================
  'cse-ai': {
    // CSE-AI department modules with cai_* table prefixes
    
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
        // ... rest of faculty fields would go here
      ],
      searchableFields: ['title', 'qualification'],
      sortableFields: ['title', 'designation', 'experience', 'created_at'],
      editableFields: ['title', 'qualification', 'designation', 'experience', 'specialization', 'file_url']
    },

    // Add other CSE-AI modules here...
  },

  // ================================================================================================
  // AIML DEPARTMENT  
  // ================================================================================================
  'aiml': {
    // AIML department only has physical facilities tables (classrooms, laboratories, seminar halls)
    
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
    }
  },

  // ================================================================================================
  // CSE-DS DEPARTMENT
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

    // Add other CSE-DS modules here...
  },

  // ================================================================================================
  // MBA DEPARTMENT
  // ================================================================================================
  'mba': {
    // MBA department modules with mba_* table prefixes
    
    // Add MBA modules here...
  },

  // ================================================================================================
  // ECE DEPARTMENT
  // ================================================================================================
  'ece': {
    // ECE department modules with ece_* table prefixes
    
    // Add ECE modules here...
  },

  // ================================================================================================
  // CIVIL DEPARTMENT
  // ================================================================================================
  'civil': {
    // Civil department modules with civil_* table prefixes
    
    // Add Civil modules here...
  },

  // ================================================================================================
  // MECHANICAL DEPARTMENT
  // ================================================================================================
  'mech': {
    // Mechanical department modules with mech_* table prefixes
    
    // Add Mechanical modules here...
  },

  // ================================================================================================
  // CSE DEPARTMENT
  // ================================================================================================
  'cse': {
    // CSE department modules with cse_* table prefixes
    
    // Add CSE modules here...
  },

  // ================================================================================================
  // CST DEPARTMENT
  // ================================================================================================
  'cst': {
    // CST department modules with cst_* table prefixes
    
    // Add CST modules here...
  },

  // ================================================================================================
  // EEE DEPARTMENT
  // ================================================================================================
  'eee': {
    // EEE department modules with eee_* table prefixes
    
    // Add EEE modules here...
  },

  // ================================================================================================
  // BSH DEPARTMENT
  // ================================================================================================
  'bsh': {
    // BSH department modules with bsh_* table prefixes
    
    // Add BSH modules here...
  },

  // ================================================================================================
  // ECT DEPARTMENT
  // ================================================================================================
  'ect': {
    // ECT department modules with ect_* table prefixes
    
    // Add ECT modules here...
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
export function getEditableFields(
  dept: string,
  module: string
): string[] {
  const config = getModuleFieldConfig(dept, module);
  return config?.editableFields || [];
}

/**
 * Get all searchable fields for a module
 */
export function getSearchableFields(
  dept: string,
  module: string
): string[] {
  const config = getModuleFieldConfig(dept, module);
  return config?.searchableFields || [];
}

/**
 * Get all sortable fields for a module
 */
export function getSortableFields(
  dept: string,
  module: string
): string[] {
  const config = getModuleFieldConfig(dept, module);
  return config?.sortableFields || [];
}