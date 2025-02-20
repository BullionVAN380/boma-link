import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, phone, message, propertyTitle } = data;

    // Validate required fields
    if (!name || !email || !message || !propertyTitle) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Store the contact request
    await db.collection('contacts').insertOne({
      name,
      email,
      phone,
      message,
      propertyTitle,
      createdAt: new Date(),
      status: 'new'
    });

    return NextResponse.json({ message: 'Contact request sent successfully' });
  } catch (error) {
    console.error('Error sending contact request:', error);
    return NextResponse.json(
      { error: 'Failed to send contact request' },
      { status: 500 }
    );
  }
}
