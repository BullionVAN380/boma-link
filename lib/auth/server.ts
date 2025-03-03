import { connectToDatabase } from '@/lib/db';
import { getUserModel } from '@/models/user';
import bcrypt from 'bcryptjs';

// Mark this file as server-only
import 'server-only';

export async function verifyUserCredentials(email: string, password: string) {
  if (!email || !password) {
    throw new Error('Email and password required');
  }

  await connectToDatabase();
  const User = await getUserModel();
  
  const user = await User.findOne({ email: email.toLowerCase() });
  
  if (!user) {
    throw new Error('No user found with this email');
  }

  const isValid = await bcrypt.compare(password, user.password);
  
  if (!isValid) {
    throw new Error('Invalid password');
  }

  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role
  };
}

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function verifyCredentials(email: string, password: string) {
  return await verifyUserCredentials(email, password);
}
