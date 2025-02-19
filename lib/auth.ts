import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  try {
    const session = await getSession();
    return session?.user;
  } catch (error) {
    return null;
  }
}

export async function isAuthenticated() {
  const session = await getSession();
  return !!session;
}

export async function hasRole(role: string) {
  const session = await getSession();
  return session?.user?.role === role;
}

export async function isAdmin() {
  return await hasRole('admin');
}
