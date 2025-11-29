import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { verifyToken } from '@/lib/auth/auth';

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

// GET - Get table structure for CST module
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ module: string }> }
) {
  try {
    const { module } = await params;

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

    // Get table structure
    const fields = await query<RowDataPacket[]>(
      `SHOW COLUMNS FROM ${tableName}`
    );

    return NextResponse.json({
      success: true,
      fields: fields,
      tableName: tableName
    });

  } catch (error) {
    console.error('Structure error for CST module:', error);
    return NextResponse.json({ 
      error: 'Failed to get table structure',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}