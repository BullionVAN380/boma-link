'use server';

import { connectToDatabase } from '@/lib/db';
import { getUserModel } from '@/models/user';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function signUp(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    // Input validation
    if (!email || !password || !name) {
      return { error: 'Missing required fields' };
    }

    const User = await getUserModel();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: 'Email already registered' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      role: 'buyer' // Default role
    });

    return { success: true };
  } catch (error) {
    console.error('Sign up error:', error);
    return { error: 'Failed to create account' };
  }
}

export async function signIn(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      return { error: 'Missing required fields' };
    }

    const User = await getUserModel();
    const user = await User.findOne({ email });

    if (!user) {
      return { error: 'Invalid credentials' };
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return { error: 'Invalid credentials' };
    }

    // Create JWT token
    const token = await new SignJWT({ 
      userId: user._id,
      email: user.email,
      role: user.role 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(new TextEncoder().encode(JWT_SECRET));

    // Set HTTP-only cookie
    cookies().set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400 // 24 hours
    });

    return { success: true };
  } catch (error) {
    console.error('Sign in error:', error);
    return { error: 'Authentication failed' };
  }
}

export async function signOut() {
  try {
    cookies().delete('token');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to sign out' };
  }
}

export async function getCurrentUser() {
  try {
    const token = cookies().get('token')?.value;
    if (!token) return null;

    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );

    const User = await getUserModel();
    const user = await User.findById(verified.payload.userId).select('-password');
    
    return user;
  } catch (error) {
    return null;
  }
}
