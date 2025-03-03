import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Property } from '@/types/property';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div>
      <div className="relative w-full h-48">
        {property.images && property.images[0] ? (
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            className="object-cover rounded-t-lg"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-t-lg">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
        <Badge
          className="absolute top-2 right-2"
          variant={property.type === 'rent' ? 'secondary' : 'default'}
        >
          {property.type === 'rent' ? 'For Rent' : 'For Sale'}
        </Badge>
      </div>
      
      <CardContent className="pt-4">
        <CardTitle className="text-lg font-semibold mb-2 line-clamp-1">
          {property.title}
        </CardTitle>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Price</span>
            <span className="font-semibold">
              {formatPrice(property.price)}
              {property.type === 'rent' && '/month'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Location</span>
            <span className="text-sm">
              {property.location.city}, {property.location.state}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Property Type</span>
            <span className="text-sm capitalize">{property.propertyType}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Status</span>
            <Badge variant={property.status === 'approved' ? 'default' : 'secondary'}>
              {property.status}
            </Badge>
          </div>
        </div>
        
        {property.features && property.features.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {property.features.map((feature, index) => (
                <Badge key={index} variant="outline">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </div>
  );
}
