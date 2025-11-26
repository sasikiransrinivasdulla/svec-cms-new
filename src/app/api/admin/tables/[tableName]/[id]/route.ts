import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { unlink } from 'fs/promises';
import { join } from 'path';

const dbConfig = {
  host: process.env.DB_HOST || '62.72.31.209',
  user: process.env.DB_USER || 'cmsuser',
  password: process.env.DB_PASSWORD || 'V@savi@2001',
  database: process.env.DB_NAME || 'svec_cms',
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tableName: string; id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { tableName, id } = resolvedParams;

    const connection = await mysql.createConnection(dbConfig);

    // Get single record
    const [records] = await connection.execute(
      `SELECT * FROM ${tableName} WHERE id = ?`,
      [id]
    );

    await connection.end();

    const record = (records as any[])[0];
    
    if (!record) {
      return NextResponse.json(
        { success: false, error: 'Record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: record
    });

  } catch (error) {
    console.error('Error fetching record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch record' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ tableName: string; id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { tableName, id } = resolvedParams;
    const data = await request.json();

    const connection = await mysql.createConnection(dbConfig);

    // Get the existing record to check for files to delete
    const [existingRecords] = await connection.execute(
      `SELECT * FROM ${tableName} WHERE id = ?`,
      [id]
    );

    const existingRecord = (existingRecords as any[])[0];

    // Get table columns to validate data
    const [columnsResult] = await connection.execute(
      `SHOW COLUMNS FROM ${tableName}`
    );
    const columns = (columnsResult as any[]).map(col => col.Field);
    const updatableColumns = columns.filter(col => col !== 'id' && !col.includes('created_at'));

    // Prepare update data
    const updateData: any = {};
    const fileColumns = [
      'profileUrl', 'profile_url', 'image_url', 'photo_url', 'attachment', 
      'document', 'file_url', 'pdf_url', 'link', 'document_url', 'file',
      'hod_image_url', 'image', 'banner', 'banner_url'
    ];

    updatableColumns.forEach(col => {
      if (data[col] !== undefined) {
        updateData[col] = data[col];

        // If a file column is being updated, delete the old file
        if (existingRecord && fileColumns.some(fcol => fcol.toLowerCase() === col.toLowerCase())) {
          const oldFileUrl = existingRecord[col];
          if (oldFileUrl && data[col] !== oldFileUrl) {
            // File has been replaced, delete old file
            if (!oldFileUrl.startsWith('http')) {
              try {
                const filePath = join(process.cwd(), 'public', oldFileUrl.replace(/^\//, ''));
                unlink(filePath).catch(err => {
                  console.error(`Error deleting old file ${oldFileUrl}:`, err);
                  // Continue even if deletion fails
                });
              } catch (error) {
                console.error(`Error processing file deletion for ${oldFileUrl}:`, error);
              }
            }
          }
        }
      }
    });

    if (Object.keys(updateData).length === 0) {
      await connection.end();
      return NextResponse.json(
        { success: false, error: 'No valid data provided' },
        { status: 400 }
      );
    }

    // Update record
    const fields = Object.keys(updateData);
    const values = Object.values(updateData);
    const setClause = fields.map(field => `${field} = ?`).join(', ');

    const [result] = await connection.execute(
      `UPDATE ${tableName} SET ${setClause} WHERE id = ?`,
      [...values, id]
    );

    await connection.end();

    if ((result as any).affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        message: 'Record updated successfully'
      }
    });

  } catch (error) {
    console.error('Error updating record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update record' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ tableName: string; id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { tableName, id } = resolvedParams;

    const connection = await mysql.createConnection(dbConfig);

    // Get the record first to extract file URLs
    const [records] = await connection.execute(
      `SELECT * FROM ${tableName} WHERE id = ?`,
      [id]
    );

    const record = (records as any[])[0];

    // Delete record
    const [result] = await connection.execute(
      `DELETE FROM ${tableName} WHERE id = ?`,
      [id]
    );

    await connection.end();

    if ((result as any).affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Record not found' },
        { status: 404 }
      );
    }

    // Delete associated files if the record had file URLs
    if (record) {
      const fileColumns = [
        'profileUrl', 'profile_url', 'image_url', 'photo_url', 'attachment', 
        'document', 'file_url', 'pdf_url', 'link', 'document_url', 'file',
        'hod_image_url', 'image', 'banner', 'banner_url'
      ];

      for (const [key, value] of Object.entries(record)) {
        if (fileColumns.some(col => col.toLowerCase() === key.toLowerCase()) && value) {
          const fileUrl = value as string;
          if (fileUrl && (fileUrl.startsWith('/') || fileUrl.startsWith('http'))) {
            try {
              // Extract path from URL
              let filePath: string;
              if (fileUrl.startsWith('http')) {
                // It's a full URL, skip it
                continue;
              } else {
                // It's a relative path
                filePath = join(process.cwd(), 'public', fileUrl.replace(/^\//, ''));
              }
              
              await unlink(filePath);
            } catch (error) {
              console.error(`Error deleting file ${fileUrl}:`, error);
              // Continue with deletion even if file doesn't exist
            }
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        message: 'Record deleted successfully'
      }
    });

  } catch (error) {
    console.error('Error deleting record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete record' },
      { status: 500 }
    );
  }
}