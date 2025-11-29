import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, unlink, access } from 'fs/promises';
import path from 'path';
import { verifyToken } from '@/lib/auth/auth';
import { query } from '@/lib/db';
import { deleteFile, extractFilePathFromUrl } from '@/utils/file-management';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

// Verify user authentication and CST access
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

  // Allow super admin or CST department admin
  if (user.role === 'super_admin' || 
      (user.role === 'dept' && user.department === 'cst') ||
      user.role === 'admin') {
    return { user };
  }

  return { error: 'Insufficient permissions', status: 403 };
}

// Ensure upload directory exists
async function ensureUploadDir(moduleName: string) {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'cst', moduleName);
  try {
    await mkdir(uploadDir, { recursive: true });
    return uploadDir;
  } catch (error) {
    throw new Error('Failed to create upload directory');
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ module: string }> }
) {
  try {
    // Verify authentication
    const authResult = await verifyCSTAccess(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { module } = await params;
    
    if (!module) {
      return NextResponse.json({ error: 'Module parameter is required' }, { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const existingUrl = formData.get('existingUrl') as string; // For file replacement
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type (PDF, images, or documents)
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'File type not allowed. Supported: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX' 
      }, { status: 400 });
    }

    // Validate file size (5MB maximum)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: `File size exceeds 5MB limit. Current size: ${Math.round(file.size / (1024 * 1024) * 100) / 100}MB` 
      }, { status: 400 });
    }

    // Get file extension
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'pdf';

    // Use actual filename for all uploads without timestamps
    let filename: string;
    if (module === 'faculty') {
      // For faculty profiles, use faculty name from form data or original filename
      const facultyName = formData.get('facultyName') as string;
      const extension = file.name.split('.').pop();
      
      if (facultyName) {
        // Use faculty name for filename (e.g., "santhi rupa.pdf")
        filename = `${facultyName}.${extension}`;
      } else {
        // Fallback to original filename if faculty name not provided
        filename = file.name;
      }
    } else {
      // For all other modules, use the actual filename without timestamps
      filename = file.name;
    }

    // Ensure upload directory exists
    const uploadDir = await ensureUploadDir(module);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const filepath = path.join(uploadDir, filename);
    
    // If this is a file replacement, delete the old file first
    if (existingUrl) {
      try {
        const oldFilePath = extractFilePathFromUrl(existingUrl);
        if (oldFilePath) {
          const fullOldPath = path.join(process.cwd(), 'public', oldFilePath);
          await access(fullOldPath);
          await unlink(fullOldPath);
          console.log(`🔄 Deleted old file during replacement: ${oldFilePath}`);
        }
      } catch (error) {
        console.warn('Could not delete old file during replacement:', existingUrl, error);
        // Continue with upload even if old file deletion fails
      }
    }
    
    await writeFile(filepath, buffer);

    // Return the public URL
    const publicUrl = `/uploads/cst/${module}/${filename}`;
    const fileSizeKB = Math.round(file.size / 1024);

    return NextResponse.json({
      success: true,
      data: {
        url: publicUrl,
        filename,
        size: fileSizeKB,
        originalName: file.name,
        type: file.type,
        isReplacement: !!existingUrl
      },
      message: existingUrl 
        ? `File replaced successfully (${fileSizeKB}KB). Previous file automatically deleted.`
        : `File uploaded successfully (${fileSizeKB}KB)`
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: 'Failed to upload file',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}