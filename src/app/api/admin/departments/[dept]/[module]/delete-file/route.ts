import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth/auth';
import { RowDataPacket } from 'mysql2';
import { extractFilePathFromUrl } from '@/utils/file-management';
import fs from 'fs/promises';

// Department modules mapping - same as parent route
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
    'extra-curricular': 'cai_extra_curricular',
    'faculty': 'cai_faculty',
    'faculty-achievements': 'cai_faculty_achievements',
    'faculty-development': 'cai_faculty_development_programs',
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
    'training-activities': 'mba_training_activities'
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

// Verify user authentication and department access
async function verifyDepartmentAccess(request: NextRequest, department: string) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Unauthorized', status: 401 };
  }

  const token = authHeader.substring(7);
  const user = verifyToken(token);

  if (!user) {
    return { error: 'Invalid token', status: 401 };
  }

  // Super admin can access all departments
  if (user.role === 'super_admin') {
    return { user };
  }

  // Allow any authenticated admin/dept user access
  if (user.role === 'admin' || user.role === 'dept') {
    return { user };
  }

  return { error: 'Insufficient permissions', status: 403 };
}

// DELETE - Delete a specific file from a record (using query params)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ dept: string; module: string }> }
) {
  return await handleFileDelete(request, params, 'query');
}

// POST - Delete a specific file from a record (using body params)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ dept: string; module: string }> }
) {
  return await handleFileDelete(request, params, 'body');
}

// Common file deletion handler
async function handleFileDelete(
  request: NextRequest,
  params: Promise<{ dept: string; module: string }>,
  paramSource: 'query' | 'body'
) {
  try {
    const { dept, module } = await params;

    let id: string | null = null;
    let field: string | null = null;
    let fileUrl: string | null = null;

    if (paramSource === 'query') {
      // DELETE method - get params from query string
      const { searchParams } = new URL(request.url);
      id = searchParams.get('id');
      field = searchParams.get('field');
    } else {
      // POST method - get params from body
      const body = await request.json();
      id = body.id;
      field = body.field;
      fileUrl = body.fileUrl; // Direct file URL deletion
    }

    console.log(`[DELETE FILE] Department: ${dept}, Module: ${module}, ID: ${id}, Field: ${field}, FileURL: ${fileUrl}`);

    if (!id && !fileUrl) {
      return NextResponse.json({ error: 'Record ID or file URL is required' }, { status: 400 });
    }

    if (!field && !fileUrl) {
      return NextResponse.json({ error: 'Field name or file URL is required' }, { status: 400 });
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

    let recordData: any = null;
    let targetFileUrl = fileUrl;

    // If we have an ID and field, get the file URL from the database
    if (id && field && !fileUrl) {
      // Get the current record to access the file URL
      const existingRecord = await query<RowDataPacket[]>(
        `SELECT * FROM ${tableName} WHERE id = ?`,
        [id]
      );

      if (existingRecord.length === 0) {
        return NextResponse.json({ error: 'Record not found' }, { status: 404 });
      }

      recordData = existingRecord[0];
      targetFileUrl = recordData[field];

      if (!targetFileUrl) {
        return NextResponse.json({ error: 'No file found in specified field' }, { status: 400 });
      }
    }

    console.log(`[DELETE FILE] Attempting to delete file: ${targetFileUrl}`);

    // Delete the physical file
    try {
      // Only attempt extraction if we have a file URL
      if (targetFileUrl) {
        // Extract file path from URL using the utility function
        const filePath = extractFilePathFromUrl(targetFileUrl);

        console.log(`[DELETE FILE] Extracted file path: ${filePath}`);

        if (filePath) {
          // Check if file exists before attempting deletion
          try {
            console.log(`[DELETE FILE] Checking if file exists at: ${filePath}`);
            await fs.access(filePath);
            console.log(`[DELETE FILE] File exists, proceeding with deletion`);

            await fs.unlink(filePath);
            console.log(`[DELETE FILE] ✅ Successfully deleted physical file: ${filePath}`);
          } catch (fileError) {
            console.warn(`[DELETE FILE] ❌ Could not delete physical file: ${filePath}`, fileError);
            // Continue with database update even if physical file deletion fails
          }
        } else {
          console.warn(`[DELETE FILE] ❌ Could not extract file path from URL: ${targetFileUrl}`);
        }
      } else {
        console.warn('[DELETE FILE] No targetFileUrl provided, skipping physical file deletion');
      }
    } catch (error) {
      console.warn(`[DELETE FILE] Error processing file deletion:`, error);
    }

    // Update the database to remove the file URL (only if we have ID and field)
    let updatedRecord = null;
    if (id && field) {
      // For hackathons-gallery, delete the entire record since it's a single-image module
      if (module === 'hackathons-gallery') {
        await query(`DELETE FROM ${tableName} WHERE id = ?`, [id]);
        console.log(`[DELETE FILE] ✅ Deleted entire hackathons-gallery record: ${id}`);
      } else {
        // For other modules, just set the field to NULL
        const updateQuery = `UPDATE ${tableName} SET ${field} = NULL WHERE id = ?`;
        await query(updateQuery, [id]);
        console.log(`[DELETE FILE] ✅ Set field ${field} to NULL for record ${id}`);

        // Fetch the updated record
        const updatedRecords = await query<RowDataPacket[]>(
          `SELECT * FROM ${tableName} WHERE id = ?`,
          [id]
        );
        updatedRecord = updatedRecords[0];
      }
    } else if (id && !field) {
      // If we have ID but no field and it's hackathons-gallery, delete the entire record
      if (module === 'hackathons-gallery') {
        console.log(`[DELETE FILE] Deleting hackathons-gallery record without explicit field: ${id}`);
        await query(`DELETE FROM ${tableName} WHERE id = ?`, [id]);
        console.log(`[DELETE FILE] ✅ Deleted entire hackathons-gallery record: ${id}`);
      }
    } else {
      console.log(`[DELETE FILE] No database record deletion performed (id: ${id}, field: ${field})`);
    }

    console.log(`[DELETE FILE] Successfully processed file deletion`);

    return NextResponse.json({
      success: true,
      data: updatedRecord,
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('[DELETE FILE] Error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({
      error: 'Internal server error',
      details: errorMessage
    }, { status: 500 });
  }
}