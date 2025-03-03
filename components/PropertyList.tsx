'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useFilters } from '@/context/FilterContext';

interface Property {
  _id: string;
  title: string;
  description: string;
  type: 'rent' | 'sale';
  propertyType: string;
  price: number;
  location: {
    address: string;
    city: string;
    state: string;
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    area: number;
  };
  images: {
    url: string;
    publicId: string;
    isFeatured?: boolean;
  }[];
  status: 'pending' | 'approved' | 'rejected' | 'sold' | 'rented';
  isFeatured: boolean;
  userId: string;
  owner?: {
    name: string;
    email: string;
  };
}

interface PropertyListProps {
  featured?: boolean;
}

export default function PropertyList({ featured = false }: PropertyListProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const { filters } = useFilters();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        console.log('Fetching properties with featured:', featured);
        
        // Convert filters to URLSearchParams
        const params = new URLSearchParams();
        
        // If featured is true, add featured parameter and limit
        if (featured) {
          params.append('featured', 'true');
          params.append('limit', '6');
        }

        // Apply regular filters for non-featured view
        if (!featured) {
          if (filters.type !== 'all') params.append('type', filters.type);
          if (filters.priceMin) params.append('priceMin', filters.priceMin);
          if (filters.priceMax) params.append('priceMax', filters.priceMax);
          if (filters.location) params.append('location', filters.location);
          if (filters.propertyType !== 'all') params.append('propertyType', filters.propertyType);
        }

        console.log('API URL:', `/api/properties?${params.toString()}`);
        const response = await fetch(`/api/properties?${params.toString()}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Received properties:', data);
        
        if (!Array.isArray(data)) {
          console.error('Received non-array data:', data);
          setProperties([]);
          return;
        }
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [filters, featured]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="animate-pulse">
            <div className="bg-gray-200 h-48 rounded-t-lg"></div>
            <div className="bg-white p-4 rounded-b-lg space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="flex gap-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-400 mb-2">No properties found</h3>
        <p className="text-gray-500">
          {featured ? "No featured properties available at the moment." : "Try adjusting your search filters"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <Link
          href={`/properties/${property._id}`}
          key={property._id}
          className="group"
        >
          <div className="card transition-transform hover:scale-[1.02]">
            <div className="relative h-48 w-full">
              <Image
                src={property.images[0]?.url || '/placeholder-property.jpg'}
                alt={property.title}
                fill
                className="object-cover rounded-t-lg"
              />
              <div className="absolute top-2 right-2">
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-800">
                  {property.type === 'sale' ? 'For Sale' : 'For Rent'}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600">
                {property.title}
              </h3>
              <p className="mt-1 text-gray-500">
                {property.location?.city && property.location?.state 
                  ? `${property.location.city}, ${property.location.state}`
                  : 'Location not specified'}
              </p>
              <div className="mt-2">
                <p className="text-xl font-bold text-primary-600">
                  ${property.price.toLocaleString()}
                  {property.type === 'rent' && '/month'}
                </p>
              </div>
              <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  {property.features.bedrooms} beds
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {property.features.bathrooms} baths
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  {property.features.area} sqft
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
