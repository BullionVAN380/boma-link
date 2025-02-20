import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/db';
import { getApplicationModel } from '@/models/application';
import { getJobModel } from '@/models/job';
import { getUserModel } from '@/models/user';
import { serializeDocuments } from '@/lib/utils';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const Application = await getApplicationModel();
    const Job = await getJobModel();
    const User = await getUserModel();

    // Get all applications with populated job and user details
    const applications = await Application.find()
      .populate({
        path: 'jobId',
        model: Job,
        select: 'title company'
      })
      .populate({
        path: 'userId',
        model: User,
        select: 'name email'
      })
      .sort({ createdAt: -1 })
      .lean();

    // Transform the data to match frontend expectations
    const transformedApplications = applications.map(app => ({
      _id: app._id.toString(),
      status: app.status,
      resume: app.resume,
      coverLetter: app.coverLetter,
      createdAt: app.createdAt,
      job: {
        title: app.jobId?.title || 'Unknown Job',
        company: app.jobId?.company || 'Unknown Company'
      },
      applicant: {
        name: app.userId?.name || 'Unknown User',
        email: app.userId?.email || 'No email'
      }
    }));

    return NextResponse.json(transformedApplications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}
