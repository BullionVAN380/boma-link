import { Metadata } from 'next';
import { Property } from '@/models/property';
import { connectToDatabase } from '@/lib/db';
import PropertyCard from '@/components/PropertyCard';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Properties</h1>
      
      {properties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No properties available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
