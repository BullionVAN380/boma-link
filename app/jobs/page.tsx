import { Metadata } from 'next';
import { getJobModel } from '@/models/job';
import { connectToDatabase } from '@/lib/db';
import JobsList from './JobsList';
import { serializeDocuments } from '@/lib/utils';
import type { Job } from '@/types/job';
import { Card } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Jobs | Affordable Housing',
  description: 'Browse and apply for jobs at Affordable Housing',
};

export const dynamic = 'force-dynamic';

export default async function JobsPage() {
  try {
    await connectToDatabase();
    const Job = await getJobModel();
    
    const jobs = await Job.find({ status: 'active' })
      .populate('employer', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    const serializedJobs = serializeDocuments<Job>(jobs);

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Career Opportunities</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join our team and make a difference in affordable housing
            </p>
          </div>
          <JobsList jobs={serializedJobs} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Failed to fetch jobs:', error);
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Career Opportunities</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join our team and make a difference in affordable housing
            </p>
          </div>
          <Card className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Jobs</h3>
              <p className="text-gray-500">
                We're having trouble loading the job listings. Please try again later.
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  }
}
