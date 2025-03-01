'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  type: 'sale' | 'rent';
  propertyType: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    area: number;
  };
  status: 'pending' | 'approved' | 'rejected';
  owner: {
    name: string;
    email: string;
  };
  createdAt: string;
}

export default function AdminPropertyList() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get('/api/admin/properties');
      setProperties(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch properties');
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (propertyId: string, status: 'approved' | 'rejected' | 'pending') => {
    try {
      await axios.patch(`/api/admin/properties`, { propertyId, status });
      // Update the local state
      setProperties(prevProperties =>
        prevProperties.map(property => 
          property._id === propertyId ? { ...property, status } : property
        )
      );
      router.refresh(); // Refresh the page to update server components
    } catch (err) {
      setError('Failed to update property status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="text-red-700">{error}</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Property
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Owner
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {properties.map((property) => (
            <tr key={property._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {property.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {property.location.city}, {property.location.state}
                    </div>
                    <div className="text-sm text-gray-500">
                      ${property.price.toLocaleString()} - {property.type}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-500 text-lg">
                        {property.owner?.name ? property.owner.name[0].toUpperCase() : 'U'}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {property.owner?.name || 'Unknown Owner'}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {property.owner?.email || 'No email provided'}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                  ${property.status === 'approved' ? 'bg-green-100 text-green-800' : 
                    property.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'}`}>
                  {property.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {property.status === 'pending' && (
                  <div className="space-x-2">
                    <button
                      onClick={() => handleStatusUpdate(property._id, 'approved')}
                      className="text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded-md"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(property._id, 'rejected')}
                      className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-md"
                    >
                      Reject
                    </button>
                  </div>
                )}
                {property.status !== 'pending' && (
                  <button
                    onClick={() => handleStatusUpdate(property._id, 'pending')}
                    className="text-gray-600 hover:text-gray-900 bg-gray-50 px-3 py-1 rounded-md"
                  >
                    Reset Status
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {properties.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No properties requiring approval
        </div>
      )}
    </div>
  );
}
