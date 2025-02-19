import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Property } from '@/models/property';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Helper function to convert MongoDB documents to plain objects
const serializeDocument = (doc: any) => {
  const plainObject = JSON.parse(JSON.stringify(doc));
  if (Array.isArray(plainObject)) {
    return plainObject.map(item => {
      if (item._id) {
        item._id = item._id.toString();
      }
      return item;
    });
  }
  if (plainObject._id) {
    plainObject._id = plainObject._id.toString();
  }
  return plainObject;
};

export async function GET(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');
    const location = searchParams.get('location');
    const propertyType = searchParams.get('propertyType');

    let query: any = { status: 'approved' };

    if (type && type !== 'all') {
      query.type = type;
    }

    if (priceMin) {
      query.price = { ...query.price, $gte: parseInt(priceMin) };
    }

    if (priceMax) {
      query.price = { ...query.price, $lte: parseInt(priceMax) };
    }

    if (location) {
      query['location.city'] = new RegExp(location, 'i');
    }

    if (propertyType && propertyType !== 'all') {
      query.propertyType = propertyType;
    }

    const properties = await Property.find(query)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    // Serialize the properties before sending to client
    const serializedProperties = serializeDocument(properties);
    return NextResponse.json(serializedProperties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    const requiredFields = ['title', 'description', 'type', 'propertyType', 'price'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const propertyData = {
      ...data,
      owner: session.user.id,
      status: session.user.role === 'admin' ? 'approved' : 'pending'
    };

    const property = await Property.create(propertyData);
    
    // Serialize the property before sending to client
    const serializedProperty = serializeDocument(property.toObject());
    return NextResponse.json(serializedProperty);
  } catch (error: any) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create property' },
      { status: 500 }
    );
  }
}
