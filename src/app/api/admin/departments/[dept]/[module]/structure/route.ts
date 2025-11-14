import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth/auth';
import { RowDataPacket } from 'mysql2';

// Department modules mapping
const DEPARTMENT_MODULES: Record<string, Record<string, string>> = {
  'cse-ai': {
    'bos-members': 'cai_bos_members',
    'bos-minutes': 'cai_bos_minutes',
    'department-library': 'cai_department_library',
    'department-overview': 'cai_department_overview',
    'eresources': 'cai_eresources',
    'extra-curricular': 'cai_extra_curricular',
    'faculty': 'cai_faculty',
    'faculty-achievements': 'cai_faculty_achievements',
    'faculty-development': 'cai_faculty_development',
    'hackathons': 'cai_hackathons',
    'handbooks': 'cai_handbooks',
    'industry-programs': 'cai_industry_programs',
    'merit-scholarships': 'cai_merit_scholarships',
    'mous': 'cai_mous',
    'newsletters': 'cai_newsletters',
    'non-teaching-faculty': 'cai_non_teaching_faculty',
    'physical-facilities': 'cai_physical_facilities',
    'placements': 'cai_placements',
    'sahaya-events': 'cai_sahaya_events',
    'scud-activities': 'cai_scud_activities',
    'student-achievements': 'cai_student_achievements',
    'syllabus': 'cai_syllabus',
    'technical-faculty': 'cai_technical_faculty',
    'training-activities': 'cai_training_activities'
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
    'faculty': 'civil_faculty',
    'board-of-studies': 'bos_civil_meeting_minutes',
    'consultancy': 'civil_consultancy',
    'extra-curricular': 'civil_extra_curricular_activities',
    'newsletters': 'civil_newsletters',
    'physical-facilities': 'civil_physical_facilities',
    'student-achievements': 'civil_student_achievements',
    'syllabus': 'civil_syllabus',
    'technical-association': 'civil_technical_association',
    'workshops': 'civil_workshops'
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
    'faculty': 'cse_faculty',
    'staff': 'cse_staff',
    'achievements': 'cse_achievements',
    'placements': 'cse_placements',
    'hackathons': 'cse_hackathons',
    'handbooks': 'cse_handbooks',
    'mous': 'cse_mous',
    'syllabus': 'cse_syllabus',
    'physical-facilities': 'cse_physical_facilities',
    'department-library': 'cse_department_library',
    'merit-scholarships': 'cse_merit_scholarships',
    'technical-association': 'cse_technical_association',
    'training-activities': 'cse_training_activities',
    'newsletters': 'cse_newsletters',
    'extra-curricular': 'cse_extra_curricular'
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
    'hackathons': 'cst_hackathons',
    'handbooks': 'cst_handbooks',
    'industry-programs': 'cst_industry_programs',
    'merit-scholarships': 'cst_merit_scholarships',
    'mous': 'cst_mous',
    'newsletters': 'cst_newsletters',
    'non-teaching-faculty': 'cst_non_teaching_faculty',
    'physical-facilities': 'cst_physical_facilities',
    'placements': 'cst_placements',
    'sahaya-events': 'cst_sahaya_events',
    'scud-activities': 'cst_scud_activities',
    'student-achievements': 'cst_student_achievements',
    'syllabus': 'cst_syllabus',
    'technical-faculty': 'cst_technical_faculty',
    'training-activities': 'cst_training_activities'
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
    'faculty': 'mba_faculty',
  },
  'bsh': {
    'activities': 'bsh_activities',
    'board-of-studies': 'bsh_board_of_studies',
    'department-documents': 'bsh_department_documents',
    'department-profile': 'bsh_department_profile',
    'faculty': 'bsh_faculty',
    'faculty-achievements': 'bsh_faculty_achievements',
    'faculty-paper-presentations': 'bsh_faculty_paper_presentations',
    'laboratories': 'bsh_laboratories',
    'results': 'bsh_results',
    'student-achievements': 'bsh_student_achievements',
    'non-teaching-faculty': 'non_teaching_bsh_faculty'
  },
  'ect': {
    'clubs': 'ect_clubs',
    'extracurricular-activities': 'ect_extracurricular_activities',
    'faculty': 'ect_faculty',
    'faculty-innovations': 'ect_facultyinnovations',
    'faculty-achievements': 'ect_faculty_achievements',
    'fdp': 'ect_fdp',
    'handbooks': 'ect_handbooks',
    'mous': 'ect_mous',
    'newsletters': 'ect_newsletters',
    'physical-facilities': 'ect_physical_facilities',
    'placements': 'ect_placements',
    'scholarships-toppers': 'ect_scholarships_toppers',
    'syllabus': 'ect_syllabus',
    'technical-association': 'ect_technical_association',
    'training-activities': 'ect_training_activities',
    'workshop': 'ect_workshop_gl'
  },
  'aiml': {
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
    'handbooks': 'aiml_handbooks',
    'industry-programs': 'aiml_industry_programs',
    'merit-scholarships': 'aiml_merit_scholarships',
    'mous': 'aiml_mous',
    'newsletters': 'aiml_newsletters',
    'non-teaching-faculty': 'aiml_non_teaching_faculty',
    'physical-facilities': 'aiml_physical_facilities',
    'placements': 'aiml_placements',
    'sahaya-events': 'aiml_sahaya_events',
    'scud-activities': 'aiml_scud_activities',
    'student-achievements': 'aiml_student_achievements',
    'syllabus': 'aiml_syllabus',
    'technical-faculty': 'aiml_technical_faculty',
    'training-activities': 'aiml_training_activities'
  },
  'cse-ds': {
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
  const user = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsInVzZXJuYW1lIjoiY3N0X2FkbWluIiwiZGVwYXJ0bWVudCI6ImNzdCIsInJvbGUiOiJkZXB0IiwicGVybWlzc2lvbnMiOltdLCJpYXQiOjE3NTk5MzE0OTMsImV4cCI6MTc1OTk2MDI5M30.A2t299a2iDig4dNDrBYVasG4Fn1Yn_2bCQSyMprWq6s'
  console.log('Verified User:', user);
  
  if (!user) {
    return { error: 'Invalid token', status: 401 };
  }

  return { user };
}

// GET - Fetch table structure for dynamic form generation
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ dept: string; module: string }> }
) {
  try {
    const { dept, module } = await params;

    // Verify access
    const authResult = await verifyAuth(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    // Get table name
    const tableName = DEPARTMENT_MODULES[dept]?.[module];
    if (!tableName) {
      return NextResponse.json({ error: 'Invalid department or module' }, { status: 404 });
    }

    // Get table structure
    const columns = await query<RowDataPacket[]>(
      `SHOW COLUMNS FROM \`${tableName}\``
    );

    return NextResponse.json({
      success: true,
      fields: columns,
      tableName
    });

  } catch (error) {
    console.error('Structure fetch error:', error);
    
    // If table doesn't exist, return default structure
    if (error instanceof Error && error.message.includes("doesn't exist")) {
      return NextResponse.json({
        success: true,
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