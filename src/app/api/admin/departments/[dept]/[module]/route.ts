import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth/auth';
import { RowDataPacket, OkPacket } from 'mysql2';
import { deleteRecordFiles, deleteReplacedFiles } from '@/utils/file-management';
import { mapFieldsToDatabase, mapFieldsFromDatabase } from '@/utils/field-mapping';
import { triggerDepartmentRefresh } from '@/utils/refreshTriggers';

// Department modules mapping
const DEPARTMENT_MODULES: Record<string, Record<string, string>> = {
  'cse-ai': {
    'academic-toppers': 'cai_academictoppers',
    'activity-coordinators': 'cai_activity_coordinators',
    'activity-events': 'cai_activity_events',
    'activity-gallery': 'cai_activity_gallery',
    'bos-members': 'cai_bos_members',
    'bos-minutes': 'cai_bos_minutes',
    'department-library': 'cai_department_library',
    'department-overview': 'cai_department_overview',
    'eresources': 'cai_eresources',
    'extra-curricular': 'cai_extracurricular_activities',
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
    'technical-association': 'cai_extracurricular_activities',
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
    'bos-members': 'civil_bos_members',
    'bos-minutes': 'civil_bos_minutes',
    'faculty': 'civil_faculty',
    
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
    'extra-curricular': 'mba_extra_curricular',
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
    'training-activities': 'mba_training_activities'
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
    'gate': 'cst_gate',
    'hackathons': 'cst_hackathons',
    'hackathons-gallery': 'cst_hackathons_gallery',
    'handbooks': 'cst_handbooks',
    'industry-programs': 'cst_industry_programs',
    'merit-scholarships': 'cst_merit_scholarships',
    'mous': 'cst_mous',
    'newsletters': 'cst_newsletters',
    'non-teaching-faculty': 'cst_non_teaching_faculty',
    'physical-facilities': 'cst_physical_facilities',
    'placements': 'cst_placements',
    'placements-gallery': 'cst_hackathons_gallery',
    'roll-of-honour': 'cst_roll_of_honour',
    'sahaya-events': 'cst_sahaya_events',
    'scud-activities': 'cst_scud_activities',
    'student-achievements': 'cst_student_achievements',
    'syllabus': 'cst_syllabus',
    'technical-association': 'cst_technical_association',
    'technical-faculty': 'cst_technical_faculty',
    'training-activities': 'cst_training_activities',
    'workshops': 'cst_workshops',
    'training-activities-gallery': 'cst_hackathons_gallery',
    'extra-curricular-gallery': 'cst_hackathons_gallery',
    'faculty-development-gallery': 'cst_hackathons_gallery',
    'workshops-gallery': 'cst_hackathons_gallery'
 },
};

// Verify user authentication and department access
async function verifyDepartmentAccess(request: NextRequest, department: string) {
  const authHeader = request.headers.get('Authorization');
  console.log('Auth Header present:', !!authHeader);
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Auth header missing or invalid format');
    return { error: 'Unauthorized', status: 401 };
  }

  const token = authHeader.substring(7);
  console.log('Token length:', token.length);
  const user = verifyToken(token);
  
  if (!user) {
    console.log('Token verification failed');
    return { error: 'Invalid token', status: 401 };
  }

  console.log('Authenticated user:', { id: user.id, username: user.username, role: user.role, department: user.department });

  // Super admin can access all departments
  if (user.role === 'super_admin') {
    console.log('Access granted: super_admin role');
    return { user };
  }

  // Allow any authenticated user access (remove department restriction)
  if (user.role === 'admin' || user.role === 'dept') {
    console.log('Access granted: admin/dept role');
    return { user };
  }

  console.log('Access denied: insufficient permissions for role', user.role);
  return { error: 'Insufficient permissions', status: 403 };
}

// GET - Fetch records from a department module
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ dept: string; module: string }> }
) {
  try {
    const { dept, module } = await params;
    console.log(`[GET] Fetching module data - Department: ${dept}, Module: ${module}`);
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 1000); // Cap at 1000
    const search = searchParams.get('search') || '';

    console.log(`[GET] Query params - Page: ${page}, Limit: ${limit}, Search: ${search}`);

    // Verify access
    const authResult = await verifyDepartmentAccess(request, dept);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    // Get table name
    const tableName = DEPARTMENT_MODULES[dept]?.[module];
    console.log(`[GET] Resolved table name: ${tableName}`);
    
    if (!tableName) {
      console.log(`[GET] Invalid department or module - ${dept}/${module}`);
      return NextResponse.json({ error: 'Invalid department or module' }, { status: 404 });
    }

    const offset = (page - 1) * limit;
    
    // Build search condition with optimized query
    let searchCondition = '';
    let queryParams: any[] = [];
    
    if (search) {
      // Simple text search on commonly searchable fields instead of querying table structure
      const searchFields = ['title', 'name', 'description', 'subject', 'author', 'company'];
      const availableFields: string[] = [];
      
      // Quick check for which fields exist (cached approach)
      try {
        const sampleRow = await query<RowDataPacket[]>(
          `SELECT * FROM ${tableName} LIMIT 1`
        );
        
        if (sampleRow.length > 0) {
          const existingFields = Object.keys(sampleRow[0]);
          availableFields.push(...searchFields.filter(field => existingFields.includes(field)));
        }
      } catch (err) {
        console.warn('Could not determine searchable fields:', err);
      }

      if (availableFields.length > 0) {
        searchCondition = ` WHERE ${availableFields.map(field => `${field} LIKE ?`).join(' OR ')}`;
        queryParams = availableFields.map(() => `%${search}%`);
      }
    }

    console.log(`[GET] Executing optimized queries on table: ${tableName}`);

    // Use Promise.all for parallel execution
    const [countResult, records] = await Promise.all([
      // Count query
      query<RowDataPacket[]>(`SELECT COUNT(*) as total FROM ${tableName}${searchCondition}`, queryParams),
      // Data query with optimized LIMIT/OFFSET
      query<RowDataPacket[]>(
        `SELECT * FROM ${tableName}${searchCondition} ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`,
        queryParams
      )
    ]);

    const total = (countResult[0] as any).total;
    console.log(`[GET] Retrieved ${records.length} records out of ${total} total`);

    // Map database fields back to form fields for frontend
    const mappedRecords = records.map(record => mapFieldsFromDatabase(tableName, record));

    return NextResponse.json({
      success: true,
      data: {
        records: mappedRecords,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('GET error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : '';
    console.error('Error details:', { errorMessage, errorStack });
    return NextResponse.json({ 
      error: 'Internal server error',
      details: errorMessage,
      stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
    }, { status: 500 });
  }
}

// POST - Create new record in department module
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ dept: string; module: string }> }
) {
  try {
    const { dept, module } = await params;
    const body = await request.json();

    // Verify access
    const authResult = await verifyDepartmentAccess(request, dept);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    // Get table name
    const tableName = DEPARTMENT_MODULES[dept]?.[module];
    if (!tableName) {
      return NextResponse.json({ error: 'Invalid department or module' }, { status: 404 });
    }

    // Remove system fields
    delete body.id;
    delete body.created_at;
    delete body.updated_at;

    if (Object.keys(body).length === 0) {
      return NextResponse.json({ error: 'No data provided' }, { status: 400 });
    }

    // Map form fields to database fields
    const mappedBody = mapFieldsToDatabase(tableName, body);
    console.log(`[POST] Field mapping for ${tableName}:`, { original: body, mapped: mappedBody });

    // Auto-add dept field if table requires it
    // Check if table structure includes dept field by testing with a sample query
    try {
      const sampleRow = await query<RowDataPacket[]>(`SELECT * FROM ${tableName} LIMIT 1`);
      if (sampleRow.length === 0) {
        // Empty table - check table structure
        const columns = await query<RowDataPacket[]>(`SHOW COLUMNS FROM ${tableName}`);
        const deptColumn = columns.find((col: any) => col.Field === 'dept');
        if (deptColumn && !mappedBody.dept) {
          mappedBody.dept = dept;
          console.log(`[POST] Auto-added dept field: ${dept}`);
        }
      } else {
        // Non-empty table - check if first row has dept field
        if (sampleRow[0].hasOwnProperty('dept') && !mappedBody.dept) {
          mappedBody.dept = dept;
          console.log(`[POST] Auto-added dept field: ${dept}`);
        }
      }
    } catch (err) {
      console.warn(`[POST] Could not check dept field for ${tableName}:`, err);
      // Fallback: try adding dept field for known department tables
      if (!mappedBody.dept && (tableName.includes('_') && (
        tableName.startsWith('cai_') || 
        tableName.startsWith('ece_') || 
        tableName.startsWith('cst_') || 
        tableName.startsWith('eee_') || 
        tableName.startsWith('mba_') ||
        tableName.startsWith('bsh_') ||
        tableName.startsWith('civil_') ||
        tableName.startsWith('mech_') ||
        tableName.startsWith('ect_') ||
        tableName.startsWith('aiml_') ||
        tableName.startsWith('ds_')
      ))) {
        mappedBody.dept = dept;
        console.log(`[POST] Fallback: Auto-added dept field: ${dept}`);
      }
    }

    // Build insert query
    const columns = Object.keys(mappedBody);
    const values = Object.values(mappedBody);
    const placeholders = columns.map(() => '?').join(', ');

    const insertQuery = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
    const result = await query<OkPacket>(insertQuery, values);

    // Fetch the created record
    const newRecord = await query<RowDataPacket[]>(
      `SELECT * FROM ${tableName} WHERE id = ?`,
      [(result as any).insertId]
    );

    // Map database fields back to form fields for frontend
    const mappedRecord = mapFieldsFromDatabase(tableName, newRecord[0]);

    return NextResponse.json({
      success: true,
      data: mappedRecord,
      message: 'Record created successfully'
    });

  } catch (error) {
    console.error('POST error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : '';
    console.error('Error details:', { errorMessage, errorStack });
    return NextResponse.json({ 
      error: 'Internal server error',
      details: errorMessage,
      stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
    }, { status: 500 });
  }
}

// PUT - Update existing record in department module
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ dept: string; module: string }> }
) {
  try {
    const { dept, module } = await params;
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get('id');

    if (!idParam) {
      return NextResponse.json({ error: 'Record ID is required' }, { status: 400 });
    }

    // Convert ID to number
    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid record ID format' }, { status: 400 });
    }

    // Verify access
    const authResult = await verifyDepartmentAccess(request, dept);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    // Get table name
    const tableName = DEPARTMENT_MODULES[dept]?.[module];
    if (!tableName) {
      return NextResponse.json({ error: 'Invalid department or module' }, { status: 404 });
    }

    // Remove system fields
    delete body.id;
    delete body.created_at;
    delete body.updated_at;

    if (Object.keys(body).length === 0) {
      return NextResponse.json({ error: 'No data provided' }, { status: 400 });
    }

    // Get existing record for file comparison
    const existingRecord = await query<RowDataPacket[]>(
      `SELECT * FROM ${tableName} WHERE id = ?`,
      [id]
    );

    if (existingRecord.length === 0) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    const oldRecordData = existingRecord[0];
    
    // Map form fields to database fields
    const mappedBody = mapFieldsToDatabase(tableName, body);
    console.log(`[PUT] Field mapping for ${tableName}:`, { original: body, mapped: mappedBody });
    
    // Delete replaced files before updating
    try {
      await deleteReplacedFiles(oldRecordData, mappedBody);
      console.log(`🔄 Successfully cleaned up replaced files for ${dept}/${module} record ID: ${id}`);
    } catch (fileError) {
      console.error(`⚠️ Error cleaning up replaced files for ${dept}/${module} record ID: ${id}`, fileError);
      // Continue with database update even if file cleanup fails
    }

    // Build update query
    const columns = Object.keys(mappedBody);
    const values = Object.values(mappedBody);
    const setClause = columns.map(col => `${col} = ?`).join(', ');

    const updateQuery = `UPDATE ${tableName} SET ${setClause} WHERE id = ?`;
    await query(updateQuery, [...values, id]);

    // Fetch the updated record
    const updatedRecord = await query<RowDataPacket[]>(
      `SELECT * FROM ${tableName} WHERE id = ?`,
      [id]
    );

    if (updatedRecord.length === 0) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    // Map database fields back to form fields for frontend
    const mappedRecord = mapFieldsFromDatabase(tableName, updatedRecord[0]);

    return NextResponse.json({
      success: true,
      data: mappedRecord,
      message: 'Record updated successfully'
    });

  } catch (error) {
    console.error('PUT error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : '';
    console.error('Error details:', { errorMessage, errorStack });
    return NextResponse.json({ 
      error: 'Internal server error',
      details: errorMessage,
      stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
    }, { status: 500 });
  }
}

// DELETE - Delete record from department module
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ dept: string; module: string }> }
) {
  try {
    const { dept, module } = await params;
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get('id');

    if (!idParam) {
      return NextResponse.json({ error: 'Record ID is required' }, { status: 400 });
    }

    // Convert ID to number
    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid record ID format' }, { status: 400 });
    }

    // Verify access
    const authResult = await verifyDepartmentAccess(request, dept);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    // Get table name
    const tableName = DEPARTMENT_MODULES[dept]?.[module];
    if (!tableName) {
      return NextResponse.json({ error: 'Invalid department or module' }, { status: 404 });
    }

    // Check if record exists and get current data
    const existingRecord = await query<RowDataPacket[]>(
      `SELECT * FROM ${tableName} WHERE id = ?`,
      [id]
    );

    if (existingRecord.length === 0) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    const recordData = existingRecord[0];
    
    // Delete the record from database first (fast operation)
    await query(`DELETE FROM ${tableName} WHERE id = ?`, [id]);

    // Return success immediately, then clean up files asynchronously
    const response = NextResponse.json({
      success: true,
      message: 'Record deleted successfully'
    });
    
    // Cleanup files in the background (don't await this)
    setImmediate(async () => {
      try {
        await deleteRecordFiles(recordData);
        console.log(`🗑️ Successfully cleaned up files for ${dept}/${module} record ID: ${id}`);
      } catch (fileError) {
        console.error(`⚠️ Error cleaning up files for ${dept}/${module} record ID: ${id}`, fileError);
        // File cleanup failure doesn't affect the user - record is already deleted
      }
    });
    
    return response;

  } catch (error) {
    console.error('DELETE error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : '';
    console.error('Error details:', { errorMessage, errorStack });
    return NextResponse.json({ 
      error: 'Internal server error',
      details: errorMessage,
      stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
    }, { status: 500 });
  }
}