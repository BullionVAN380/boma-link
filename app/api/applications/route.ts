import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/db';
import { getApplicationModel } from '@/models/application';
import { writeFile } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs'; // Set runtime to nodejs

async function saveFile(file: Blob, userId: string, type: 'resume' | 'coverLetter'): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create a unique filename
  const originalName = file.name || `${type}.pdf`;
  const extension = path.extname(originalName);
  const filename = `${userId}-${type}-${Date.now()}${extension}`;
  
  // Save to public/uploads directory
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  const filePath = path.join(uploadDir, filename);
  
  // Ensure the uploads directory exists
  await writeFile(filePath, buffer);
  
  // Return the public URL
  return `/uploads/${filename}`;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'You must be signed in to apply for jobs' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const jobId = formData.get('jobId');
    const resume = formData.get('resume') as Blob | null;
    const coverLetter = formData.get('coverLetter') as Blob | null;

    if (!jobId || !resume) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Save files and get their URLs
    const resumeUrl = await saveFile(resume, session.user.id, 'resume');
    let coverLetterUrl: string | undefined;
    if (coverLetter) {
      coverLetterUrl = await saveFile(coverLetter, session.user.id, 'coverLetter');
    }

    const Application = await getApplicationModel();

    const application = new Application({
      jobId,
      userId: session.user.id,
      status: 'pending',
      resume: {
        name: resume.name || 'resume',
        url: resumeUrl,
      },
      ...(coverLetter && coverLetterUrl ? {
        coverLetter: {
          name: coverLetter.name || 'cover-letter',
          url: coverLetterUrl,
        }
      } : {})
    });

    await application.save();

    return NextResponse.json(
      { message: 'Application submitted successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}
