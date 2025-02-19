'use client';

import { useState } from 'react';
import { FiUpload, FiFile } from 'react-icons/fi';

interface JobApplicationFormProps {
  jobId: string;
  jobTitle: string;
}

export default function JobApplicationForm({ jobId, jobTitle }: JobApplicationFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resume, setResume] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('jobId', jobId);
      if (resume) formData.append('resume', resume);
      if (coverLetter) formData.append('coverLetter', coverLetter);

      const response = await fetch('/api/applications', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit application');
      }

      setSuccess('Application submitted successfully!');
      e.currentTarget.reset();
      setResume(null);
      setCoverLetter(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Apply for {jobTitle}</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 rounded-md">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 rounded-md">
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Resume/CV (PDF)
          </label>
          <div className="flex items-center">
            <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
              <div className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:border-indigo-500">
                <FiUpload className="w-5 h-5" />
                <span>{resume ? resume.name : 'Upload Resume'}</span>
              </div>
              <input
                type="file"
                className="sr-only"
                accept=".pdf"
                onChange={(e) => e.target.files?.[0] && setResume(e.target.files[0])}
                required
              />
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cover Letter (Optional)
          </label>
          <div className="flex items-center">
            <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
              <div className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:border-indigo-500">
                <FiFile className="w-5 h-5" />
                <span>{coverLetter ? coverLetter.name : 'Upload Cover Letter'}</span>
              </div>
              <input
                type="file"
                className="sr-only"
                accept=".pdf,.doc,.docx"
                onChange={(e) => e.target.files?.[0] && setCoverLetter(e.target.files[0])}
              />
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
        >
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
}
