'use client';

import { useState, useEffect } from 'react';
import AdminPropertyList from '@/components/admin/AdminPropertyList';
import AdminUserList from '@/components/admin/AdminUserList';
import AdminAnalytics from '@/components/admin/AdminAnalytics';
import AdminContacts from '@/components/admin/AdminContacts';
import AdminApplications from '@/components/admin/AdminApplications';
import AdminJobList from '@/components/admin/AdminJobList';
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

  const tabs = [
    { id: 'properties', label: 'Properties' },
    { id: 'jobs', label: 'Jobs' },
    { id: 'users', label: 'Users' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'contacts', label: 'Contacts' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-4 px-4" aria-label="Tabs">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'properties' && (
              <AdminPropertyList
                properties={properties}
                onStatusUpdate={handleStatusUpdate}
              />
            )}
            {activeTab === 'jobs' && <AdminJobList />}
            {activeTab === 'users' && <AdminUserList />}
            {activeTab === 'analytics' && <AdminAnalytics />}
            {activeTab === 'contacts' && <AdminContacts />}
          </div>
        </div>
      </div>
    </div>
  );
}
