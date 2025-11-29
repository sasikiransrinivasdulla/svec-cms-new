import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, unlink, access } from 'fs/promises';
import path from 'path';
import { verifyToken } from '@/lib/auth/auth';
import { extractFilePathFromUrl } from '@/utils/file-management';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'cst', 'bos-minutes');

// Ensure upload directory exists
async function ensureUploadDir() {
  try {
    await mkdir(UPLOAD_DIR, { recursive: true });
  } catch (error) {
    // Directory might already exist, ignore error
  }
}

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

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyCSTAccess(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const existingUrl = formData.get('existingUrl') as string; // For file replacement
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type (only PDF allowed)
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ 
        error: 'Only PDF files are allowed' 
      }, { status: 400 });
    }

    // Validate file size (5MB maximum)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: `File size exceeds 5MB limit. Current size: ${Math.round(file.size / (1024 * 1024) * 100) / 100}MB` 
      }, { status: 400 });
    }

    // Use original filename without timestamps for clean storage
    const filename = file.name;

    // Ensure upload directory exists
    await ensureUploadDir();

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const filepath = path.join(UPLOAD_DIR, filename);
    
    // If this is a file replacement, delete the old file first
    if (existingUrl) {
      try {
        const oldFilePath = extractFilePathFromUrl(existingUrl);
        if (oldFilePath) {
          const fullOldPath = path.join(process.cwd(), 'public', oldFilePath);
          await access(fullOldPath);
          await unlink(fullOldPath);
          console.log(`🔄 Deleted old BOS minutes PDF during replacement: ${oldFilePath}`);
        }
      } catch (error) {
        console.warn('Could not delete old BOS minutes file during replacement:', existingUrl, error);
        // Continue with upload even if old file deletion fails
      }
    }
    
    await writeFile(filepath, buffer);

    // Return the public URL
    const publicUrl = `/uploads/cst/bos-minutes/${filename}`;
    const fileSizeKB = Math.round(file.size / 1024);

    return NextResponse.json({
      success: true,
      data: {
        url: publicUrl,
        filename,
        size: fileSizeKB,
        originalName: file.name,
        isReplacement: !!existingUrl
      },
      message: existingUrl 
        ? `PDF replaced successfully (${fileSizeKB}KB). Previous file automatically deleted.`
        : `PDF uploaded successfully (${fileSizeKB}KB)`
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: 'Failed to upload file',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}