import { Metadata } from 'next';
import { Job } from '@/types/job';
import { serializeDocuments } from '@/lib/utils';
import connectDB from '@/lib/mongodb';
import JobModel from '@/models/job';
import JobsList from './JobsList';

export const metadata: Metadata = {
  title: 'Jobs | Affordable Housing',
  description: 'Find real estate and property management job opportunities',
};

async function getJobs() {
  try {
    await connectDB();
    const jobs = await JobModel.find({ status: 'active' })
      .populate('employer', 'name email')
      .sort({ createdAt: -1 });
    return serializeDocuments<Job>(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
}

export default async function JobsPage() {
  const jobs = await getJobs();
  return (
    <div className="min-h-screen bg-gray-50">
      <JobsList initialJobs={jobs} />
    </div>
  );
}
