import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Get file extension
    const originalName = file.name;
    const extension = path.extname(originalName);
    
    // Create unique filename
    const filename = `${uuidv4()}${extension}`;
    const relativePath = `/uploads/${filename}`;
    const absolutePath = path.join(process.cwd(), 'public', relativePath);

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public/uploads');
    try {
      await writeFile(path.join(process.cwd(), 'public/uploads/.gitkeep'), '');
    } catch (error) {
      // Directory already exists
    }

    // Write file
    await writeFile(absolutePath, buffer);

    return NextResponse.json({ url: relativePath });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Error uploading file' },
      { status: 500 }
    );
  }
}
