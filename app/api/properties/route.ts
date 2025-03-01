import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Helper function to convert MongoDB documents to plain objects
function serializeDocument(doc: any) {
  const serialized = { ...doc };
  
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
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const propertyType = searchParams.get('propertyType');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const isAdmin = searchParams.get('isAdmin') === 'true';

    const client = await clientPromise;
    const db = client.db();

    const query: any = {};

    if (id) query._id = new ObjectId(id);
    if (userId) query.userId = userId;
    
    // Only show approved properties unless:
    // 1. We're on the admin dashboard (isAdmin=true)
    // 2. A specific status is requested
    // 3. User is requesting their own properties
    if (!isAdmin && !status && !userId) {
      query.status = 'approved';
    } else if (status) {
      query.status = status;
    }

    if (type) query.type = type;
    if (propertyType) query.propertyType = propertyType;
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }

    // Fetch properties
    const properties = await db
      .collection('properties')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    // Get unique user IDs from properties
    const userIds = properties
      .map(p => p.userId)
      .filter(id => id != null)
      .map(id => typeof id === 'string' ? id : id.toString());

    // Fetch all users who own properties
    const users = userIds.length > 0 ? await db
      .collection('users')
      .find({ 
        $or: [
          { _id: { $in: userIds.map(id => new ObjectId(id)) } },
          { id: { $in: userIds } }
        ]
      })
      .toArray() : [];

    // Create a map of userId to user data
    const userMap = users.reduce((map: any, user) => {
      const userId = user._id ? user._id.toString() : user.id;
      if (userId) {
        map[userId] = {
          name: user.name || 'Anonymous User',
          email: user.email || 'No email provided'
        };
      }
      return map;
    }, {});

    // Add owner data to each property
    const propertiesWithOwners = properties.map(property => {
      const userId = property.userId ? 
        (typeof property.userId === 'string' ? property.userId : property.userId.toString()) 
        : null;
      
      return {
        ...serializeDocument(property),
        owner: userId ? userMap[userId] || { name: 'Unknown Owner', email: 'No email provided' } : { name: 'Unknown Owner', email: 'No email provided' }
      };
    });

    return NextResponse.json(propertiesWithOwners);
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
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const client = await clientPromise;
    const db = client.db();

    // Add user ID and timestamps to the property
    const property = {
      ...data,
      userId: session.user.id,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('properties').insertOne(property);

    return NextResponse.json({
      ...property,
      _id: result.insertedId
    });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
