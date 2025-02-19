import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import JobModel from '@/models/job';
import { serializeDocument } from '@/lib/utils';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const job = await JobModel.findById(params.id)
      .populate('employer', 'name email');
    
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
      { error: 'Failed to fetch job details' },
      { status: 500 }
    );
  }
}
