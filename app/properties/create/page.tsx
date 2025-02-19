import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import PropertyForm from '@/components/PropertyForm';
import { authOptions } from '@/app/api/auth/authOptions';

export default async function CreateProperty() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin?returnUrl=/properties/create');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
              Create Property Listing
            </h1>
            <div className="mb-8 text-center text-gray-600 pb-6 border-b">
              {session.user.role === 'admin' ? 
                'Your listing will be published immediately.' :
                'Your listing will be reviewed by an admin before being published.'}
            </div>
            <PropertyForm />
          </div>
        </div>
      </div>
    </div>
  );
}
