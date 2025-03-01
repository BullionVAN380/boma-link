import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import axios from 'axios';
import { format } from 'date-fns';

interface Application {
  _id: string;
  jobId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  resume: {
    name: string;
    url: string;
  };
  coverLetter?: {
    name: string;
    url: string;
  };
  createdAt: string;
  user?: {
    name: string;
    email: string;
  };
  job?: {
    title: string;
    company: string;
  };
}

export default function AdminApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/applications');
      setApplications(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch applications');
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusUpdate = async (applicationId: string, status: 'approved' | 'rejected') => {
    try {
      await axios.patch('/api/admin/applications', { id: applicationId, status });
      setApplications(prevApplications =>
        prevApplications.map(app =>
          app._id === applicationId ? { ...app, status } : app
        )
      );
      toast.success('Application status updated successfully');
    } catch (err) {
      toast.error('Failed to update application status');
    }
  };

  const handleDelete = async (applicationId: string) => {
    try {
      await axios.delete(`/api/admin/applications?id=${applicationId}`);
      setApplications(prevApplications =>
        prevApplications.filter(app => app._id !== applicationId)
      );
      toast.success('Application deleted successfully');
    } catch (err) {
      toast.error('Failed to delete application');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-500">Pending</Badge>;
    }
  };

  if (loading) {
    return <div>Loading applications...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Applications</CardTitle>
        <CardDescription>
          Manage and review job applications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Applicant</TableHead>
              <TableHead>Job</TableHead>
              <TableHead>Resume</TableHead>
              <TableHead>Cover Letter</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((application) => (
              <TableRow key={application._id}>
                <TableCell>
                  {format(new Date(application.createdAt), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{application.user?.name}</div>
                    <div className="text-sm text-gray-500">{application.user?.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{application.job?.title}</div>
                    <div className="text-sm text-gray-500">{application.job?.company}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <a 
                    href={application.resume.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View Resume
                  </a>
                </TableCell>
                <TableCell>
                  {application.coverLetter ? (
                    <a
                      href={application.coverLetter.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View Cover Letter
                    </a>
                  ) : (
                    <span className="text-gray-500">Not provided</span>
                  )}
                </TableCell>
                <TableCell>{getStatusBadge(application.status)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusUpdate(application._id, 'approved')}
                      disabled={application.status === 'approved'}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusUpdate(application._id, 'rejected')}
                      disabled={application.status === 'rejected'}
                    >
                      Reject
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Application</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this application? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(application._id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
