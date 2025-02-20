import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/authOptions';
import { connectToDatabase } from '@/lib/db';
import { getUserModel } from '@/models/user';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Prevent admin from modifying their own role
    if (params.id === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot modify own role' },
        { status: 400 }
      );
    }

    const { role } = await request.json();

    // Validate role
    const validRoles = ['buyer', 'seller', 'landlord', 'jobSeeker', 'employer', 'agent', 'admin'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const User = await getUserModel();
    
    const user = await User.findByIdAndUpdate(
      params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
