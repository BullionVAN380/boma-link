export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { getPropertyModel } from '@/lib/server/models/property';
import { getUserModel } from '@/lib/server/models/user';
import { withErrorHandler, jsonResponse } from '@/lib/api-wrapper';
import { ApiError, throwIfUnauthorized, throwIfBadRequest } from '@/lib/api-error';
import { z } from 'zod';

// Validation schemas
const propertySearchSchema = z.object({
  id: z.string().optional(),
  userId: z.string().optional(),
  status: z.enum(['pending', 'approved', 'rejected', 'sold', 'rented']).optional(),
  type: z.string().optional(),
  propertyType: z.string().optional(),
  priceMin: z.string().regex(/^\d+$/).optional(),
  priceMax: z.string().regex(/^\d+$/).optional(),
  location: z.string().optional(),
  isAdmin: z.string().transform(val => val === 'true').optional(),
  limit: z.string().regex(/^\d+$/).optional()
});

const propertyCreateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  type: z.enum(['rent', 'sale']),
  propertyType: z.enum(['apartment', 'house', 'condo', 'townhouse', 'land']),
  price: z.number().positive('Price must be positive'),
  location: z.object({
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    country: z.string().optional(),
    zipCode: z.string().optional()
  }),
  features: z.object({
    bedrooms: z.number(),
    bathrooms: z.number(),
    area: z.number(),
    parking: z.boolean().optional(),
    furnished: z.boolean().optional(),
    airConditioning: z.boolean().optional(),
    heating: z.boolean().optional()
  }),
  images: z.array(z.object({
    url: z.string(),
    publicId: z.string().optional(),
    isFeatured: z.boolean().optional()
  })).min(1, 'At least one image is required'),
  status: z.enum(['pending', 'approved', 'rejected', 'sold', 'rented']).optional()
});

// Helper function to convert Mongoose documents to plain objects
function serializeDocument(doc: any) {
  const serialized = doc.toObject ? doc.toObject() : { ...doc };
  
  // Convert ObjectId to string
  if (serialized._id) {
    serialized._id = serialized._id.toString();
  }
  
  // Convert dates to ISO strings
  if (serialized.createdAt) {
    serialized.createdAt = serialized.createdAt.toISOString();
  }
  if (serialized.updatedAt) {
    serialized.updatedAt = serialized.updatedAt.toISOString();
  }
  
  return serialized;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured') === 'true';
    const session = await getServerSession(authOptions);

    const Property = await getPropertyModel();
    let query: any = {};

    // For featured properties on homepage, only show approved properties
    if (featured) {
      query = {
        status: 'approved',
        isFeatured: true
      };
      console.log('Featured Query:', query);
    } 
    // For regular property listing, show approved properties and user's own properties
    else {
      if (session?.user) {
        query = {
          $or: [
            { status: 'approved' },
            { owner: session.user.id }
          ]
        };
      } else {
        query = { status: 'approved' };
      }
    }

    console.log('Final Query:', query);
    const properties = await Property.find(query)
      .sort({ createdAt: -1 });

    console.log('Found Properties:', properties.length);
    
    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
};

export const POST = withErrorHandler(async (request: Request) => {
  const session = await getServerSession(authOptions);
  throwIfUnauthorized(!!session?.user, 'You must be logged in to create a property listing');

  const data = await request.json();
  
  // Validate request body
  const validatedData = propertyCreateSchema.parse(data);
  
  const PropertyModel = await getPropertyModel();

  // Add user ID and status to the property
  const property = new PropertyModel({
    ...validatedData,
    userId: session.user.id,
    status: 'pending'
  });

  await property.save();

  return jsonResponse(serializeDocument(property), 201);
});
