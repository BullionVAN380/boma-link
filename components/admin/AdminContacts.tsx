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

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'pending' | 'resolved' | 'spam';
  createdAt: string;
  updatedAt: string;
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/contacts');
      setContacts(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch contacts');
      toast.error('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleStatusUpdate = async (contactId: string, status: 'pending' | 'resolved' | 'spam') => {
    try {
      await axios.patch('/api/admin/contacts', { id: contactId, status });
      setContacts(prevContacts =>
        prevContacts.map(contact =>
          contact._id === contactId ? { ...contact, status } : contact
        )
      );
      toast.success('Contact status updated successfully');
    } catch (err) {
      toast.error('Failed to update contact status');
    }
  };

  const handleDelete = async (contactId: string) => {
    try {
      await axios.delete(`/api/admin/contacts?id=${contactId}`);
      setContacts(prevContacts =>
        prevContacts.filter(contact => contact._id !== contactId)
      );
      toast.success('Contact deleted successfully');
    } catch (err) {
      toast.error('Failed to delete contact');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
        return <Badge className="bg-green-500">Resolved</Badge>;
      case 'spam':
        return <Badge className="bg-red-500">Spam</Badge>;
      default:
        return <Badge className="bg-yellow-500">Pending</Badge>;
    }
  };

  if (loading) {
    return <div>Loading contacts...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Messages</CardTitle>
        <CardDescription>
          Manage and respond to contact form submissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact._id}>
                <TableCell>
                  {format(new Date(contact.createdAt), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>{contact.name}</TableCell>
                <TableCell>
                  <a href={`mailto:${contact.email}`} className="text-blue-500 hover:underline">
                    {contact.email}
                  </a>
                </TableCell>
                <TableCell>
                  <a href={`tel:${contact.phone}`} className="text-blue-500 hover:underline">
                    {contact.phone}
                  </a>
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {contact.message}
                </TableCell>
                <TableCell>{getStatusBadge(contact.status)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusUpdate(contact._id, 'resolved')}
                      disabled={contact.status === 'resolved'}
                    >
                      Mark Resolved
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusUpdate(contact._id, 'spam')}
                      disabled={contact.status === 'spam'}
                    >
                      Mark Spam
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Contact</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this contact? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(contact._id)}
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
