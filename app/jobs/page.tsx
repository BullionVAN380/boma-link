import { Metadata } from 'next';
import { getJobModel } from '@/models/job';
import { connectToDatabase } from '@/lib/db';
import JobsList from './JobsList';
import { serializeDocuments } from '@/lib/utils';
import type { Job } from '@/types/job';

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
      .lean(); // Convert to plain JavaScript objects

    const serializedJobs = serializeDocuments<Job>(jobs);

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Available Jobs</h1>
        <JobsList jobs={serializedJobs} />
      </div>
    );
  } catch (error) {
    console.error('Failed to fetch jobs:', error);
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Available Jobs</h1>
        <JobsList jobs={[]} />
      </div>
    );
  }
}
