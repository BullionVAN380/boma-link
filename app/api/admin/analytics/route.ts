import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Temporary mock data until database is set up
const mockData = {
  propertiesByStatus: {
    pending: 2,
    approved: 4,
    rejected: 1,
  },
  propertiesByType: {
    sale: 4,
    rent: 3,
  },
  propertiesByCity: {
    'Malind': 2,
    'Samburu': 1,
    'Kitui': 4,
  },
  monthlyListings: {
    'Jan 2025': 1,
    'Feb 2025': 2,
    'Mar 2025': 3,
    'Apr 2025': 2,
    'May 2025': 1,
    'Jun 2025': 2,
  },
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'admin') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Return mock data
    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Analytics error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
