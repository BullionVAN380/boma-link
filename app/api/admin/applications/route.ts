import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

// Get the Application model
const Application = mongoose.models.Application || mongoose.model('Application', new mongoose.Schema({
  jobId: String,
  userId: String,
  status: String,
  resume: {
    name: String,
    url: String,
  },
  coverLetter: {
    name: String,
    url: String,
  },
  createdAt: { type: Date, default: Date.now },
}));

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Aggregate to get job and applicant details
    const applications = await Application.aggregate([
      {
        $lookup: {
          from: 'jobs',
          let: { jobId: { $toObjectId: '$jobId' } },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$_id', '$$jobId'] }
              }
            },
            {
              $project: {
                title: 1,
                company: 1
              }
            }
          ],
          as: 'jobDetails'
        }
      },
      {
        $lookup: {
          from: 'users',
          let: { userId: { $toObjectId: '$userId' } },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$_id', '$$userId'] }
              }
            },
            {
              $project: {
                name: 1,
                email: 1
              }
            }
          ],
          as: 'applicantDetails'
        }
      },
      {
        $addFields: {
          job: {
            $cond: {
              if: { $gt: [{ $size: '$jobDetails' }, 0] },
              then: {
                title: { $arrayElemAt: ['$jobDetails.title', 0] },
                company: { $arrayElemAt: ['$jobDetails.company', 0] }
              },
              else: null
            }
          },
          applicant: {
            $cond: {
              if: { $gt: [{ $size: '$applicantDetails' }, 0] },
              then: {
                name: { $arrayElemAt: ['$applicantDetails.name', 0] },
                email: { $arrayElemAt: ['$applicantDetails.email', 0] }
              },
              else: null
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          status: 1,
          resume: 1,
          coverLetter: 1,
          createdAt: 1,
          job: 1,
          applicant: 1
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}
