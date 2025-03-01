'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { PlusIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import JobCard from '@/components/JobCard';
import { Job } from '@/types/job';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface JobsListProps {
  jobs: Job[];
}

export default function JobsList({ jobs = [] }: JobsListProps) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';
  const [filter, setFilter] = useState('all');

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex gap-4">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className="min-w-[100px]"
          >
            All Jobs
          </Button>
          <Button
            variant={filter === 'fulltime' ? 'default' : 'outline'}
            onClick={() => setFilter('fulltime')}
            className="min-w-[100px]"
          >
            Full Time
          </Button>
          <Button
            variant={filter === 'contract' ? 'default' : 'outline'}
            onClick={() => setFilter('contract')}
            className="min-w-[100px]"
          >
            Contract
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <AdjustmentsHorizontalIcon className="h-5 w-5" />
            More Filters
          </Button>
          {isAdmin && (
            <Link href="/jobs/create">
              <Button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700">
                <PlusIcon className="h-5 w-5" />
                Post a Job
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div
              key={job._id}
              className="transform hover:scale-[1.01] transition-transform duration-300"
            >
              <JobCard job={job} />
            </div>
          ))
        ) : (
          <Card className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Jobs Available</h3>
              <p className="text-gray-500 mb-6">
                We're currently not hiring. Please check back later for new opportunities.
              </p>
              <Button variant="outline">Get Job Alerts</Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
