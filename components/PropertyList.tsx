'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useFilters } from '@/context/FilterContext';

interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  type: 'sale' | 'rent';
  location: {
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
    isFeatured: boolean;
  }[];
}

export default function PropertyList() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const { filters } = useFilters();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        // Convert filters to URLSearchParams
        const params = new URLSearchParams();
        if (filters.type !== 'all') params.append('type', filters.type);
        if (filters.priceMin) params.append('priceMin', filters.priceMin);
        if (filters.priceMax) params.append('priceMax', filters.priceMax);
        if (filters.location) params.append('location', filters.location);
        if (filters.propertyType !== 'all') params.append('propertyType', filters.propertyType);

        const response = await fetch(`/api/properties?${params.toString()}`);
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [filters]);

  if (loading) {
    return (
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="animate-pulse bg-gray-200 rounded-lg h-96"></div>
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-900">No properties found</h3>
        <p className="mt-2 text-gray-600">Try adjusting your search filters</p>
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
          <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform hover:scale-[1.02]">
            <div className="relative h-48 w-full">
              <Image
                src={property.images[0]?.url || '/placeholder-property.jpg'}
                alt={property.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600">
                {property.title}
              </h3>
              <p className="mt-1 text-gray-500">{property.location.city}, {property.location.state}</p>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-xl font-bold text-indigo-600">
                  ${property.price.toLocaleString()}
                  {property.type === 'rent' && '/month'}
                </p>
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                  {property.type === 'sale' ? 'For Sale' : 'For Rent'}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                <span>{property.features.bedrooms} beds</span>
                <span>{property.features.bathrooms} baths</span>
                <span>{property.features.area} sqft</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
