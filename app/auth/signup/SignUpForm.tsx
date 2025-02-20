'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signUp } from '../actions';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import FormInput from '@/components/ui/FormInput';
import AuthForm from '@/components/ui/AuthForm';
import Link from 'next/link';

export default function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <AuthForm
      title="Create your account"
      subtitle="Or"
      linkText="sign in to your account"
      linkHref="/auth/signin"
      error={error}
    >
      <form
        action={async (formData: FormData) => {
          try {
            setLoading(true);
            setError('');
            
            const result = await signUp(formData);
            
            if (result.error) {
              setError(result.error);
              return;
            }

            router.push('/auth/signin?registered=true');
          } catch (err) {
            setError('Something went wrong. Please try again.');
          } finally {
            setLoading(false);
          }
        }}
        className="space-y-6"
      >
        <div className="space-y-4">
          <FormInput
            id="name"
            name="name"
            type="text"
            label="Full name"
            placeholder="Josphat Baraka"
            autoComplete="name"
            Icon={FiUser}
          />

          <FormInput
            id="email-address"
            name="email"
            type="email"
            label="Email address"
            placeholder="barakajos@gmail.com"
            autoComplete="email"
            Icon={FiMail}
          />

          <FormInput
            id="password"
            name="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            autoComplete="new-password"
            Icon={FiLock}
            hint="Must be at least 8 characters long"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-colors duration-200"
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>

        <div className="text-center text-xs text-gray-600">
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="text-indigo-600 hover:text-indigo-500">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-indigo-600 hover:text-indigo-500">
            Privacy Policy
          </Link>
        </div>
      </form>
    </AuthForm>
  );
}
