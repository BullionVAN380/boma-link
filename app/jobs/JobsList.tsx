'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import JobCard from '@/components/JobCard';
import { Job } from '@/types/job';

interface JobsListProps {
  jobs: Job[];
}

export default function JobsList({ jobs = [] }: JobsListProps) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Opportunities</h1>
          <p className="mt-2 text-gray-600">Find your next role in real estate and property management</p>
        </div>
        {isAdmin && (
          <Link
            href="/jobs/create"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Post a Job
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs available</h3>
            <p className="text-gray-500">Check back later for new opportunities</p>
          </div>
        )}
      </div>
    </div>
  );
}
