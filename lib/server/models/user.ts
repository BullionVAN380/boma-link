import mongoose, { Model } from 'mongoose';
import { connectToDatabase } from '../db';
import 'server-only';

// Only create the model on the server side
const createModel = () => {
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

  return mongoose.models.User || mongoose.model('User', userSchema);
};

export interface IUser {
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

export async function getUserModel(): Promise<Model<IUser>> {
  await connectToDatabase();
  return createModel() as Model<IUser>;
}
