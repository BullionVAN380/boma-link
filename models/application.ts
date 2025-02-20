import mongoose, { Model } from 'mongoose';

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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

interface IApplication {
  jobId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
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

// Function to get the Application model
export async function getApplicationModel(): Promise<ApplicationModel> {
  return mongoose.models.Application || mongoose.model<IApplication>('Application', applicationSchema);
}

export type { IApplication };
