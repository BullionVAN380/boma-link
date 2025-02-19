import React from 'react';
import Link from 'next/link';
import { formatDistance } from 'date-fns';
import { Job } from '@/types/job';
import { MapPinIcon, BriefcaseIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 hover:text-indigo-600 mb-1">
              {job.title}
            </h3>
            <p className="text-lg text-gray-700 mb-2">{job.company}</p>
          </div>
          <span className="text-sm text-gray-500">
            {formatDistance(new Date(job.createdAt), new Date(), { addSuffix: true })}
          </span>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center text-gray-600">
            <MapPinIcon className="h-5 w-5 mr-2 text-gray-400" />
            <span>{job.location.city}, {job.location.state} • {job.location.type}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <BriefcaseIcon className="h-5 w-5 mr-2 text-gray-400" />
            <span className="capitalize">{job.employmentType} • {job.experienceLevel} level</span>
          </div>

          <div className="flex items-center text-gray-600">
            <CurrencyDollarIcon className="h-5 w-5 mr-2 text-gray-400" />
            <span>
              {job.salary.min && job.salary.max
                ? `${job.salary.currency} ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}`
                : 'Salary not specified'}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-gray-600 line-clamp-2">{job.description}</p>
        </div>

        <Link
          href={`/jobs/${job._id}`}
          className="inline-block px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors duration-200"
        >
          View Details
        </Link>

        <div className="flex flex-wrap gap-2 mb-4">
          {job.requirements.slice(0, 3).map((req, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
            >
              {req}
            </span>
          ))}
          {job.requirements.length > 3 && (
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
              +{job.requirements.length - 3} more
            </span>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(job.employer.name)}&background=random`}
              alt={job.employer.name}
              className="h-8 w-8 rounded-full mr-2"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">{job.employer.name}</p>
              <p className="text-xs text-gray-500">Posted by</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
