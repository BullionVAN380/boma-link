import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { getPropertyModel } from '@/lib/server/models/property';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const Property = await getPropertyModel();
    const properties = await Property.find({
      status: 'approved',
      isFeatured: true
    });

    return NextResponse.json({
      featuredAndApproved: properties,
      count: properties.length
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
