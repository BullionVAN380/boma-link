import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { getJobModel } from '@/models/job';
import { serializeDocument } from '@/lib/utils';

export const runtime = 'nodejs'; // Set runtime to nodejs

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await connectToDatabase();
    const Job = await getJobModel();

    const job = await Job.findById(id).populate('employer', 'name email');
    
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(serializeDocument(job));
  } catch (error) {
    console.error('Failed to fetch job:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job' },
      { status: 500 }
    );
  }
}
