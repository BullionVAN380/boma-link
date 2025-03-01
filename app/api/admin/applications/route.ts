import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/db';
import { getApplicationModel } from '@/models/application';
import { getJobModel } from '@/models/job';
import { getUserModel } from '@/models/user';
import { serializeDocuments } from '@/lib/utils';
import { ObjectId } from 'mongodb';

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
      user: {
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

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id, status } = await req.json();

    if (!id || !status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const Application = await getApplicationModel();

    const application = await Application.findByIdAndUpdate(
      id,
      { 
        status,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Application ID is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const Application = await getApplicationModel();

    const result = await Application.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Error deleting application:', error);
    return NextResponse.json(
      { error: 'Failed to delete application' },
      { status: 500 }
    );
  }
}
