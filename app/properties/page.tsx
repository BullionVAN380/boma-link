import { Metadata } from 'next';
import { Property } from '@/models/property';
import { connectToDatabase } from '@/lib/db';
import PropertyCard from '@/components/PropertyCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Properties | Affordable Housing',
  description: 'Browse available properties for sale and rent',
};

async function getProperties() {
  await connectToDatabase();
  const properties = await Property.find({ status: 'approved' })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  return properties.map(property => ({
    ...property,
    _id: property._id.toString(),
    owner: property.owner ? {
      ...property.owner,
      _id: property.owner._id ? property.owner._id.toString() : undefined
    } : undefined,
    createdAt: property.createdAt ? property.createdAt.toISOString() : undefined,
    updatedAt: property.updatedAt ? property.updatedAt.toISOString() : undefined
  }));
}

export default async function PropertiesPage() {
  const properties = await getProperties();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Available Properties</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find your perfect home from our curated selection of affordable properties
          </p>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <MapIcon className="h-5 w-5" />
              View Map
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
              Filters
            </Button>
          </div>
          <div className="text-sm text-gray-500">
            Showing {properties.length} properties
          </div>
        </div>

        {properties.length === 0 ? (
          <Card className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Properties Available</h3>
              <p className="text-gray-500 mb-6">
                We're currently updating our property listings. Please check back soon for new opportunities.
              </p>
              <Button variant="outline">Get Notified of New Listings</Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <div key={property._id} className="transform hover:scale-[1.02] transition-transform duration-300">
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
