'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import ImageUpload from './ImageUpload';
import Image from 'next/image';

interface PropertyFormProps {
  initialData?: Partial<PropertyFormData>;
}

interface PropertyImage {
  url: string;
  isFeatured: boolean;
}

interface PropertyLocation {
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

interface PropertyFeatures {
  bedrooms: number;
  bathrooms: number;
  area: number;
  parking: boolean;
  furnished: boolean;
  airConditioning: boolean;
  heating: boolean;
}

interface PropertyFormData {
  _id?: string;
  title: string;
  description: string;
  price: string;
  type: 'sale' | 'rent';
  propertyType: 'apartment' | 'house' | 'condo' | 'land';
  location: PropertyLocation;
  features: PropertyFeatures;
  images: PropertyImage[];
}

export default function PropertyForm({ initialData }: PropertyFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<PropertyFormData>({
    _id: initialData?._id,
    title: initialData?.title || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    type: initialData?.type || 'sale',
    propertyType: initialData?.propertyType || 'apartment',
    location: {
      address: initialData?.location?.address || '',
      city: initialData?.location?.city || '',
      state: initialData?.location?.state || '',
      country: initialData?.location?.country || '',
      zipCode: initialData?.location?.zipCode || ''
    },
    features: {
      bedrooms: initialData?.features?.bedrooms || 0,
      bathrooms: initialData?.features?.bathrooms || 0,
      area: initialData?.features?.area || 0,
      parking: initialData?.features?.parking || false,
      furnished: initialData?.features?.furnished || false,
      airConditioning: initialData?.features?.airConditioning || false,
      heating: initialData?.features?.heating || false
    },
    images: initialData?.images || []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData((prev: PropertyFormData) => {
        if (section === 'location') {
          return {
            ...prev,
            location: {
              ...prev.location,
              [field]: value
            }
          };
        }
        if (section === 'features') {
          return {
            ...prev,
            features: {
              ...prev.features,
              [field]: value
            }
          };
        }
        return prev;
      });
    } else {
      setFormData((prev: PropertyFormData) => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const [section, field] = name.split('.');
    setFormData((prev: PropertyFormData) => {
      if (section === 'features') {
        return {
          ...prev,
          features: {
            ...prev.features,
            [field]: checked
          }
        };
      }
      return prev;
    });
  };

  const handleImageUpload = (imageData: { url: string }) => {
    setFormData((prev: PropertyFormData) => ({
      ...prev,
      images: [...prev.images, { url: imageData.url, isFeatured: prev.images.length === 0 }]
    }));
  };

  const removeImage = (url: string) => {
    setFormData((prev: PropertyFormData) => ({
      ...prev,
      images: prev.images.filter(img => img.url !== url)
    }));
  };

  const setFeaturedImage = (index: number) => {
    setFormData((prev: PropertyFormData) => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        isFeatured: i === index
      }))
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const processedData = {
        ...formData,
        price: Number(formData.price),
        features: {
          ...formData.features,
          bedrooms: Number(formData.features.bedrooms),
          bathrooms: Number(formData.features.bathrooms),
          area: Number(formData.features.area),
        }
      };

      if (initialData) {
        await axios.patch(`/api/properties/${initialData._id}`, processedData);
      } else {
        await axios.post('/api/properties', processedData);
      }
      
      router.push('/properties');
      router.refresh();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Basic Information</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="e.g., Modern Apartment in Downtown"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Describe your property..."
                />
              </div>
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="price"
                  id="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Enter price"
                />
              </div>
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <div className="mt-1">
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700">
                Property Type
              </label>
              <div className="mt-1">
                <select
                  id="propertyType"
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  required
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="condo">Condo</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="land">Land</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Location</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="location.address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="location.address"
                  id="location.address"
                  value={formData.location.address}
                  onChange={handleChange}
                  required
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Street address"
                />
              </div>
            </div>

            <div>
              <label htmlFor="location.city" className="block text-sm font-medium text-gray-700">
                City
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="location.city"
                  id="location.city"
                  value={formData.location.city}
                  onChange={handleChange}
                  required
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div>
              <label htmlFor="location.state" className="block text-sm font-medium text-gray-700">
                County
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="location.state"
                  id="location.state"
                  value={formData.location.state}
                  onChange={handleChange}
                  required
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div>
              <label htmlFor="location.country" className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="location.country"
                  id="location.country"
                  value={formData.location.country}
                  onChange={handleChange}
                  required
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div>
              <label htmlFor="location.zipCode" className="block text-sm font-medium text-gray-700">
                ZIP Code
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="location.zipCode"
                  id="location.zipCode"
                  value={formData.location.zipCode}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Features</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label htmlFor="features.bedrooms" className="block text-sm font-medium text-gray-700">
                Bedrooms
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="features.bedrooms"
                  id="features.bedrooms"
                  value={formData.features.bedrooms}
                  onChange={handleChange}
                  required
                  min="0"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div>
              <label htmlFor="features.bathrooms" className="block text-sm font-medium text-gray-700">
                Bathrooms
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="features.bathrooms"
                  id="features.bathrooms"
                  value={formData.features.bathrooms}
                  onChange={handleChange}
                  required
                  min="0"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div>
              <label htmlFor="features.area" className="block text-sm font-medium text-gray-700">
                Area (sqft)
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="features.area"
                  id="features.area"
                  value={formData.features.area}
                  onChange={handleChange}
                  required
                  min="0"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="features.parking"
                  id="features.parking"
                  checked={formData.features.parking}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="features.parking" className="ml-2 block text-sm text-gray-700">
                  Parking
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="features.furnished"
                  id="features.furnished"
                  checked={formData.features.furnished}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="features.furnished" className="ml-2 block text-sm text-gray-700">
                  Furnished
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="features.airConditioning"
                  id="features.airConditioning"
                  checked={formData.features.airConditioning}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="features.airConditioning" className="ml-2 block text-sm text-gray-700">
                  Air Conditioning
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="features.heating"
                  id="features.heating"
                  checked={formData.features.heating}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="features.heating" className="ml-2 block text-sm text-gray-700">
                  Heating
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Images</h3>
          <div className="space-y-6">
            <ImageUpload onUpload={handleImageUpload} />
            
            {formData.images.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {formData.images.map((image, index) => (
                  <div key={image.url} className="relative h-[200px]">
                    <Image
                      src={image.url}
                      alt={`Property image ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover rounded-lg"
                    />
                    <div className="absolute top-2 right-2 space-x-2">
                      <button
                        type="button"
                        onClick={() => setFeaturedImage(index)}
                        className={`p-2 rounded-full ${
                          image.isFeatured ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600'
                        } shadow-sm hover:shadow-md transition-shadow duration-200`}
                      >
                        ⭐
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(image.url)}
                        className="p-2 rounded-full bg-white text-red-600 shadow-sm hover:shadow-md transition-shadow duration-200"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Property'}
          </button>
        </div>
      </div>
    </form>
  );
}
