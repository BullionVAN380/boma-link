import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/db';
import { getApplicationModel } from '@/models/application';

export const runtime = 'nodejs'; // Set runtime to nodejs

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

    const Application = await getApplicationModel();

    const application = new Application({
      jobId,
      userId: session.user.id,
      status: 'pending',
      resume: {
        name: resume.name || 'resume',
        // TODO: Implement file upload to cloud storage
        url: '',
      },
      coverLetter: coverLetter ? {
        name: coverLetter.name || 'cover-letter',
        // TODO: Implement file upload to cloud storage
        url: '',
      } : null
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
