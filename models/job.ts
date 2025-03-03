export const runtime = 'nodejs';

import mongoose, { Model } from 'mongoose';
import { connectToDatabase } from '@/lib/db';

// Only create the model on the server side
const createModel = () => {
  const jobSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    company: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship'],
      required: true
    },
    description: {
      type: String,
      required: true
    },
    requirements: [String],
    salary: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'USD'
      }
    },
    benefits: [String],
    status: {
      type: String,
      enum: ['active', 'closed', 'draft'],
      default: 'active'
    },
    userId: {
      type: String,
      required: true
    },
    applicationDeadline: Date,
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  });

  return mongoose.models.Job || mongoose.model('Job', jobSchema);
};

interface IJob {
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  description: string;
  requirements: string[];
  salary?: {
    min?: number;
    max?: number;
    currency: string;
  };
  benefits?: string[];
  status: 'active' | 'closed' | 'draft';
  userId: string;
  applicationDeadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export async function getJobModel(): Promise<Model<IJob>> {
  await connectToDatabase();
  return createModel() as Model<IJob>;
}
