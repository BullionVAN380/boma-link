import { Metadata } from 'next';
import SignUpForm from './SignUpForm';

export const metadata: Metadata = {
  title: 'Sign Up | Affordable Housing',
  description: 'Create a new account',
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">  
        <SignUpForm />
      </div>
  );
}
