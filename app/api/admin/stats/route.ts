import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { getPropertyModel } from '@/lib/server/models/property';
import { getUserModel } from '@/lib/server/models/user';
import { getJobModel } from '@/lib/server/models/job';
import { withErrorHandler, jsonResponse } from '@/lib/api-wrapper';
import { throwIfUnauthorized } from '@/lib/api-error';

export const GET = withErrorHandler(async (request: Request) => {
  const session = await getServerSession(authOptions);
  throwIfUnauthorized(
    session?.user?.role === 'admin',
    'Only administrators can access stats'
  );

  const PropertyModel = await getPropertyModel();
  const UserModel = await getUserModel();
  const JobModel = await getJobModel();

  // Get counts
  const [
    totalProperties,
    pendingProperties,
    totalUsers,
    totalJobs,
    pendingJobs
  ] = await Promise.all([
    PropertyModel.countDocuments(),
    PropertyModel.countDocuments({ status: 'pending' }),
    UserModel.countDocuments(),
    JobModel.countDocuments(),
    JobModel.countDocuments({ status: 'pending' })
  ]);

  // Get recent activity
  const recentProperties = await PropertyModel.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  const recentJobs = await JobModel.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  return jsonResponse({
    counts: {
      totalProperties,
      pendingProperties,
      totalUsers,
      totalJobs,
      pendingJobs
    },
    recentActivity: {
      properties: recentProperties,
      jobs: recentJobs
    }
  });
});
