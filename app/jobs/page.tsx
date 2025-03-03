import { Metadata } from 'next';
import { getJobModel } from '@/lib/server/models/job';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Jobs | Affordable Housing',
  description: 'Browse and apply for jobs at Affordable Housing',
};

export const runtime = 'nodejs';

export default async function JobsPage() {
  const Job = await getJobModel();
  const jobs = await Job.find({ status: 'active' })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  const formatLocation = (location: any) => {
    if (typeof location === 'string') return location;
    if (typeof location === 'object' && location !== null) {
      const { city, state, country } = location;
      return [city, state, country].filter(Boolean).join(', ');
    }
    return 'Location not specified';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Career Opportunities</h1>
          <Link href="/jobs/create">
            <Button>Post a Job</Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <Link key={job._id.toString()} href={`/jobs/${job._id}`}>
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
                <p className="text-gray-600 mb-2">{job.company}</p>
                <p className="text-gray-500 mb-4">{formatLocation(job.location)}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {job.type}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
