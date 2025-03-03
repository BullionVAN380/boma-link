import mongoose, { Model } from 'mongoose';
import { connectToDatabase } from '../db';
import 'server-only';

export interface IProperty {
  _id: string;
  title: string;
  description: string;
  type: 'rent' | 'sale';
  propertyType: string;
  price: number;
  location: {
    address: string;
    city: string;
    state: string;
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    area: number;
  };
  images?: Array<{
    url: string;
    publicId: string;
    isFeatured?: boolean;
  }>;
  status: 'pending' | 'approved' | 'rejected' | 'sold' | 'rented';
  isFeatured: boolean;
  owner: string;
  createdAt: Date;
  updatedAt: Date;
}

// Only create the model on the server side
const createModel = () => {
  const propertySchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['rent', 'sale'],
      required: true
    },
    propertyType: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    location: {
      address: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      state: String
    },
    features: {
      bedrooms: {
        type: Number,
        required: true
      },
      bathrooms: {
        type: Number,
        required: true
      },
      area: {
        type: Number,
        required: true
      }
    },
    images: [{
      url: String,
      publicId: String,
      isFeatured: Boolean
    }],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'sold', 'rented'],
      default: 'pending'
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }, {
    timestamps: true
  });

  return mongoose.models.Property || mongoose.model('Property', propertySchema);
};

export async function getPropertyModel(): Promise<Model<IProperty>> {
  await connectToDatabase();
  return createModel();
}
