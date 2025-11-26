import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const typeFilter = searchParams.get('type');

    let query = 'SELECT * FROM exam_section';
    let params: any[] = [];

    if (typeFilter === 'timetable') {
      // Fetch only timetables
      query += " WHERE type = 'timetable' ORDER BY posteddate DESC, date DESC";
    } else {
      // Exclude timetables from the result (default behavior)
      query += " WHERE type != 'timetable' ORDER BY posteddate DESC, date DESC";
    }

    const rows = await db.query(query, params);
    return NextResponse.json(Array.isArray(rows) ? rows : []);
  } catch (error) {
    console.error('Error fetching JNTUK exam sections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch JNTUK exam sections' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, content, degree, type, link, posteddate } = body;

    if (!content || !degree || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: content, degree, type' },
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO exam_section (date, content, degree, type, link, posteddate) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      date || new Date().toISOString().split('T')[0],
      content,
      degree,
      type,
      link || null,
      posteddate || new Date().toISOString().split('T')[0]
    ];

    await db.query(query, values);

    return NextResponse.json(
      { success: true, message: 'JNTUK exam section entry created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating JNTUK exam section entry:', error);
    return NextResponse.json(
      { error: 'Failed to create JNTUK exam section entry' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { sno } = body;

    if (!sno) {
      return NextResponse.json(
        { error: 'Missing required field: sno' },
        { status: 400 }
      );
    }

    // Get the record details first to retrieve the file link
    const records = await db.query('SELECT link FROM exam_section WHERE sno = ?', [sno]) as any[];
    
    // Delete the record
    const query = 'DELETE FROM exam_section WHERE sno = ?';
    await db.query(query, [sno]);

    // Delete the associated file if it exists
    if (records && records.length > 0 && records[0].link) {
      const { unlink } = await import('fs/promises');
      const { join } = await import('path');
      const filePath = join(process.cwd(), 'public', records[0].link.replace(/^\//, ''));
      try {
        await unlink(filePath);
      } catch (error) {
        console.error('Error deleting file:', error);
        // Continue even if file deletion fails
      }
    }

    return NextResponse.json(
      { success: true, message: 'JNTUK exam section entry deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting JNTUK exam section entry:', error);
    return NextResponse.json(
      { error: 'Failed to delete JNTUK exam section entry' },
      { status: 500 }
    );
  }
}