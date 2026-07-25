import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { join } from 'path';
import sharp from 'sharp';
import { isAuthorized } from '@/lib/auth';

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    // Validate MIME type (only allow images and videos)
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { success: false, error: 'File type not allowed. Only images and videos are permitted.' }, 
        { status: 400 }
      );
    }

    // Validate file extension against whitelist
    const dotIndex = file.name.lastIndexOf('.');
    const ext = dotIndex !== -1 ? file.name.substring(dotIndex).toLowerCase() : '';
    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.mp4', '.mov', '.webm', '.avi', '.mkv'];

    if (!allowedExtensions.includes(ext)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file extension. Only standard media formats are allowed.' }, 
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public/uploads directory
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    let fileUrl = '';

    // If it's an image, compress and convert to WebP dynamically
    if (isImage) {
      const sanitizedBase = file.name
        .replace(/\.[^/.]+$/, '') // remove extension
        .replace(/[^a-zA-Z0-9-_]/g, '_') // replace special characters with _
        .replace(/__+/g, '_'); // collapse multiple underscores
      const webpFilename = `${Date.now()}-${sanitizedBase}.webp`;
      const webpFilePath = join(uploadDir, webpFilename);

      const compressedBuffer = await sharp(buffer)
        .resize({ width: 1920, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer();

      await fs.writeFile(webpFilePath, compressedBuffer);
      fileUrl = `/uploads/${webpFilename}`;
    } else {
      // For videos or other media, save normally with sanitized name
      const base = dotIndex !== -1 ? file.name.substring(0, dotIndex) : file.name;
      const sanitizedBase = base
        .replace(/[^a-zA-Z0-9-_]/g, '_')
        .replace(/__+/g, '_');
      const uniqueFilename = `${Date.now()}-${sanitizedBase}${ext}`;
      const filePath = join(uploadDir, uniqueFilename);
      await fs.writeFile(filePath, buffer);
      fileUrl = `/uploads/${uniqueFilename}`;
    }

    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error) {
    console.error('File upload API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
