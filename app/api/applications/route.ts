import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getApplicationModel } from '@/lib/server/models/application';

export const runtime = 'nodejs';

async function fileFromFormData(formData: FormData, fieldName: string) {
  const file = formData.get(fieldName);
  if (!file || typeof file === 'string') return null;
  
  const arrayBuffer = await file.arrayBuffer();
  return {
    data: Buffer.from(arrayBuffer),
    contentType: file.type,
    filename: file.name
  };
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const jobId = formData.get('jobId');
    
    // Get files
    const resume = await fileFromFormData(formData, 'resume');
    const coverLetter = await fileFromFormData(formData, 'coverLetter');

    if (!jobId || !resume) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const Application = await getApplicationModel();
    
    const application = await Application.create({
      jobId,
      userId: session.user.id,
      resume,
      ...(coverLetter && { coverLetter }),
      status: 'pending'
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const Application = await getApplicationModel();
    const applications = await Application.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
