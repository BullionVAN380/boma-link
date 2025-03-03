export const runtime = 'nodejs';

import mongoose, { Model } from 'mongoose';
import { connectToDatabase } from '@/lib/db';

// Only create the model on the server side
const createModel = () => {
  const applicationSchema = new mongoose.Schema({
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    resume: {
      name: { type: String, required: true },
      url: { type: String, required: true }
    },
    coverLetter: {
      name: String,
      url: String
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

  return mongoose.models.Application || mongoose.model('Application', applicationSchema);
};

interface IApplication {
  jobId: mongoose.Types.ObjectId;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  resume: {
    name: string;
    url: string;
  };
  coverLetter?: {
    name: string;
    url: string;
  };
  createdAt: Date;
}

// This is important for type inference
type ApplicationModel = Model<IApplication>;

export async function getApplicationModel(): Promise<ApplicationModel> {
  await connectToDatabase();
  return createModel() as ApplicationModel;
}

export type { IApplication };
