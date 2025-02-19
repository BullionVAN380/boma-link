'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

interface PropertyCardProps {
  property: {
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
    };
    features: {
      bedrooms: number;
      bathrooms: number;
      area: number;
    };
    images?: Array<{
      url: string;
      publicId: string;
      isFeatured?: boolean;
    }>;
  };
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const featuredImage = property.images?.find(img => img.isFeatured) || property.images?.[0];

  return (
    <Link href={`/properties/${property._id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-48 w-full">
          <Image
            src={featuredImage?.url || "/placeholder-property.jpg"}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {property.type === 'sale' ? 'For Sale' : 'For Rent'}
            </span>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
            {property.title}
          </h3>
          
          <p className="text-gray-500 text-sm mb-2 line-clamp-2">
            {property.description}
          </p>
          
          <div className="flex items-center text-gray-700 mb-2">
            <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm">{property.location.city}, {property.location.state}</span>
          </div>
          
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div className="flex space-x-4">
              <span>{property.features.bedrooms} beds</span>
              <span>{property.features.bathrooms} baths</span>
              <span>{property.features.area} sqft</span>
            </div>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <div className="text-xl font-bold text-indigo-600">
              {formatPrice(property.price)}
              {property.type === 'rent' && <span className="text-sm font-normal text-gray-500">/month</span>}
            </div>
            <span className="text-sm text-gray-500 capitalize">{property.propertyType}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
