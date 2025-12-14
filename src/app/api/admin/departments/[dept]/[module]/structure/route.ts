import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth/auth';
import { RowDataPacket } from 'mysql2';
import { getModuleFieldConfig, MODULES_FIELD_CONFIG } from '@/config/module-fields';

// Department modules mapping - Updated for Civil BOS minutes
const DEPARTMENT_MODULES: Record<string, Record<string, string>> = {
  'cse-ai': {
    'bos-members': 'cai_bos_members',
    'bos-minutes': 'cai_bos_minutes',
    'activity-coordinators': 'cai_activity_coordinators',
    'activity-events': 'cai_activity_events',
    'activity-gallery': 'cai_activity_gallery',
    'department-library': 'cai_department_library',
    'department-overview': 'cai_department_overview',
    'eresources': 'cai_eresources',
    'extra-curricular': 'cai_extra_curricular',
    'faculty': 'cai_faculty',
    'faculty-achievements': 'cai_faculty_achievements',
    'faculty-development': 'cai_faculty_development',
    'hackathons': 'cai_hackathons',
    'hackathons-gallery': 'cai_hackathons_gallery',
    'handbooks': 'cai_handbooks',
    'merit-scholarships': 'cai_merit_scholarships',
    'mous': 'cai_mous',
    'newsletters': 'cai_newsletters',
    'non-teaching-faculty': 'cai_non_teaching_faculty',
    'physical-facilities': 'cai_physical_facilities',
    'placements': 'cai_placements',
    'student-achievements': 'cai_student_achievements',
    'syllabus': 'cai_syllabus',
    'technical-association': 'cai_extra_curricular',
    'technical-faculty': 'cai_technical_faculty',
    'workshops': 'cai_workshops'
  },
  'ece': {
    'board-of-studies': 'ece_board_of_studies',
    'clubs': 'ece_clubs',
    'extracurricular-activities': 'ece_extracurricular_activities',
    'faculty-achievements': 'ece_faculty_achievements',
    'faculty-data': 'ece_faculty',
    'faculty-innovations': 'ece_faculty_innovations',
    'fdp': 'ece_fdp',
    'handbooks': 'ece_handbooks',
    'mous': 'ece_mous',
    'newsletters': 'ece_newletters',
    'ntfaculty': 'ece_nonteaching_faculty',
    'physical-facilities': 'ece_physical_facilities',
    'placements': 'ece_placements',
    'scholarships-toppers': 'ece_scholarships_toppers',
    'syllabus': 'ece_syllabus',
    'teaching-faculty': 'ece_teaching_faculty',
    'technical-association': 'ece_technicalAssociation_trainingActivities',
    'workshops': 'ece_worshops_gl'
  },
  'civil': {
    'bos-minutes': 'civil_bos_minutes',
    'bos-members': 'board_of_studies',
    'board-of-studies': 'board_of_studies',
    'consultancy': 'civil_consultancy',
    'department-overview': 'civil_department_overview',
    'department-library': 'civil_department_library',
    'extra-curricular': 'civil_extra_curricular_activities',
    'extra-curricular-gallery': 'civil_extra_curricular_gallery',
    'faculty': 'civil_faculty',
    'faculty-achievements': 'civil_faculty_achievements',
    'faculty-development': 'civil_faculty_development',
    'faculty-development-gallery': 'civil_faculty_development_gallery',
    'gate': 'civil_gate_results',
    'gate-gallery': 'civil_gate_gallery',
    'hackathons': 'civil_hackathons',
    'hackathons-gallery': 'civil_hackathons_gallery',
    'handbooks': 'civil_handbooks',
    'laboratories': 'civil_laboratories',
    'merit-scholarships': 'civil_merit_scholarships',
    'merit-scholarships-gallery': 'civil_merit_scholarships_gallery',
    'mous': 'civil_mous',
    'newsletters': 'civil_newsletters',
    'non-teaching-faculty': 'civil_non_teaching_faculty',
    'physical-facilities': 'civil_physical_facilities',
    'placements': 'civil_placements',
    'placements-gallery': 'civil_placements_gallery',
    'roll-of-honour': 'civil_roll_of_honour',
    'roll-of-honour-gallery': 'civil_roll_of_honour_gallery',
    'student-achievements': 'civil_student_achievements',
    'syllabus': 'civil_syllabus',
    'technical-association': 'civil_technical_association',
    'technical-association-gallery': 'civil_technical_association_gallery',
    'training-activities': 'civil_training_activities',
    'training-activities-gallery': 'civil_training_activities_gallery',
    'workshops': 'civil_workshops',
    'workshops-gallery': 'civil_workshops_gallery'
  },
  'mech': {
    'faculty': 'mech_faculty',
    'faculty-achievements': 'mech_facultyachievements',
    'faculty-methods': 'mech_facultyTLmethods',
    'laboratories': 'mech_laboratories',
    'library': 'mech_library',
    'magazines': 'mech_magazines',
    'mous': 'mech_mous',
    'newsletters': 'mech_newsletters',
    'placements': 'mech_placements',
    'project-research': 'mech_project_research',
    'student-achievements': 'mech_studentachievements',
    'syllabus': 'mech_syllabus',
    'technical-association': 'mech_technicalassociation',
    'workshops': 'mech_workshops'
  },
  'cse': {
    'bos-members': 'cse_bos_members',
    'bos-minutes': 'cse_bos_minutes',
    'department-library': 'cse_department_library',
    'department-overview': 'cse_department_overview',
    'eresources': 'cse_eresources',
    'extra-curricular': 'cse_extra_curricular',
    'faculty': 'cse_faculty',
    'faculty-achievements': 'cse_faculty_achievements',
    'faculty-development': 'cse_faculty_development',
    'gate': 'cse_gate',
    'hackathons': 'cse_hackathons',
    'hackathons-gallery': 'cse_hackathons_gallery',
    'handbooks': 'cse_handbooks',
    'industry-programs': 'cse_industry_programs',
    'merit-scholarships': 'cse_merit_scholarships',
    'mous': 'cse_mous',
    'newsletters': 'cse_newsletters',
    'non-teaching-faculty': 'cse_non_teaching_faculty',
    'physical-facilities': 'cse_physical_facilities',
    'placements': 'cse_placements',
    'placements-gallery': 'cse_hackathons_gallery',
    'roll-of-honour': 'cse_roll_of_honour',
    'sahaya-events': 'cse_sahaya_events',
    'scud-activities': 'cse_scud_activities',
    'student-achievements': 'cse_student_achievements',
    'syllabus': 'cse_syllabus',
    'technical-association': 'cse_technical_association',
    'technical-faculty': 'cse_technical_faculty',
    'training-activities': 'cse_training_activities',
    'workshops': 'cse_workshops',
    'training-activities-gallery': 'cse_hackathons_gallery',
    'extra-curricular-gallery': 'cse_hackathons_gallery',
    'faculty-development-gallery': 'cse_hackathons_gallery',
    'workshops-gallery': 'cse_hackathons_gallery'
  },
  'eee': {
    'faculty': 'eee_faculty',
    'bos-members': 'eee_bos_members',
    'syllabus': 'eee_syllabus',
    'faculty-innovations': 'faculty_innovations',
    'research-centers': 'research_centers',
    'product-development': 'product_development',
    'departmental-activities': 'departmental_activities',
    'green-initiatives': 'green_initiatives',
    'technical-magazines': 'technical_magazines',
    'student-achievements': 'student_achievements',
    'faculty-achievements': 'faculty_achievements',
    'workshops': 'workshops',
    'fdp': 'fdp',
    'organized-events': 'organized_events',
    'labs': 'labs'
  },
  'mba': {
    'activity-coordinators': 'mba_activity_coordinators',
    'activity-events': 'mba_activity_events',
    'activity-gallery': 'mba_activity_gallery',
    'bos-members': 'mba_bos_members',
    'bos-minutes': 'mba_bos_minutes',
    'department-library': 'mba_department_library',
    'department-overview': 'mba_department_overview',
    'extra-curricular': 'mba_extracurricular_activities',
    'faculty': 'mba_faculty',
    'faculty-achievements': 'mba_faculty_achievements',
    'faculty-development': 'mba_faculty_development',
    'hackathons': 'mba_hackathons',
    'handbooks': 'mba_handbooks',
    'industry-programs': 'mba_industry_programs',
    'merit-scholarships': 'mba_merit_scholarships',
    'mous': 'mba_mous',
    'newsletters': 'mba_newsletters',
    'non-teaching-faculty': 'mba_non_teaching_faculty',
    'physical-facilities': 'mba_physical_facilities',
    'placements': 'mba_placements',
    'sahaya-events': 'mba_sahaya_events',
    'scud-activities': 'mba_scud_activities',
    'student-achievements': 'mba_student_achievements',
    'syllabus': 'mba_syllabus',
    'technical-faculty': 'mba_technical_faculty',
    'training-activities': 'mba_training_activities',
    'workshops': 'mba_workshops'
  },
  'bsh': {
    'activities': 'bsh_activities',
    'board-of-studies': 'bsh_board_of_studies',
    'department-documents': 'bsh_department_documents',
    'department-profile': 'bsh_department_profile',
    'faculty': 'bsh_faculty',
    'faculty-achievements': 'bsh_faculty_achievements',
    'faculty-paper-presentations': 'bsh_faculty_paper_presentations',
    'fdps': 'bsh_fdps',
    'laboratories': 'bsh_laboratories',
    'photogallery': 'bsh_photogallery',
    'results': 'bsh_results',
    'student-achievements': 'bsh_student_achievements',
    'syllabus': 'bsh_syllabus',
    'non-teaching-faculty': 'non_teaching_bsh_faculty'
  },
  'ect': {
    'bos-members': 'ect_bos_members',
    'bos-minutes': 'ect_bos_minutes',
    'workshops': 'ect_workshops',
    'department-library': 'ect_department_library',
    'industry-programs': 'ect_industry_programs',
    'department-overview': 'ect_department_overview',
    'eresources': 'ect_eresources',
    'extra-curricular': 'ect_extracurricular_activities',
    'faculty': 'ect_faculty',
    'faculty-achievements': 'ect_faculty_achievements',
    'faculty-development': 'ect_faculty_development',
    'hackathons': 'ect_hackathons',
    'hackathons-gallery': 'ect_hackathons_gallery',
    'handbooks': 'ect_handbooks',
    'technical-association': 'ect_technical_association',
    'merit-scholarships': 'ect_merit_scholarships',
    'mous': 'ect_mous',
    'newsletters': 'ect_newsletters',
    'non-teaching-faculty': 'ect_non_teaching_faculty',
    'physical-facilities': 'ect_physical_facilities',
    'placements': 'ect_placements',
    'sahaya-events': 'ect_sahaya_events',
    'scud-activities': 'ect_scud_activities',
    'student-achievements': 'ect_student_achievements',
    'gate': 'ect_gate',
    'roll-of-honour': 'ect_roll_of_honour',
    'syllabus': 'ect_syllabus',
    'technical-faculty': 'ect_technical_faculty',
    'training-activities': 'ect_training_activities'
  },
  'cse-ds': {
    'activity-coordinators': 'ds_activity_coordinators',
    'activity-events': 'ds_activity_events',
    'activity-gallery': 'ds_activity_gallery',
    'bos-members': 'ds_bos_members',
    'bos-minutes': 'ds_bos_minutes',
    'department-library': 'ds_department_library',
    'department-overview': 'ds_department_overview',
    'eresources': 'ds_eresources',
    'extra-curricular': 'ds_extra_curricular',
    'faculty': 'ds_faculty',
    'faculty-achievements': 'ds_faculty_achievements',
    'faculty-development': 'ds_faculty_development',
    'hackathons': 'ds_hackathons',
    'handbooks': 'ds_handbooks',
    'industry-programs': 'ds_industry_programs',
    'merit-scholarships': 'ds_merit_scholarships',
    'mous': 'ds_mous',
    'newsletters': 'ds_newsletters',
    'non-teaching-faculty': 'ds_non_teaching_faculty',
    'physical-facilities': 'ds_physical_facilities',
    'placements': 'ds_placements',
    'sahaya-events': 'ds_sahaya_events',
    'scud-activities': 'ds_scud_activities',
    'student-achievements': 'ds_student_achievements',
    'syllabus': 'ds_syllabus',
    'technical-faculty': 'ds_technical_faculty',
    'training-activities': 'ds_training_activities'
  },
  'aiml': {
    'academic-toppers': 'aiml_academictoppers',
    'activity-coordinators': 'aiml_activity_coordinators',
    'activity-events': 'aiml_activity_events',
    'activity-gallery': 'aiml_activity_gallery',
    'bos-members': 'aiml_bos_members',
    'bos-minutes': 'aiml_bos_minutes',
    'department-library': 'aiml_department_library',
    'department-overview': 'aiml_department_overview',
    'eresources': 'aiml_eresources',
    'extra-curricular': 'aiml_extra_curricular',
    'faculty': 'aiml_faculty',
    'faculty-achievements': 'aiml_faculty_achievements',
    'faculty-development': 'aiml_faculty_development',
    'hackathons': 'aiml_hackathons',
    'hackathons-gallery': 'aiml_hackathons_gallery',
    'handbooks': 'aiml_handbooks',
    'merit-scholarships': 'aiml_merit_scholarships',
    'mous': 'aiml_mous',
    'physical-facilities': 'aiml_physical_facilities',
    'placements': 'aiml_placements',
    'staff': 'aiml_staff',
    'student-achievements': 'aiml_student_achievements',
    'syllabus': 'aiml_syllabus',
    'technical-association': 'aiml_technical_association',
    'technical-faculty': 'aiml_technical_faculty',
    'workshops': 'aiml_workshops'
  },
  'cst': {
    'bos-members': 'cst_bos_members',
    'bos-minutes': 'cst_bos_minutes',
    'department-library': 'cst_department_library',
    'department-overview': 'cst_department_overview',
    'eresources': 'cst_eresources',
    'extra-curricular': 'cst_extra_curricular',
    'faculty': 'cst_faculty',
    'faculty-achievements': 'cst_faculty_achievements',
    'faculty-development': 'cst_faculty_development',
    'non-teaching-faculty': 'cst_non_teaching_faculty',
    'gate': 'cst_gate',
    'hackathons': 'cst_hackathons',
    'hackathons-gallery': 'cst_hackathons_gallery',
    'handbooks': 'cst_handbooks',
    'industry-programs': 'cst_industry_programs',
    'merit-scholarships': 'cst_merit_scholarships',
    'mous': 'cst_mous',
    'newsletters': 'cst_newsletters',
    'physical-facilities': 'cst_physical_facilities',
    'placements': 'cst_placements',
    'roll-of-honour': 'cst_roll_of_honour',
    'sahaya-events': 'cst_sahaya_events',
    'scud-activities': 'cst_scud_activities',
    'student-achievements': 'cst_student_achievements',
    'syllabus': 'cst_syllabus',
    'technical-association': 'cst_technical_association',
    'technical-faculty': 'cst_technical_faculty',
    'training-activities': 'cst_training_activities',
    'workshops': 'cst_workshops'

  }
};

// Verify user authentication
async function verifyAuth(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  console.log('Auth Header:', authHeader);
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Unauthorized', status: 401 };
  }

  const token = authHeader.substring(7);
  console.log('Token:', token);

  // verifyToken is synchronous, not async
  const user = verifyToken(token);
  console.log('Verified User:', user);

  if (!user) {
    return { error: 'Invalid token', status: 401 };
  }

  return { user };
}

// GET - Fetch table structure and field configuration for dynamic form generation
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ dept: string; module: string }> }
) {
  try {
    const { dept, module } = await params;
    console.log(`[Structure GET] Started - Department: ${dept}, Module: ${module}`);

    // Verify access
    const authResult = await verifyAuth(request);
    if (authResult.error) {
      console.error(`[Structure GET] Auth failed:`, authResult.error);
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    console.log(`[Structure GET] Auth verified successfully`);

    // Get table name
    const tableName = DEPARTMENT_MODULES[dept]?.[module];
    if (!tableName) {
      console.error(`[Structure GET] Invalid module - ${dept}/${module}`);
      return NextResponse.json({ error: 'Invalid department or module' }, { status: 404 });
    }
    console.log(`[Structure GET] Table name resolved: ${tableName}`);

    // First, try to get field configuration from our new config
    console.log(`[Structure] Looking for config for ${dept}/${module}`);
    const fieldConfig = getModuleFieldConfig(dept, module);
    console.log(`[Structure] Field config found:`, !!fieldConfig);

    if (fieldConfig) {
      // Return configured field structure
      console.log(`[Structure] Returning configured fields for ${dept}/${module}`, fieldConfig);
      console.log(`[Structure] Type field config:`, fieldConfig.fields.find(f => f.name === 'type'));
      return NextResponse.json({
        success: true,
        source: 'config',
        dept,
        module,
        tableName: fieldConfig.tableName,
        displayField: fieldConfig.displayField,
        fields: fieldConfig.fields,
        searchableFields: fieldConfig.searchableFields || [],
        sortableFields: fieldConfig.sortableFields || [],
        editableFields: fieldConfig.editableFields || []
      });
    }

    // Fallback: Get table structure from database
    console.log(`[Structure] Fetching database schema for ${tableName}`);
    const columns = await query<RowDataPacket[]>(
      `SHOW COLUMNS FROM \`${tableName}\``
    );

    return NextResponse.json({
      success: true,
      source: 'database',
      fields: columns,
      tableName
    });

  } catch (error) {
    console.error('Structure fetch error:', error);

    // If table doesn't exist, return default structure
    if (error instanceof Error && error.message.includes("doesn't exist")) {
      return NextResponse.json({
        success: true,
        source: 'default',
        fields: [
          { Field: 'title', Type: 'varchar(255)', Null: 'YES', Key: '', Default: null, Extra: '' },
          { Field: 'description', Type: 'text', Null: 'YES', Key: '', Default: null, Extra: '' },
          { Field: 'content', Type: 'text', Null: 'YES', Key: '', Default: null, Extra: '' }
        ],
        tableName: 'default'
      });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}