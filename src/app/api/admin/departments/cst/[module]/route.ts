import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { verifyToken } from '@/lib/auth/auth';
import { deleteRecordFiles, deleteReplacedFiles, isFileUrlField, convertISODateToMySQLFormat } from '@/utils/file-management';

// CST module to table mapping
const CST_MODULE_TABLES = {
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
};

// Verify user authentication and CST department access
async function verifyCSTAccess(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Unauthorized', status: 401 };
  }

  const token = authHeader.substring(7);
  const user = verifyToken(token);
  
  if (!user) {
    return { error: 'Invalid token', status: 401 };
  }

  // Allow super admin, general admin, or CST department admin
  if (user.role === 'super_admin' || 
      user.role === 'admin' ||
      (user.role === 'dept' && user.department === 'cst')) {
    return { user };
  }

  return { error: 'Insufficient permissions', status: 403 };
}

// GET - Fetch records from CST module
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ module: string }> }
) {
  try {
    const { module } = await params;
    console.log(`[CST GET] Fetching module data - Module: ${module}`);
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 1000); // Cap at 1000
    const search = searchParams.get('search') || '';
    const id = searchParams.get('id');

    console.log(`[CST GET] Query params - Page: ${page}, Limit: ${limit}, Search: ${search}, ID: ${id}`);

    // Verify access
    const authResult = await verifyCSTAccess(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    // Get table name
    const tableName = CST_MODULE_TABLES[module as keyof typeof CST_MODULE_TABLES];
    console.log(`[CST GET] Resolved table name: ${tableName}`);
    
    if (!tableName) {
      console.log(`[CST GET] Invalid CST module: ${module}`);
      return NextResponse.json({ error: 'Invalid CST module' }, { status: 404 });
    }

    // If specific ID requested, return single record
    if (id) {
      const records = await query<RowDataPacket[]>(
        `SELECT * FROM ${tableName} WHERE id = ?`,
        [id]
      );

      if (records.length === 0) {
        return NextResponse.json({ error: 'Record not found' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: records[0]
      });
    }

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Simplified approach - no search initially to isolate the issue
    let searchCondition = '';
    let queryParams: any[] = [];
    
    console.log(`[CST GET] Executing simple queries on table: ${tableName}`);
    console.log(`[CST GET] SQL queries will be:
      Count: SELECT COUNT(*) as total FROM ${tableName}
      Data: SELECT * FROM ${tableName} ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`);

    // Use Promise.all for parallel execution
    const [countResult, records] = await Promise.all([
      // Count query - simple count without search
      query<RowDataPacket[]>(`SELECT COUNT(*) as total FROM ${tableName}`, []),
      // Data query - simple select without search  
      query<RowDataPacket[]>(
        `SELECT * FROM ${tableName} ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`,
        []
      )
    ]);

    const total = countResult[0]?.total || 0;
    console.log(`[CST GET] Retrieved ${records.length} records out of ${total} total`);

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
    console.error('GET error for CST module:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST - Create new record in CST module
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ module: string }> }
) {
  try {
    const { module } = await params;
    let body = await request.json();

    // Verify access
    const authResult = await verifyCSTAccess(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    // Get table name
    const tableName = CST_MODULE_TABLES[module as keyof typeof CST_MODULE_TABLES];
    if (!tableName) {
      return NextResponse.json({ error: 'Invalid CST module' }, { status: 404 });
    }

    // Remove system fields if they exist
    delete body.id;
    delete body.created_at;
    delete body.updated_at;

    if (Object.keys(body).length === 0) {
      return NextResponse.json({ error: 'No data provided' }, { status: 400 });
    }

    // Convert ISO dates to MySQL format
    body = convertISODateToMySQLFormat(body);

    // Build insert query
    const columns = Object.keys(body);
    const values = Object.values(body);
    const placeholders = columns.map(() => '?').join(', ');
    const columnsString = columns.join(', ');

    const insertQuery = `INSERT INTO ${tableName} (${columnsString}) VALUES (${placeholders})`;
    const result = await query<ResultSetHeader>(insertQuery, values);

    // Fetch the newly created record
    const newRecord = await query<RowDataPacket[]>(
      `SELECT * FROM ${tableName} WHERE id = ?`,
      [result.insertId]
    );

    return NextResponse.json({
      success: true,
      data: newRecord[0],
      message: 'Record created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('POST error for CST module:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT - Update existing record in CST module with automatic file replacement
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ module: string }> }
) {
  try {
    const { module } = await params;
    let body = await request.json();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Record ID is required' }, { status: 400 });
    }

    // Verify access
    const authResult = await verifyCSTAccess(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    // Get table name
    const tableName = CST_MODULE_TABLES[module as keyof typeof CST_MODULE_TABLES];
    if (!tableName) {
      return NextResponse.json({ error: 'Invalid CST module' }, { status: 404 });
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
    
    // Convert ISO dates to MySQL format
    body = convertISODateToMySQLFormat(body);
    
    // Modules to exclude from automatic file replacement (faculty and bos-minutes use custom handlers)
    const excludeFromAutoDelete = ['faculty', 'non-teaching-faculty', 'technical-faculty', 'bos-minutes'];
    
    // Delete replaced files before updating - but skip for excluded modules
    if (!excludeFromAutoDelete.includes(module)) {
      try {
        await deleteReplacedFiles(oldRecordData, body);
        console.log(`🔄 Successfully cleaned up replaced files for CST ${module} record ID: ${id}`);
      } catch (fileError) {
        console.error(`⚠️ Error cleaning up replaced files for CST ${module} record ID: ${id}`, fileError);
        // Continue with database update even if file cleanup fails
      }
    } else {
      console.log(`[CST PUT] Skipping automatic file cleanup for excluded module: ${module}`);
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
    console.error('PUT error for CST module:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE - Delete record from CST module with automatic file cleanup
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ module: string }> }
) {
  try {
    const { module } = await params;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Record ID is required' }, { status: 400 });
    }

    // Verify access
    const authResult = await verifyCSTAccess(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    // Get table name
    const tableName = CST_MODULE_TABLES[module as keyof typeof CST_MODULE_TABLES];
    if (!tableName) {
      return NextResponse.json({ error: 'Invalid CST module' }, { status: 404 });
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
    
    console.log(`[CST DELETE] Deleting record from ${tableName} with ID: ${id}`);
    console.log(`[CST DELETE] Record data:`, recordData);
    
    // Delete the record from database first (fast operation)
    await query(`DELETE FROM ${tableName} WHERE id = ?`, [id]);

    // Return success immediately, then clean up files asynchronously
    const response = NextResponse.json({
      success: true,
      message: 'Record deleted successfully'
    });
    
    // Modules to exclude from automatic file deletion (faculty and bos-minutes use custom handlers)
    const excludeFromAutoDelete = ['faculty', 'non-teaching-faculty', 'technical-faculty', 'bos-minutes'];
    
    // Cleanup files in the background (don't await this) - but skip for excluded modules
    if (!excludeFromAutoDelete.includes(module)) {
      setImmediate(async () => {
        try {
          console.log(`[CST DELETE] Starting async file cleanup for ${module} record ID: ${id}`);
          await deleteRecordFiles(recordData);
          console.log(`🗑️ Successfully cleaned up files for CST ${module} record ID: ${id}`);
        } catch (fileError) {
          console.error(`⚠️ Error cleaning up files for CST ${module} record ID: ${id}`, fileError);
          // File cleanup failure doesn't affect the user - record is already deleted
        }
      });
    } else {
      console.log(`[CST DELETE] Skipping automatic file cleanup for excluded module: ${module}`);
    }
    
    return response;

  } catch (error) {
    console.error('DELETE error for CST module:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}