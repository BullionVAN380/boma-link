export const runtime = 'nodejs';

import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/db';

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
      enum: ['apartment', 'house', 'land', 'commercial'],
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
      state: String,
      country: {
        type: String,
        required: true
      },
      coordinates: {
        lat: Number,
        lng: Number
      }
    },
    features: {
      bedrooms: Number,
      bathrooms: Number,
      size: Number, // in square feet/meters
      amenities: [String]
    },
    images: [{
      url: String,
      caption: String
    }],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'sold', 'rented'],
      default: 'pending'
    },
    userId: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  });

  propertySchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
  });

  return mongoose.models.Property || mongoose.model('Property', propertySchema);
};

interface IProperty {
  title: string;
  description: string;
  type: 'rent' | 'sale';
  propertyType: 'apartment' | 'house' | 'land' | 'commercial';
  price: number;
  location: {
    address: string;
    city: string;
    state?: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  features: {
    bedrooms?: number;
    bathrooms?: number;
    size?: number;
    amenities?: string[];
  };
  images: Array<{
    url: string;
    caption?: string;
  }>;
  status: 'pending' | 'approved' | 'rejected' | 'sold' | 'rented';
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getPropertyModel() {
  await connectToDatabase();
  return createModel();
}
