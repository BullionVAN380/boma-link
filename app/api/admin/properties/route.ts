import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import clientPromise from '@/lib/mongodb';
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
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // Fetch all properties
    const properties = await db
      .collection('properties')
      .find({})
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

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { propertyId, status } = await request.json();
    
    if (!propertyId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const result = await db
      .collection('properties')
      .updateOne(
        { _id: new ObjectId(propertyId) },
        { $set: { status, updatedAt: new Date() } }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Property status updated successfully' });
  } catch (error) {
    console.error('Error updating property status:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
