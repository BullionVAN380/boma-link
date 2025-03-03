export const runtime = 'nodejs'; // Set runtime to nodejs

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { getJobModel } from '@/lib/server/models/job';

// POST /api/jobs - Create a new job (admin only)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only administrators can create job listings' },
        { status: 403 }
      );
    }

    const data = await request.json();

    // Validate required fields
    const requiredFields = ['title', 'company', 'description', 'location', 'employmentType', 'experienceLevel'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate location fields
    if (!data.location.city || !data.location.state || !data.location.type) {
      return NextResponse.json(
        { error: 'Location city, state, and type are required' },
        { status: 400 }
      );
    }

    // Validate salary
    if (!data.salary?.min || !data.salary?.max || data.salary.min < 0 || data.salary.max < 0) {
      return NextResponse.json(
        { error: 'Valid salary range is required' },
        { status: 400 }
      );
    }

    const Job = await getJobModel();
    
    const job = await Job.create({
      ...data,
      employer: session.user.id,
      status: 'active'
    });

    // Populate the employer details
    await job.populate('employer', 'name email');

    return NextResponse.json(job);
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// GET /api/jobs - Get all jobs or filter by query params
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'active';
    const type = searchParams.get('type');
    const location = searchParams.get('location');
    
    const query: any = { status };
    
    if (type && type !== 'all') {
      query.employmentType = type;
    }
    
    if (location) {
      query['location.city'] = new RegExp(location, 'i');
    }
    
    const Job = await getJobModel();
    const jobs = await Job.find(query)
      .populate('employer', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
