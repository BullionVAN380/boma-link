'use client';

import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import Link from 'next/link';

interface Location {
  city: string;
  state: string;
  country: string;
  type: string;
}

interface Job {
  _id: string;
  title: string;
  company: string;
  location: Location;
  employmentType: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'active';
  createdAt: string;
  userId: string;
}

export default function AdminJobList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs?isAdmin=true');
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (jobId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update job status');
      }

      // Update local state
      setJobs(prevJobs =>
        prevJobs.map(job =>
          job._id === jobId ? { ...job, status: newStatus as Job['status'] } : job
        )
      );
    } catch (error) {
      console.error('Error updating job status:', error);
    }
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) {
      return;
    }

    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete job');
      }

      // Remove job from local state
      setJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const formatSalary = (salary: Job['salary']) => {
    return `${salary.currency}${salary.min.toLocaleString()} - ${salary.currency}${salary.max.toLocaleString()}`;
  };

  const formatLocation = (location: Location) => {
    return `${location.city}, ${location.state}${location.country ? `, ${location.country}` : ''}`;
  };

  if (loading) {
    return <div>Loading jobs...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Job Listings</h2>
        <Link
          href="/jobs/create"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Job
        </Link>
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-3 px-4 text-left">Title</th>
            <th className="py-3 px-4 text-left">Company</th>
            <th className="py-3 px-4 text-left">Location</th>
            <th className="py-3 px-4 text-left">Type</th>
            <th className="py-3 px-4 text-left">Salary</th>
            <th className="py-3 px-4 text-left">Status</th>
            <th className="py-3 px-4 text-left">Date</th>
            <th className="py-3 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job._id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">{job.title}</td>
              <td className="py-3 px-4">{job.company}</td>
              <td className="py-3 px-4">{formatLocation(job.location)}</td>
              <td className="py-3 px-4">{job.employmentType}</td>
              <td className="py-3 px-4">{formatSalary(job.salary)}</td>
              <td className="py-3 px-4">
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    job.status === 'approved' || job.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : job.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {job.status}
                </span>
              </td>
              <td className="py-3 px-4">
                {new Date(job.createdAt).toLocaleDateString()}
              </td>
              <td className="py-3 px-4">
                <div className="flex space-x-2">
                  {job.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(job._id, 'approved')}
                        className="text-green-600 hover:text-green-800"
                        title="Approve"
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(job._id, 'rejected')}
                        className="text-red-600 hover:text-red-800"
                        title="Reject"
                      >
                        <FaTimes />
                      </button>
                    </>
                  )}
                  <Link
                    href={`/jobs/edit/${job._id}`}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <FaEdit />
                  </Link>
                  <button
                    onClick={() => handleDelete(job._id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {jobs.length === 0 && (
        <div className="text-center py-4 text-gray-500">No jobs found</div>
      )}
    </div>
  );
}
