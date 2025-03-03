import { getUserModel } from './models/user';
import bcrypt from 'bcryptjs';
import 'server-only';

export async function verifyUserCredentials(email: string, password: string) {
  const User = await getUserModel();
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role
  };
}
