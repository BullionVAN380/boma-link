'use server';

import { getUserModel } from '@/lib/server/models/user';
import bcrypt from 'bcryptjs';

export async function createUser(data: {
  email: string;
  password: string;
  name: string;
  role?: string;
}) {
  const User = await getUserModel();
  
  // Check if user exists
  const existingUser = await User.findOne({ email: data.email.toLowerCase() });
  if (existingUser) {
    throw new Error('Email already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // Create user
  const user = await User.create({
    ...data,
    email: data.email.toLowerCase(),
    password: hashedPassword,
    role: data.role || 'buyer'
  });

  return {
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role
  };
}
