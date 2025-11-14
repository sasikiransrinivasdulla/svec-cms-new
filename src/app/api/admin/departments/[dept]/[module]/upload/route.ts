import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, unlink, access } from 'fs/promises';
import { join } from 'path';
import { deleteRecordFiles, validateFileSize, isFileUrlField } from '@/utils/file-management';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ dept: string; module: string }> }
) {
  try {
    const { dept, module } = await params;
    
    // Skip CST department as it has its own upload endpoint
    if (dept === 'cst') {
      return NextResponse.json({
        success: false,
        error: 'CST department has its own upload endpoint. Use /api/admin/departments/cst/[module]/upload instead.'
      }, { status: 400 });
    }

    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'No file uploaded'
      }, { status: 400 });
    }

    // Validate file size (1MB limit)
    if (!validateFileSize(file.size)) {
      return NextResponse.json({
        success: false,
        error: `File size exceeds 1MB limit. Current size: ${Math.round(file.size / 1024)}KB`
      }, { status: 400 });
    }

    // Validate file type (only PDF for consistency)
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid file type. Only PDF, JPG, PNG, DOC, DOCX files are allowed.'
      }, { status: 400 });
    }

    // Create department/section directory structure
    const uploadDir = join(process.cwd(), 'public', 'uploads', dept, module);
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      console.error('Error creating upload directory:', error);
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}_${originalName}`;
    const filePath = join(uploadDir, fileName);

    // Write file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await writeFile(filePath, buffer);
    console.log(`File uploaded successfully: ${filePath}`);

    // Generate public URL
    const publicUrl = `/uploads/${dept}/${module}/${fileName}`;

    // Optional: If this is a replacement upload, delete the old file
    const existingUrl = data.get('existingUrl') as string;
    if (existingUrl) {
      try {
        const oldFilePath = join(process.cwd(), 'public', existingUrl);
        await access(oldFilePath);
        await unlink(oldFilePath);
        console.log(`Deleted old file: ${oldFilePath}`);
      } catch (error) {
        console.warn('Could not delete old file:', existingUrl, error);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        url: publicUrl,
        filename: fileName,
        originalName: file.name,
        size: Math.round(file.size / 1024), // Size in KB
        type: file.type,
        department: dept,
        module: module
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error during file upload'
    }, { status: 500 });
  }
}