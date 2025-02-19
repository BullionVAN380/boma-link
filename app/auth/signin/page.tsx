import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import SignInForm from './SignInForm';

export const metadata: Metadata = {
  title: 'Sign In | Affordable Housing',
  description: 'Sign in to your account',
};

export default async function SignInPage() {
  const session = await getServerSession();

  // If user is already logged in, redirect to properties/create
  if (session) {
    redirect('/properties/create');
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <SignInForm />
    </div>
  );
}
