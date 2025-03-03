import mongoose, { Model } from 'mongoose';
import { connectToDatabase } from '../db';
import 'server-only';

export interface IApplication {
  jobId: string;
  userId: string;
  resume: {
    data: Buffer;
    contentType: string;
    filename: string;
  };
  coverLetter?: {
    data: Buffer;
    contentType: string;
    filename: string;
  };
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const createModel = () => {
  const applicationSchema = new mongoose.Schema({
    jobId: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    resume: {
      data: {
        type: Buffer,
        required: true
      },
      contentType: {
        type: String,
        required: true
      },
      filename: {
        type: String,
        required: true
      }
    },
    coverLetter: {
      data: Buffer,
      contentType: String,
      filename: String
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'accepted', 'rejected'],
      default: 'pending'
    },
    notes: String
  }, {
    timestamps: true
  });

  return mongoose.models.Application || mongoose.model('Application', applicationSchema);
};

export async function getApplicationModel(): Promise<Model<IApplication>> {
  await connectToDatabase();
  return createModel();
}
