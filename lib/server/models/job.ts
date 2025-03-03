import mongoose, { Model } from 'mongoose';
import { connectToDatabase } from '../db';
import 'server-only';

export interface IJob {
  title: string;
  company: string;
  location: {
    city: string;
    state: string;
    country: string;
    type: 'remote' | 'onsite' | 'hybrid';
  };
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship';
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive';
  description: string;
  requirements: string[];
  benefits?: string[];
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  employer: {
    _id: string;
    name: string;
    email: string;
  };
  status: 'active' | 'closed' | 'draft';
  createdAt: Date;
  updatedAt: Date;
}

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
      city: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      country: {
        type: String,
        required: true,
        default: 'USA'
      },
      type: {
        type: String,
        enum: ['remote', 'onsite', 'hybrid'],
        required: true
      }
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
    description: {
      type: String,
      required: true
    },
    requirements: [{
      type: String,
      required: true
    }],
    benefits: [{
      type: String
    }],
    salary: {
      min: {
        type: Number,
        required: true
      },
      max: {
        type: Number,
        required: true
      },
      currency: {
        type: String,
        default: 'USD'
      }
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
    }
  }, {
    timestamps: true
  });

  return mongoose.models.Job || mongoose.model('Job', jobSchema);
};

export async function getJobModel(): Promise<Model<IJob>> {
  await connectToDatabase();
  return createModel();
}
