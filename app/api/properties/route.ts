import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { ObjectId } from 'mongodb';

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

    const { db } = await connectToDatabase();

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

    // Fetch owners for all properties
    const userIds = properties
      .map(p => p.userId)
      .filter(id => id != null)
      .map(id => typeof id === 'string' ? id : id.toString());

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
      const userId = property.userId?.toString();
      return {
        ...property,
        owner: userId && userMap[userId] ? userMap[userId] : {
          name: 'Anonymous User',
          email: 'No email provided'
        }
      };
    });

    // Serialize each property before sending to client
    const serializedProperties = propertiesWithOwners.map(serializeDocument);
    
    return NextResponse.json(serializedProperties);
  } catch (error: any) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase();

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
      userId: session.user.id,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('properties').insertOne(propertyData);
    
    // Get the inserted document
    const insertedProperty = await db.collection('properties').findOne({ _id: result.insertedId });
    
    if (!insertedProperty) {
      throw new Error('Failed to retrieve created property');
    }

    // Get the owner data
    const owner = await db.collection('users').findOne({ _id: session.user.id });
    
    // Add owner data to the property
    const propertyWithOwner = {
      ...insertedProperty,
      owner: owner ? {
        name: owner.name,
        email: owner.email
      } : null
    };

    // Serialize the property before sending to client
    const serializedProperty = serializeDocument(propertyWithOwner);
    return NextResponse.json(serializedProperty);
  } catch (error: any) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create property' },
      { status: 500 }
    );
  }
}
