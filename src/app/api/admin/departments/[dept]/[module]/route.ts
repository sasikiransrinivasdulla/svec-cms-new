import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth/auth';
import { RowDataPacket, OkPacket } from 'mysql2';
import { deleteRecordFiles, deleteReplacedFiles } from '@/utils/file-management';

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

// Verify user authentication and department access
async function verifyDepartmentAccess(request: NextRequest, department: string) {
  const authHeader = request.headers.get('Authorization');
  // console.log('Auth Header:', authHeader);
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Unauthorized', status: 401 };
  }

  const token = authHeader.substring(7);
  // console.log('Token:', token);
  const user = verifyToken(token);
  
  if (!user) {
    return { error: 'Invalid token', status: 401 };
  }

  // Super admin can access all departments
  if (user.role === 'super_admin') {
    return { user };
  }

  // Allow any authenticated user access (remove department restriction)
  if (user.role === 'admin' || user.role === 'dept') {
    return { user };
  }

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

    return NextResponse.json({
      success: true,
      data: {
        records,
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

    // Build insert query
    const columns = Object.keys(body);
    const values = Object.values(body);
    const placeholders = columns.map(() => '?').join(', ');

    const insertQuery = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
    const result = await query<OkPacket>(insertQuery, values);

    // Fetch the created record
    const newRecord = await query<RowDataPacket[]>(
      `SELECT * FROM ${tableName} WHERE id = ?`,
      [(result as any).insertId]
    );

    return NextResponse.json({
      success: true,
      data: newRecord[0],
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
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Record ID is required' }, { status: 400 });
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
    
    // Delete replaced files before updating
    try {
      await deleteReplacedFiles(oldRecordData, body);
      console.log(`🔄 Successfully cleaned up replaced files for ${dept}/${module} record ID: ${id}`);
    } catch (fileError) {
      console.error(`⚠️ Error cleaning up replaced files for ${dept}/${module} record ID: ${id}`, fileError);
      // Continue with database update even if file cleanup fails
    }

    // Build update query
    const columns = Object.keys(body);
    const values = Object.values(body);
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

    return NextResponse.json({
      success: true,
      data: updatedRecord[0],
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
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Record ID is required' }, { status: 400 });
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