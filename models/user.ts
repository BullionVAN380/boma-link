import mongoose, { Model } from 'mongoose';
import { connectToDatabase } from '@/lib/db';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['buyer', 'seller', 'landlord', 'jobSeeker', 'employer', 'agent', 'admin'],
    default: 'buyer',
    required: true
  },
  profile: {
    phone: String,
    address: String,
    bio: String,
    company: String,
    website: String
  },
  resetToken: String,
  resetTokenExpiry: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

interface IUser {
  name: string;
  email: string;
  password: string;
  role: string;
  profile?: {
    phone?: string;
    address?: string;
    bio?: string;
    company?: string;
    website?: string;
  };
  resetToken?: string;
  resetTokenExpiry?: Date;
  createdAt: Date;
}

let cached: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } = { conn: null, promise: null };

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = connectToDatabase().then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

let UserModel: Model<IUser>;

try {
  // Try to get the existing model
  UserModel = mongoose.model<IUser>('User');
} catch {
  // Model doesn't exist, create it
  UserModel = mongoose.model<IUser>('User', userSchema);
}

export { UserModel };

export async function getUserModel() {
  await dbConnect();
  return UserModel;
}
