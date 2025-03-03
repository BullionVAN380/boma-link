import { Badge } from '@/components/ui/badge';
import { Job } from '@/types/job';
import { formatDistance } from 'date-fns';

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const formatSalary = (min: number, max: number) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    });
    return `${formatter.format(min)} - ${formatter.format(max)}`;
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">{job.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{job.company}</p>
        </div>
        <Badge variant={job.type === 'full-time' ? 'default' : 'secondary'}>
          {job.type}
        </Badge>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-600">Location</p>
          <p className="font-medium">{job.location}</p>
        </div>

        <div>
          <p className="text-sm text-gray-600">Salary Range</p>
          <p className="font-medium">
            {formatSalary(job.salaryMin, job.salaryMax)}
            {job.salaryPeriod && ` per ${job.salaryPeriod}`}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-600">Experience</p>
          <p className="font-medium">{job.experience}</p>
        </div>

        {job.requirements && (
          <div>
            <p className="text-sm text-gray-600 mb-1">Key Requirements</p>
            <ul className="list-disc list-inside text-sm space-y-1">
              {job.requirements.slice(0, 3).map((req, index) => (
                <li key={index} className="text-gray-700">{req}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-2">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Status: <Badge>{job.status}</Badge></span>
            <span>Posted {formatDistance(new Date(job.createdAt), new Date(), { addSuffix: true })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
