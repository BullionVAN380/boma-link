import mongoose, { Model } from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  location: {
    city: String,
    state: String,
    country: String,
    type: {
      type: String,
      enum: ['remote', 'onsite', 'hybrid'],
      required: true
    }
  },
  description: {
    type: String,
    required: true,
  },
  requirements: {
    type: [String],
    required: true,
  },
  salary: {
    min: Number,
    max: Number,
    currency: String
  },
  employmentType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship'],
    required: true
  },
  experienceLevel: {
    type: String,
    enum: ['entry', 'mid', 'senior', 'executive'],
    required: true
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'draft'],
    default: 'active'
  },
  applications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true
});

interface IJob {
  title: string;
  company: string;
  location: {
    city: string;
    state: string;
    country: string;
    type: 'remote' | 'onsite' | 'hybrid';
  };
  description: string;
  requirements: string[];
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship';
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive';
  employer: mongoose.Types.ObjectId;
  status: 'active' | 'closed' | 'draft';
  applications: mongoose.Types.ObjectId[];
  createdAt: Date;
}

// This is important for type inference
type JobModel = Model<IJob>;

// Function to get the Job model
export async function getJobModel(): Promise<JobModel> {
  return mongoose.models.Job || mongoose.model<IJob>('Job', jobSchema);
}

export type { IJob };
