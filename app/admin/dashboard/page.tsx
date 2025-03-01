'use client';

import { useState, useEffect } from 'react';
import AdminPropertyList from '@/components/admin/AdminPropertyList';
import AdminUserList from '@/components/admin/AdminUserList';
import AdminAnalytics from '@/components/admin/AdminAnalytics';
import AdminContacts from '@/components/admin/AdminContacts';
import AdminApplications from '@/components/admin/AdminApplications';
import { Property } from '@/types';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function AdminDashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('properties');
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/auth/signin');
    }

    // Check for admin role
    if (!session?.user?.role || session.user.role !== 'admin') {
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

    if (session?.user?.role === 'admin') {
      fetchProperties();
    }
  }, [session]);

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
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('properties')}
              className={`${
                activeTab === 'properties'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
            >
              Properties
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`${
                activeTab === 'applications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
            >
              Applications
            </button>
            <button
              onClick={() => setActiveTab('contacts')}
              className={`${
                activeTab === 'contacts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
            >
              Contacts
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
            >
              Analytics
            </button>
          </nav>
        </div>
        <div className="p-6">
          {activeTab === 'properties' && (
            <AdminPropertyList
              properties={properties}
              onStatusUpdate={handleStatusUpdate}
            />
          )}
          {activeTab === 'users' && <AdminUserList />}
          {activeTab === 'applications' && <AdminApplications />}
          {activeTab === 'contacts' && <AdminContacts />}
          {activeTab === 'analytics' && <AdminAnalytics />}
        </div>
      </div>
    </div>
  );
}
