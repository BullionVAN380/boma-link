'use client';

import { useState } from 'react';
import AdminPropertyList from './AdminPropertyList';
import AdminUserList from './AdminUserList';
import AdminApplicationList from './AdminApplicationList';

export default function AdminDashboardTabs() {
  const [activeTab, setActiveTab] = useState('properties');

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('properties')}
            className={`${
              activeTab === 'properties'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Property Approvals
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`${
              activeTab === 'applications'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Job Applications
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`${
              activeTab === 'users'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            User Management
          </button>
        </nav>
      </div>
      
      <div className="p-4">
        {activeTab === 'properties' ? (
          <AdminPropertyList />
        ) : activeTab === 'applications' ? (
          <AdminApplicationList />
        ) : (
          <AdminUserList />
        )}
      </div>
    </div>
  );
}
