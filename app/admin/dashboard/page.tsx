'use client';

import { useState, useEffect } from 'react';
import AdminPropertyList from '@/components/admin/AdminPropertyList';
import { Property } from '@/types';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function AdminDashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/auth/signin');
    }

    if (!session?.user?.isAdmin) {
      redirect('/');
    }
  }, [session, status]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/properties?isAdmin=true');
        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleStatusUpdate = (propertyId: string, newStatus: string) => {
    setProperties(prevProperties =>
      prevProperties.map(property =>
        property._id === propertyId
          ? { ...property, status: newStatus }
          : property
      )
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <AdminPropertyList
            properties={properties}
            onStatusUpdate={handleStatusUpdate}
          />
        </div>
      </div>
    </div>
  );
}
