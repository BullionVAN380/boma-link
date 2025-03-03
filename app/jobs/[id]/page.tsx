'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Job } from '@/types/job';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import JobApplicationForm from '@/components/JobApplicationForm';

export default function JobDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`/api/jobs/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch job details');
        }
        const data = await response.json();
        setJob(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (status === 'unauthenticated') {
      router.push(`/auth/signin?callbackUrl=/jobs/${id}`);
    } else if (status === 'authenticated') {
      fetchJob();
    }
  }, [id, status, router]);

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-red-500 text-xl font-semibold mb-4">Error</h1>
          <p className="text-gray-700">{error || 'Job not found'}</p>
          <Link
            href="/jobs"
            className="mt-4 inline-block text-blue-600 hover:text-blue-800"
          >
            ← Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="mb-6">
            <Link
              href="/jobs"
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back to Jobs
            </Link>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
            <p className="text-xl text-gray-600">{job.company}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700">Location</h3>
              <p className="text-gray-600">
                {job.location && job.location.city ? 
                  `${job.location.city}, ${job.location.state} (${job.location.type})` : 
                  'Location not specified'
                }
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700">Employment Type</h3>
              <p className="text-gray-600">{job.employmentType}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700">Experience Level</h3>
              <p className="text-gray-600">{job.experienceLevel}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700">Salary Range</h3>
              <p className="text-gray-600">
                {job.salary.min && job.salary.max
                  ? `${job.salary.currency} ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}`
                  : 'Salary not specified'}
              </p>
            </div>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mb-4">Job Description</h2>
            <p className="text-gray-700 whitespace-pre-line mb-6">{job.description}</p>

            <h2 className="text-xl font-semibold mb-4">Requirements</h2>
            <ul className="list-disc pl-5 mb-6">
              {job.requirements.map((req, index) => (
                <li key={index} className="text-gray-700 mb-2">{req}</li>
              ))}
            </ul>

            {job.benefits && job.benefits.length > 0 && (
              <>
                <h2 className="text-xl font-semibold mb-4">Benefits</h2>
                <ul className="list-disc pl-5">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="text-gray-700 mb-2">{benefit}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        {/* Job Application Form */}
        <JobApplicationForm jobId={job._id} jobTitle={job.title} />
      </div>
    </div>
  );
}
