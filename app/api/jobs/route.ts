import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import JobModel from '@/models/job';
import { serializeDocuments, serializeDocument } from '@/lib/utils';

// GET /api/jobs - Get all jobs or filter by query params
export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    
    // Build filter object based on query parameters
    const filters: any = { status: 'active' };
    if (searchParams.get('location')) {
      filters['location.city'] = new RegExp(searchParams.get('location') as string, 'i');
    }
    if (searchParams.get('employmentType')) {
      filters.employmentType = searchParams.get('employmentType');
    }
    if (searchParams.get('experienceLevel')) {
      filters.experienceLevel = searchParams.get('experienceLevel');
    }
    
    const jobs = await JobModel.find(filters)
      .populate('employer', 'name email')
      .sort({ createdAt: -1 });
      
    return NextResponse.json(serializeDocuments(jobs));
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

// POST /api/jobs - Create a new job (admin only)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Only administrators can create job listings' }, { status: 403 });
    }

    await connectDB();
    const data = await request.json();
    
    const job = await JobModel.create({
      ...data,
      employer: session.user.id,
      status: 'active'
    });
    
    return NextResponse.json(serializeDocument(job), { status: 201 });
  } catch (error) {
    console.error('Failed to create job:', error);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}

// PUT /api/jobs - Update a job (admin only)
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Only administrators can update job listings' }, { status: 403 });
    }

    await connectDB();
    const data = await request.json();
    const { id, ...updateData } = data;
    
    const job = await JobModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('employer', 'name email');
    
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    
    return NextResponse.json(serializeDocument(job));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
  }
}

// DELETE /api/jobs - Delete a job (admin only)
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Only administrators can delete job listings' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    await connectDB();
    
    const job = await JobModel.findByIdAndDelete(id);
    
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Job deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
  }
}
